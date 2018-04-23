require('dotenv').config()
const request = require('request')
const cheerio = require('cheerio')
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const twilio = require('twilio')
const moment = require('moment')
const config = require('./config')

// twilio(SID, AUTH_TOKEN)
const twilioClient = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
const smtpClient = nodemailer.createTransport(smtpTransport({ service: "Gmail", auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS}}))

// production
let url = 'https://api.aion.network/aion/dashboard/view';
if (process.env.DEBUG) { 
  url = 'http://localhost:3000/aion/dashboard/view';
}

let phones = process.env.PHONE.split(",");
if (process.env.DEBUG) {
  phones = []
}

let emails = process.env.EMAIL.split(",");
if (process.env.DEBUG) {
  emails = ['ali@nuco.io']
}

const log = (msg, DEBUG_ONLY=false) => {
  if (DEBUG_ONLY && !process.env.DEBUG) return;
  console.log("[" + moment().format() + "] " + msg);
}

console.log('-------------------------------------------------------');
console.log('Aion Dashboard Watchdog');
console.log('-------------------------------------------------------');
console.log('watching url: ' + url)
console.log();
console.log('sending emails to: ')
console.log(emails);
console.log();
console.log('sending sms messages to:')
console.log(phones);
//console.log('-------------------------------------------------------');

// for each error, we have a { last triggered time / false }
let latch = 
{  
  config:
  {
    'LATCH_RESET_INTERVAL': config.LATCH_RESET_INTERVAL
  },
  error: 
  {
    'STALE_BLOCK': false,
    'EVENT_LOOP_ERR': false,
    'HTTP_BAD_RESPONSE': false
  },
  poll: 
  {
    blk: false,
    ts: false
  }
}

const validateEndpoint = function()
{ 
  request.get(url, function(error, response, body) 
  {
    if (!error && response != null && response.statusCode == 200 && body != null) {
      log("Valid response recieved from api");
      
      latch.error['HTTP_BAD_RESPONSE'] = false;
      detectStaleBlock(body, 'STALE_BLOCK');
    }
    else {
      const str = 'api.aion.network DOWN: ' + error.message;
      log(str);
      notifyAll('HTTP_BAD_RESPONSE', str, '');
    }
  });
}

const detectStaleBlock = function(apiResponse, latchKey) 
{
  let error = 'Aion Dashboard: Something went wrong with api response poll.';

  try {
    let json;

    try {
      json = JSON.parse(apiResponse);
    } catch (e) {
      throw "Aion Dashboard: API returned invalid json.";
    }

    if (!json || 
        !json.content ||
        !json.content[0] || 
        !json.content[0].kpi ||
        !json.content[0].kpi.currentBlockchainHead ||
        !Number.isInteger(json.content[0].kpi.currentBlockchainHead)) {
      throw "Aion Dashboard: reported blockchain invalid or irregular api response.";
    }

    let blkNow = json.content[0].kpi.currentBlockchainHead;
    log("Block reported: "+blkNow);
    
    if (!latch.poll.blk) {
      latch.poll.blk = blkNow;
      latch.poll.ts = moment();

      log("Block poll latch updating on first poll.");
    } 
    else {
      let blkDelta = blkNow - latch.poll.blk;
      // should not see the same block number twice. 
      if (!blkDelta || blkDelta < 1) {
        throw "Aion Dashboard: NOT UPDATING! - blkDelta: " + blkDelta;
      }

      log("Block progression observed: ("+blkNow+"-"+latch.poll.blk+") = "+blkDelta+". OK.");

      // update the latch: 
      latch.poll.blk = blkNow;
      latch.poll.ts = moment();
    }

    // we got here = success
    return;
  } 
  catch (e) {
    error = e;
  }

  // we got here = error
  log(error);

  notifyAll(latchKey, error, '');
}

// ----------------------------------------------------------------------------------------

const sendSms = function(recipients, subject)
{
  for(let key in recipients)
  {
    twilioClient.messages.create({
      from: process.env.TWILIO_NUMBER,
      to: recipients[key],
      body: subject
    }, (err, res) => 
    {
      if (err) {
        log('Error occurred with SMS client.');
      } 
      else {
        log('SMS sent to recipient: ' + recipients[key])
      } 
    }); 
  }
}

const sendEmails = function(recipients, subject, body) 
{
  for(let key in recipients)
  {
    smtpClient.sendMail({
      from: 'noreply@nuco.io', 
      to: recipients[key], 
      subject: subject,
      text: body
    }, (err, res) => 
    {
      if (err) {
        log('Error occurred with Email client.');
      } 
      else {
        log('Email sent to recipient: ' + recipients[key])
      } 
    });    
  }
}

// this gets called if we get into an error situation
// handles latching login
const notifyAll = function(error_key, subject, body) 
{
  if (latch.error[error_key] === false) 
  {
    sendNotification()
  }
  else if (latch.error[error_key] instanceof moment) 
  {
    const timeSinceLastNotification = moment.duration(moment().diff(latch.error[error_key]));
    if (timeSinceLastNotification.asMilliseconds() > latch.config['LATCH_RESET_INTERVAL'].asMilliseconds())
    {
      sendNotification()
    }
  }
  else 
  {
    // send notification without latching if somethings wrong with latching mechanism
    log('ERR: inconsistant latch state');
    sendNotification()
  }

  function sendNotification() {

    latch.error[error_key] = moment();
    log("| SENDING NOTIFICATION |");
    sendSms(phones, subject);
    sendEmails(emails, subject, body);
  }
}

const ncEventLoop = function()
{
  try {
    validateEndpoint();
  }
  catch(err) {
    const str = 'dashboard.aion.network: Error with watcher script. Please reboot.';
    log(str);
    log(err);

    notifyAll('EVENT_LOOP_ERR', str, '');
  }
  finally {
    // a visual 'frame' divider
    console.log('-------------------------------------------------------');
    setTimeout(ncEventLoop, config.POLLING_INTERVAL);
  }
}
ncEventLoop();

