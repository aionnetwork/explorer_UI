/* eslint-disable */
import axios from 'axios';
import SockJS from 'sockjs-client' 
import Stomp from 'stompjs'
import { trnListType, blkListType, tknListType, txnListType, accListType, cntrListType, eventListType } from 'lib/NCEnums';
import * as mock from 'lib/NCData';
import ms from 'ms';
import appConfig from '../../config.json';
import ENV from '../../env.json';

import qs from 'qs';

export const NCNETWORK_REQUESTS_ENABLED = true;
const JSONBigInt = require('json-bigint');
//export let NETWORK_LIST = [];

let HTTPS_ENABLED = true;
let BASE_URL = null;
let NETWORK_LIST =null;
let GA_KEY = null;
let HOME_URL = null;


if (process.env.NODE_ENV !== 'production') {

  if (
  appConfig!=null && 
  appConfig.api!=null &&
  appConfig.api.base_url!=null && 
  appConfig.api.https_enabled!=null) 
  {
    // setup the network parameters
    HTTPS_ENABLED = appConfig.api.https_enabled;
    BASE_URL = appConfig.api.base_url;
    HOME_URL =appConfig.site.base_url;
    NETWORK_LIST = appConfig.network_list['staging'];
    GA_KEY = appConfig.ga_key;
  }
  //console.log('dev Mode!');

      
}else{ 

    HTTPS_ENABLED = ENV.HTTPS_ENABLED;
    BASE_URL = ENV.BASE_URL;
    HOME_URL = ENV.HOME_URL;
    NETWORK_LIST = appConfig.network_list[ENV.NETWORK_LIST];
    GA_KEY = ENV.GA_KEY;  
}

export const NC_ENV={
  "HTTPS_ENABLED":HTTPS_ENABLED,
  "HOME_URL": HOME_URL,
  "BASE_URL": BASE_URL,
  "NETWORK_LIST": NETWORK_LIST,
  "GA_KEY":GA_KEY,
}



const stripTrailingSlash = (url) => {
  return url.replace(/\/$/, "");
}

const generateBaseUrl = (https, api, e) => {
  //console.log('generateBaseUrl');
  //console.log(api);
  let url = "";
  let str = "";

  if (https)
    url+="https://";
  else
    url+="http://";


    

  str=api;

  //console.log(str);
  url+=stripTrailingSlash(str);

  return url;
}

let net = null;
let enet = null;
let pnet = null;
export const endpointV2 ={
    search: {
          link: '/aion/v2/dashboard/search',
          params: ['searchParam']
      }
}
export const endpoint = {
  block: {
    list: {
      [blkListType['ALL']]: {
        link: '/aion/dashboard/getBlockList',
        params: ['page', 'size',"timestampStart", "timestampEnd"]//,"timestampStart", "timestampEnd"
      },
      [blkListType['BY_ACCOUNT']]: {
        link: '/aion/dashboard/getBlocksMinedByAddress',
        params: ['searchParam', 'page', 'size',"timestampStart", "timestampEnd"]
      }
    },
    detail: {
      link: '/aion/dashboard/getBlockAndTransactionDetailsFromBlockNumberOrBlockHash',//getBlockAndTransactionDetailsFromBlockNumberOrBlockHash
      params: ['searchParam']
    }
  },
  transaction: {
    list: {
      [txnListType['ALL']]: {
        link: '/aion/dashboard/getTransactionList',//getTransactionListByRange
        params: ['page', 'size',"timestampStart", "timestampEnd"]
      },
      [txnListType['ALL_RANGE']]: {
        link: '/aion/dashboard/getTransactionList',//getTransactionListByRange/getTransactionList
        params: ['page', 'size',"timestampStart", "timestampEnd"]
      },
      [txnListType['BY_ACCOUNT']]: {
        link: '/aion/dashboard/getTransactionsByAddress',
        //params: ['searchParam', 'transactionPage', 'transactionSize','token'],
        params:["accountAddress","tokenAddress","page","size","timestampStart", "timestampEnd"]
      },
      [txnListType['BY_ACCOUNT_RANGE']]: {
        link: '/aion/dashboard/getTransactionsByAddressAndRange',
        //params: ['searchParam', 'transactionPage', 'transactionSize','token'],
        params:["accountAddress","tokenAddress","page","size","timestampStart", "timestampEnd"]
      },
      [txnListType['BY_BLOCK']]: {
        link: '/aion/dashboard/findTransactionByBlockNumberOrBlockHash',
        params: ['searchParam','token']
      }
    },
    detail: {
      link: '/aion/dashboard/getTransactionDetailsByTransactionHash',
      params: ['searchParam','token']
    }
  },
  transfer:{
    list:{
      [trnListType['BY_ACCOUNT']]: {
        link: '/aion/dashboard/getInternalTransfersByAddress',
        //params: ['searchParam', 'transactionPage', 'transactionSize','token'],
        params:["accountAddress","page","size","timestampStart", "timestampEnd"]
      },
      [trnListType['BY_TXN']]: {
        link: '/aion/dashboard/getInternalTransfersByTransactionHash',
        //params: ['searchParam', 'transactionPage', 'transactionSize','token'],
        params:["transactionHash","page","size","timestampStart", "timestampEnd"]
      },

    }

  },  
  token: {
    list: {
      [tknListType['ALL']]: {
        link: '/aion/dashboard/getTokenList',
        params: ['page', 'size',"timestampStart", "timestampEnd"]
      },
      [tknListType['BY_ACCOUNT']]: {
        link: '/aion/dashboard/getTokensByAddress',
        params: ['searchParam']
      }
    },
    detail: {
      //link: '/aion/dashboard/getTokenAndTransactionAndAccountDetailsByContractAddress',
      link: '/aion/dashboard/getTokenDetailsTransfersAndHoldersByContractAddress',
      params: ['searchParam','transfersPage','transfersSize','holdersPage','holdersSize']
    }
  },
  account: {
    list: {
      link: '/aion/dashboard/getDailyAccountStatistics',
      params: []
    },
    rich:{
        link: '/aion/dashboard/getRichList',
        params: []
    },
    detail: {
      link: '/aion/dashboard/getAccountDetails',
      params: ['accountAddress','tokenAddress']
    }
  },
  dashboard: {
    link: '/aion/dashboard/view',
    params: []
  },
  detail: {
      link: '/aion/dashboard/search',
      params: ['searchParam']
  },
  search: {
      link: '/aion/dashboard/search',
      params: ['searchParam']
  },
  contract: {
    list: {

      link: '/aion/dashboard/getContractList',
      params: ['page', 'size']
      /*cntrListType['ALL']]: {
        link: '/aion/dashboard/getContractList',
        params: ['page', 'size']
      },
      [cntrListType['BY_ACCOUNT']]: {
        link: '/aion/dashboard/getcontractByCreator',
        params: ['searchParam']
      }*/
    },
    detail: {
      link: '/aion/dashboard/getContractDetailsByContractAddress',//a005fba9e3929857d021a75daf1b343bcd82268cf9b4c7bd393a6a23b36966ab
      params: ['searchParam','transactionsPage','transactionsSize','contractAddress','eventPage','eventSize','transactionsPage','transactionsSize']
      //params: ["searchParam", "eventsPage","eventsSize","transactionsPage","transactionsSize"]
    }
  },
  event: {
    list: {
      [eventListType['ALL']]: {
        link: '/aion/dashboard/getContractList',
        params: ['page', 'size']
      },
      [eventListType['BY_ACCOUNT']]: {
        link: '/aion/dashboard/getcontractByCreator',
        params: ['searchParam']
      }
    }
  },
  chart:{
    detail:{
      link:'/aion/dashboard/getGraphingInfo',
      params:['type']
    }
  },
  /*//
    exportBlockTxns(g-recaptcha-response, blockNumber, rangeMin, rangeMax)
    exportBlockDetails(g-recaptcha-response, blockNumber)
    exportTokenHdrs(g-recaptcha-response, tokenAddress, rangeMin, rangeMax)
    exportTokenTxfs(g-recaptcha-response, tokenAddress, rangeMin, rangeMax)
    exportTokenDetails(g-recaptcha-response, tokenAddress)
    exportContractEvts(g-recaptcha-response, contractAddress, rangeMin, rangeMax)
    exportContractTxns(g-recaptcha-response, contractAddress, rangeMin, rangeMax)
    exportContractDetails(g-recaptcha-response, contractAddress)
    exportAccountBlks(g-recaptcha-response, accountAddress, rangeMin, rangeMax)
    exportAccountTkns(g-recaptcha-response, accountAddress, rangeMin, rangeMax)
    exportAccountTxns(g-recaptcha-response, accountAddress, tokenAddress, rangeMin, rangeMax)
    exportTransactionDetails(g-recaptcha-response, transactionHash)
    exportAccountDetails(g-recaptcha-response, accountAddress, tokenAddress)
  */
  download:{
    detail:{
      link:'/downloads/exportToCsv', //exportAccountTxns(g-recaptcha-response, accountAddress, tokenAddress, rangeMin, rangeMax)
      params:['searchParam1','searchParam2', 'entityType','rangeMin1','rangeMax1','g-recaptcha-response']
    },
    accountTxns:{
      link:'/downloads/exportAccountTxns', //exportAccountTxns(g-recaptcha-response, accountAddress, tokenAddress, rangeMin, rangeMax)
      params:['accountAddress','tokenAddress',"timestampStart", "timestampEnd",'g-recaptcha-response']
    }
  },
  contact:{
    detail:{
      link:'/app/sendFeedback',
      params:['topic','message','g-recaptcha-response']
    }
  }
}

export const request = async (endpoint, params,sub_base=false) => 
{
  //console.log('networkrequestTopLevel');
  
  return new Promise((resolve, reject) => 
  {
    let args = { params: {} };
    if (Array.isArray(params)) {
      params.forEach((value, i) => {
        if(value!==''){args.params[endpoint.params[i]] = value;}
      });
    }
    
    if ( net == null && BASE_URL) {
      //console.log('create endpoint!'+sub_base);
      net = axios.create({
          baseURL: generateBaseUrl(HTTPS_ENABLED, BASE_URL,sub_base),
          timeout: 120000,
          transformResponse:[function (data) {
              
              return JSONBigInt.parse(data)
              
            }]

          });
    }

    if (net) {
      net.get(endpoint.link, args)
      .then((response) => {
        //console.log(response);
        
        if (response.status == 200 && response.data){
          //console.log(JSON.stringify(response));
          resolve(response.data);
        }
        else {
          reject("ERR: Bad API get response.");
        }
      })
      .catch((error) => {
        console.log(error);
        reject("ERR: Bad API get response.")
      });
    } else {
      reject("ERR: API not initialized");
    }
  });
}

export const downloadRequest = async (endpoint, params,sub_base=false) => 
{
  //console.log('networkrequestTopLevel');
  
  return new Promise((resolve, reject) => 
  {
    let args = { params: {} };
    if (Array.isArray(params)) {
      params.forEach((value, i) => {
        if(value!==''){args.params[endpoint.params[i]] = value;}
      });
    }
    
    if ( net == null && BASE_URL) {
      //console.log('create endpoint!'+sub_base);
      net = axios.create({
          baseURL: generateBaseUrl(HTTPS_ENABLED, BASE_URL,sub_base),
          timeout: 120000,
          responseType:"text"
          
          });
    }

    if (net) {
      net.get(endpoint.link, args)
      .then((response) => {
        console.log(response);
        
        if (response.status == 200 && response.data){
          //console.log(JSON.stringify(response));
          resolve(response.data);
        }
        else {
          reject("ERR: Bad API get response.");
        }
      })
      .catch((file) => {
        
        resolve(file.text);
        
      });
    } else {
      reject("ERR: API not initialized");
    }
  });
}

export const Request = async (endpoint, params,sub_base=false) => 
{
  //console.log(JSON.stringify(endpoint));
  return new Promise((resolve, reject) => 
  {
    let args = { params: {} };
    if (Array.isArray(params)) {
      params.forEach((value, i) => {
        args.params[endpoint.params[i]] = value;
      });
    }

    
    if (pnet == null && BASE_URL) {
      //console.log('create post endpoint!'+sub_base);
      pnet = axios.create({
          baseURL: generateBaseUrl(HTTPS_ENABLED, BASE_URL,sub_base),
          timeout: ms('2min')
        });
    }

      //console.log(endpoint.link);
      //console.log(generateBaseUrl(HTTPS_ENABLED, BASE_URL,sub_base));

      const url = generateBaseUrl(HTTPS_ENABLED, BASE_URL,sub_base)+endpoint.link;
      const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(args.params),
        url,
      };

      
      

      axios(options).then((response) => {
    
        resolve(response.data);
    
      })
      .catch((error) => {
          //console.log(JSON.stringify(error)); 
          reject("ERR: Bad API get response.");   
       });
      
      


  });
}

export const postRequest = async (endpoint, params,sub_base=false) => 
{
  //console.log(JSON.stringify(endpoint));
  return new Promise((resolve, reject) => 
  {
    let args = { params: {} };
    if (Array.isArray(params)) {
      params.forEach((value, i) => {
        args.params[endpoint.params[i]] = value;
      });
    }

    
    if (pnet == null && BASE_URL) {
      //console.log('create post endpoint!'+sub_base);
      pnet = axios.create({
          baseURL: generateBaseUrl(HTTPS_ENABLED, BASE_URL,sub_base),
          timeout: ms('2min')
        });
    }

      //console.log(endpoint.link);
      //console.log(generateBaseUrl(HTTPS_ENABLED, BASE_URL,sub_base));

      const url = generateBaseUrl(HTTPS_ENABLED, BASE_URL,sub_base)+endpoint.link;
      const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(args.params),
        url,
      };

      
      

      axios(options).then((response) => {
    
        resolve(response.data);
    
      })
      .catch((error) => {
          //console.log(JSON.stringify(error)); 
          reject("ERR: Bad API get response.");   
       });
      
      


  });
}
//eRequest('pro-api.coinmarketcap.com/v1/cryptocurrency/',true,'/listings/latest','{start: 1,limit: 5,convert: "USD"}',"{'X-CMC_PRO_API_KEY': 'e2738416-a8f2-4b17-ba40-eb376dff4d15'}");
//External Endpoint Request
export const eRequest = async(url,ssl,endpoint, params, headers) => {
  return new Promise((resolve, reject) => 
  {
    let args = { params: {} };
    let hargs = {};
    if (Array.isArray(params)) {
      params.forEach((value, i) => {
        args.params[endpoint.params[i]] = value;
      });
    }

    if (Array.isArray(headers)) {
      params.forEach((value, i) => {
        hargs[endpoint.headers[i]] = value;
      });
    }
    
    if (enet == null && url) {
      enet = axios.create({
          baseURL: generateBaseUrl(ssl, url),
          timeout: ms('2min'),
          headers: hargs
        });

    }

    if (enet) {

      enet.get(endpoint, args)
      .then((response) => {
        
        if (response.status == 200 && response.data)
          resolve(response.data);
        else {
          reject("ERR: BBad External API response.");
        }
      })
      .catch((error) => {
        console.log(error);
        reject("ERR: Bad External API response.")
      });
    } else {
      reject("ERR: External API not initialized");
    }
  });


}


// -------------------------------------------------
// Stomp Socket Connection
// -------------------------------------------------

let sock = null;
let stompClient = null;
const MOCK_POLL_INTERVAl = 5000; // 5s

export const connectSocket = (dashboardCallback) => {
  if (NCNETWORK_REQUESTS_ENABLED) {
    // make the real subscribe
    //console.log('generateBaseUrl');
    if (!sock || sock.readyState >= 3) 
    { 
      sock = new SockJS(generateBaseUrl(HTTPS_ENABLED, BASE_URL) + '/aion/dashboard-interface');
      
      stompClient = Stomp.over(sock);
      stompClient.debug = null;
      stompClient.connect({}, function(frame) {
        //console.log('socket connect');
        stompClient.subscribe('/aion/dashboard/view', (response) => { 
          try {
            const body = JSON.parse(response.body);
            //console.log('socket subscribe');
            dashboardCallback(body) 
          } 
          catch(error) {
            console.log(error);
          }
          
        });
        //console.log('socket leave');
      });
    }
  } else {
    // setup a mock process to feed me dummy data.
    const mockPublish = () => { 
      setTimeout(() => {
        let dashboard = Object.assign({}, mock.dashboard);  
        // TODO: do some manipulation on data to mock changing data;
        // ...
        dashboardCallback(dashboard);
        mockPublish();
      }, MOCK_POLL_INTERVAl);
    };
    mockPublish();
  }
}

export function disconnectSocket() {
  if (stompClient)
    stompClient.disconnect()
}

export let intervalID = null;

export function startInterval(endpoint, params,func) {
    //console.log(JSON.stringify(endpoint));
    intervalID = setInterval(
      function(){ 

        //console.log('Endpoint in interval: '+JSON.stringify(endpoint));
        
        request(endpoint, params)
        .then((response) => {
          //setDashboardData(response);
          func(response);//callback function
        })
        .catch((error) => {
          console.log(error);    
        });      

      },
      10000,endpoint, params,func);//10 seconds interval
}



export function stopInterval(Interval) {
    clearInterval(Interval);
}

