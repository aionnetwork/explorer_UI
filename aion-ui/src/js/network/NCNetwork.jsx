/* eslint-disable */
import axios from 'axios';
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { blkListType, tknListType, txnListType, accListType, cntrListType, eventListType } from 'lib/NCEnums';
import * as mock from 'lib/NCData';
import ms from 'ms';
import appConfig from '../../config.json';

export const NCNETWORK_REQUESTS_ENABLED = true;
export let NETWORK_LIST = [];

let HTTPS_ENABLED = true;
let BASE_URL = null;
if (
  appConfig!=null && 
  appConfig.api!=null &&
  appConfig.api.base_url!=null && 
  appConfig.api.https_enabled!=null) 
{
  // setup the network parameters
  HTTPS_ENABLED = appConfig.api.https_enabled;
  BASE_URL = appConfig.api.base_url;
}

const stripTrailingSlash = (url) => {
  return url.replace(/\/$/, "");
}

const generateBaseUrl = (https, api) => {
  let url = "";

  if (https)
    url+="https://"
  else
    url+="http://"

  url+=stripTrailingSlash(api);

  return url;
}

let net = null;
let enet = null;
export const endpoint = {
  block: {
    list: {
      [blkListType['ALL']]: {
        link: '/dashboard/getBlockList',
        params: ['page', 'size']
      },
      [blkListType['BY_ACCOUNT']]: {
        link: '/dashboard/getBlocksMinedByAddress',
        params: ['searchParam', 'blockPage', 'blockSize']
      }
    },
    detail: {
      link: '/dashboard/getBlockAndTransactionDetailsFromBlockNumberOrBlockHash',
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
        params: ['searchParam', 'transactionPage', 'transactionSize','token']
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
      [cntrListType['ALL']]: {
        link: '/dashboard/getContractList',
        params: ['page', 'size']
      },
      [cntrListType['BY_ACCOUNT']]: {
        link: '/dashboard/getcontractByCreator',
        params: ['searchParam']
      }
    },
    detail: {
      link: '/dashboard/getContractDetailsByContractAddress',
      params: ['searchParam']
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
      link:'/dashboard/charts',
      param:['searchParam']
    }
  }
}

export const request = async (endpoint, params) => 
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
    
    if (net == null && BASE_URL) {
      net = axios.create({
          baseURL: generateBaseUrl(HTTPS_ENABLED, BASE_URL),
          timeout: ms('2min')
        });
    }

    if (net) {
      net.get(endpoint.link, args)
      .then((response) => {
        
        if (response.status == 200 && response.data)
          resolve(response.data);
        else {
          reject("ERR: Bad API response.");
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
    if (!sock || sock.readyState >= 3) 
    { 
      sock = new SockJS(generateBaseUrl(HTTPS_ENABLED, BASE_URL) + '/dashboard-interface');
      
      stompClient = Stomp.over(sock);
      stompClient.debug = null;
      stompClient.connect({}, function(frame) {
        stompClient.subscribe('/dashboard/view', (response) => { 
          try {
            const body = JSON.parse(response.body);
            //console.log('ws: ', body);
            dashboardCallback(body) 
          } 
          catch(error) {
            console.log(error);
          }
          
        });
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