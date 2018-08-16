/* eslint-disable */
import axios from 'axios';
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { blkListType, txnListType, accListType } from 'lib/NCEnums';
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
        params: ['page', 'size']
      },
      [txnListType['BY_ACCOUNT']]: {
        link: '/dashboard/getTransactionsByAddress',
        params: ['searchParam', 'transactionPage', 'transactionSize']
      },
      [txnListType['BY_BLOCK']]: {
        link: '/dashboard/findTransactionByBlockNumberOrBlockHash',
        params: ['searchParam']
      }
    },
    detail: {
      link: '/dashboard/findByTransactionHash',
      params: ['searchParam']
    }
  },
  token: {
    list: {
      [txnListType['ALL']]: {
        link: '/dashboard/getTokenList',
        params: ['page', 'size']
      },
      [txnListType['BY_ACCOUNT']]: {
        link: '/dashboard/getTransactionsByAddress',
        params: ['searchParam', 'transactionPage', 'transactionSize']
      }
    },
    detail: {
      link: '/dashboard/findByTransactionHash',
      params: ['searchParam']
    }
  },
  account: {
    list: {
      link: '/dashboard/getAccountStatistics',
      params: []
    },
    detail: {
      link: '/dashboard/getAccountDetails',
      params: ['searchParam']
    }
  },
  dashboard: {
    link: '/dashboard/view',
    params: []
  }
}

export const request = async (endpoint, params) => 
{
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
        //console.log(response)
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