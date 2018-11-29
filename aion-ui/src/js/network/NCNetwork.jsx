/* eslint-disable */
import axios from 'axios';
import SockJS from 'sockjs-client' 
import Stomp from 'stompjs'
import { blkListType, tknListType, txnListType, accListType, cntrListType, eventListType } from 'lib/NCEnums';
import * as mock from 'lib/NCData';
import ms from 'ms';
import appConfig from '../../config.json';
import ENV from '../../env.json';

export const NCNETWORK_REQUESTS_ENABLED = true;
//export let NETWORK_LIST = [];

let HTTPS_ENABLED = true;
let BASE_URL = null;
let NETWORK_LIST =null;
let GA_KEY = null;
let HOME_URL = null;
/*if (
  appConfig!=null && 
  appConfig.api!=null &&
  appConfig.api.base_url!=null && 
  appConfig.api.https_enabled!=null) 
{
  // setup the network parameters
  HTTPS_ENABLED = appConfig.api.https_enabled;
  BASE_URL = appConfig.api.base_url;
}*/

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
  console.log('dev Mode!');

      
}else{ 

    HTTPS_ENABLED = true;
    BASE_URL = ENV.BASE_URL;
    HOME_URL = ENV.HOME_URL;
    NETWORK_LIST = ENV.NETWORK_LIST;
    GA_KEY = ENV.GA_KEY;  
}

export const NC_ENV={
  "HTTPS_ENABLED":HTTPS_ENABLED,
  "BASE_URL": BASE_URL,
  "NETWORK_LIST": NETWORK_LIST,
  "GA_KEY":GA_KEY,
}



const stripTrailingSlash = (url) => {
  return url.replace(/\/$/, "");
}

const generateBaseUrl = (https, api, e) => {
  console.log('generateBaseUrl');
  //console.log(api);
  let url = "";
  let str = "";

  if (https)
    url+="https://"
  else
    url+="http://"


  if(e)
    str= api.slice(0,-5);
  else
    str=api

  console.log(str);
  url+=stripTrailingSlash(str);

  return url;
}

let net = null;
let enet = null;
let pnet = null;

export const endpoint = {
  block: {
    list: {
      [blkListType['ALL']]: {
        link: '/dashboard/getBlockList',
        params: ['page', 'size']
      },
      [blkListType['BY_ACCOUNT']]: {
        link: '/dashboard/getBlocksMinedByAddress',
        params: ['searchParam', 'page', 'size']
      }
    },
    detail: {
      link: '/dashboard/getBlockAndTransactionDetailsFromBlockNumberOrBlockHash',//getBlockAndTransactionDetailsFromBlockNumberOrBlockHash
      params: ['searchParam']
    }
  },
  transaction: {
    list: {
      [txnListType['ALL']]: {
        link: '/dashboard/getTransactionList',
        params: ['page', 'size','token']
      },
      [txnListType['BY_ACCOUNT']]: {
        link: '/dashboard/getTransactionsByAddress',
        //params: ['searchParam', 'transactionPage', 'transactionSize','token'],
        params:["accountAddress","tokenAddress","page","size"]
      },
      [txnListType['BY_BLOCK']]: {
        link: '/dashboard/findTransactionByBlockNumberOrBlockHash',
        params: ['searchParam','token']
      }
    },
    detail: {
      link: '/dashboard/getTransactionDetailsByTransactionHash',
      params: ['searchParam','token']
    }
  },
  
  token: {
    list: {
      [tknListType['ALL']]: {
        link: '/dashboard/getTokenList',
        params: ['page', 'size']
      },
      [tknListType['BY_ACCOUNT']]: {
        link: '/dashboard/getTokensByAddress',
        params: ['searchParam']
      }
    },
    detail: {
      //link: '/dashboard/getTokenAndTransactionAndAccountDetailsByContractAddress',
      link: '/dashboard/getTokenDetailsTransfersAndHoldersByContractAddress',
      params: ['searchParam']
    }
  },
  account: {
    list: {
      link: '/dashboard/getDailyAccountStatistics',
      params: []
    },
    detail: {
      link: '/dashboard/getAccountDetails',
      params: ['accountAddress','tokenAddress']
    }
  },
  dashboard: {
    link: '/dashboard/view',
    params: []
  },
  detail: {
      link: '/dashboard/search',
      params: ['searchParam']
  },
  search: {
      link: '/dashboard/search',
      params: ['searchParam']
  },
  contract: {
    list: {

      link: '/dashboard/getContractList',
      params: ['page', 'size']
      /*cntrListType['ALL']]: {
        link: '/dashboard/getContractList',
        params: ['page', 'size']
      },
      [cntrListType['BY_ACCOUNT']]: {
        link: '/dashboard/getcontractByCreator',
        params: ['searchParam']
      }*/
    },
    detail: {
      link: '/dashboard/getContractDetailsByContractAddress',//a005fba9e3929857d021a75daf1b343bcd82268cf9b4c7bd393a6a23b36966ab
      params: ['searchParam','holdersPage','holdersSize','transfersPage','transfersSize']
      //params: ["searchParam", "eventsPage","eventsSize","transactionsPage","transactionsSize"]
    }
  },
  event: {
    list: {
      [eventListType['ALL']]: {
        link: '/dashboard/getContractList',
        params: ['page', 'size']
      },
      [eventListType['BY_ACCOUNT']]: {
        link: '/dashboard/getcontractByCreator',
        params: ['searchParam']
      }
    }
  },
  chart:{
    detail:{
      link:'/dashboard/getGraphingInfo',
      params:['type']
    }
  },
  download:{
    detail:{
      link:'/downloads/exportToCsv', //exportAccountTxns(g-recaptcha-response, accountAddress, tokenAddress, rangeMin, rangeMax)
      params:['searchParam1','searchParam2', 'entityType','rangeMin1','rangeMax1','g-recaptcha-response']
    }
  },
  contact:{
    detail:{
      link:'/feedback/sendFeedback',
      params:['topic','message','g-recaptcha-response']
    }
  }
}

export const request = async (endpoint, params,sub_base=false) => 
{
  console.log('networkrequestTopLevel');
  
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
          timeout: 120000
        });
    }

    if (net) {
      net.get(endpoint.link, args)
      .then((response) => {
        
        if (response.status == 200 && response.data)
          resolve(response.data);
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
      console.log('create post endpoint!'+sub_base);
      pnet = axios.create({
          baseURL: generateBaseUrl(HTTPS_ENABLED, BASE_URL,sub_base),
          timeout: ms('2min')
        });
    }

    if (pnet) {
      console.log('post');
      pnet.post(endpoint.link, args)
      .then((response) => {
        
        if (response.status == 200 && response.data){
          resolve(response.data);
          console.log('post success');
        }else {
          console.log('error');
          reject("ERR: Bad API post response.");
        }
      })
      .catch((error) => {
        console.log(error);
        reject("ERR: Bad API response.")
      });
    } else {
      reject("ERR: API not initialized");
    }
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
    console.log('generateBaseUrl');
    if (!sock || sock.readyState >= 3) 
    { 
      sock = new SockJS(generateBaseUrl(HTTPS_ENABLED, BASE_URL) + '/dashboard-interface');
      
      stompClient = Stomp.over(sock);
      stompClient.debug = null;
      stompClient.connect({}, function(frame) {
        console.log('socket connect');
        stompClient.subscribe('/dashboard/view', (response) => { 
          try {
            const body = JSON.parse(response.body);
            console.log('socket subscribe');
            dashboardCallback(body) 
          } 
          catch(error) {
            console.log(error);
          }
          
        });
        console.log('socket leave');
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

export function myFunction(request, func) {
    setInterval(
      function(){ 
        
        const ep = network.endpoint.dashboard;
        let params = [];

        //console.log(ep);
        request(ep, params)
        .then((response) => {
          setDashboardData(response);
          func(response)//callback function
        })
        .catch((error) => {
          console.log(error);    
        });      

      },
      10000);//10 seconds interval
}
// -------------------------------------------------
// Load App Configuration
// -------------------------------------------------
/*
const APP_CONFIG_LOCATION = '/config.json';
export const configuration = async () => 
{
  return new Promise((resolve, reject) => 
  {
    axios.get(APP_CONFIG_LOCATION)
    .then(function (response) {
      if (response.status != 200 || !response.data) {
        reject("ERR: Bad network response.");
        return;
      }

      let r = response.data;

      if (
        r!=null && 
        r.api!=null && 
        r.api.base_url!=null && 
        r.api.https_enabled!=null) 
      {
        // setup the network parameters
        HTTPS_ENABLED = r.api.https_enabled;
        BASE_URL = r.api.base_url;

        resolve(r);
      } else {
        reject("ERR: could not parse "+APP_CONFIG_LOCATION);
        return;
      }
    })
    .catch(function (e1) {
      reject(e1);
    });
  });
}*/