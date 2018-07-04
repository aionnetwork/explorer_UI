/* eslint-disable */
import axios from 'axios';
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { blkListType, txnListType, accListType } from 'lib/NCEnums';
import * as mock from 'lib/NCData';

export const NCNETWORK_REQUESTS_ENABLED = true;

const HTTPS_ENABLED = true;
const BASE_URL = 'mainnet-api.aion.network/aion';

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

const net = axios.create({
  baseURL: generateBaseUrl(HTTPS_ENABLED, BASE_URL),
  timeout: 0
});

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
        link: '/dashboard/getTransactionsFromAddress',
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
  account: {
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





