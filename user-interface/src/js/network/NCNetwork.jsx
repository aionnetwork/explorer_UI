/* eslint-disable */
import axios from 'axios';
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { blkListType, txnListType, accListType } from 'lib/NCEnums';
import * as mock from 'lib/NCData';

export const NCNETWORK_REQUESTS_ENABLED = true;

const HTTPS_ENABLED = true;
const BASE_URL = 'api.aion.network/aion';

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
        link: '/blocks',
        params: ['page', 'size', 'sort']
      },
      [blkListType['BY_ACCOUNT']]: {
        link: '/blocks/search/findByMinerAddress',
        params: ['minerAddress', 'page', 'size', 'sort']
      }
    },
    detail: {
      link: '/dashboard/getBlockAndTransactionDetailsFromBlockNumberOrBlockHash',
      params: ['searchParam', 'transactionPageNumber', 'transactionPageSize', ]
    }
  },
  transaction: {
    list: {
      [txnListType['ALL']]: {
        link: '/transactions',
        params: ['page', 'size', 'sort']
      },
      [txnListType['BY_ACCOUNT']]: {
        link: '/transactions/search/findByFromAddrOrToAddr',
        params: ['fromAddr', 'toAddr', 'page', 'size', 'sort']
      },
      [txnListType['BY_BLOCK']]: {
        link: '/dashboard/findTransactionByBlockNumberOrBlockHash',
        params: ['searchParam', 'transactionPageNumber', 'transactionPageSize']
      }
    },
    detail: {
      link: '/dashboard/findByTransactionHash',
      params: ['searchParam']
    }
  },
  account: {
    list: {
      [accListType['ALL']]: {
        link: '/accounts',
        params: ['page', 'size', 'sort']
      }
    },
    detail: {
      link: '/dashboard/getBlockAndTransactionDetailsFromAccount',
      params: ['accountAddress', 'blockPageNumber', 'blockPageSize', 'transactionPageNumber', 'transactionPageSize']
    }
  },
  search: {
    link: '/dashboard/search',
    params: ['searchParam']
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
        // do some manipulation on data to mock changing data;
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





