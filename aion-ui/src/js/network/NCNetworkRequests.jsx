/* eslint-disable */
import * as network from 'network/NCNetwork';
import { store } from 'stores/NCReduxStore';
import { Router, Route, IndexRedirect, hashHistory} from 'react-router';

import * as mock from 'lib/NCData';

 import * as fileDownload from 'js-file-download';

import * as StoreKpis from 'stores/StoreKpis';
import * as StoreDark from 'stores/StoreDark';

import * as StoreBlkRt from 'stores/StoreBlkRt';
import * as StoreBlkList from 'stores/StoreBlkList';
import * as StoreBlkRetrieve from 'stores/StoreBlkRetrieve';

import * as StoreTxnRt from 'stores/StoreTxnRt';
import * as StoreTxnList from 'stores/StoreTxnList';
import * as StoreTxnRetrieve from 'stores/StoreTxnRetrieve';

import * as StoreTknList from 'stores/StoreTknList';
import * as StoreTknRetrieve from 'stores/StoreTknRetrieve';

import * as StoreAccList from 'stores/StoreAccList';
import * as StoreRichList from 'stores/StoreRichList';
import * as StoreAccRetrieve from 'stores/StoreAccRetrieve';

import * as StoreCntrList from 'stores/StoreCntrList';
import * as StoreCntrRetrieve from 'stores/StoreCntrRetrieve';

import * as StoreChartRetrieve from 'stores/StoreChartRetrieve';

import * as StoreRetrieve from 'stores/StoreRetrieve';

import * as StoreContactRetrieve from 'stores/StoreContactRetrieve';

import {BigNumber} from 'bignumber.js';
import {nc_LinkToEntity, nc_getChartData, nc_isObjectEmpty, nc_trim, nc_isValidEntity, nc_isPositiveInteger, nc_sanitizeHex, nc_isObjectValid } from 'lib/NCUtility';
import { cntrListType, tknListType, txnListType, blkListType, accListType, eventListType,trnListType, txnLogListType} from 'lib/NCEnums';


//console.log('networkRequest'); 
export const PAGE_SIZE = 25;

// network.NCNETWORK_REQUESTS_ENABLED
// network.endpoint
// network.request
// network.connectSocket
// network.disconnectSocket

// ========================================================
// Blocks 
// ========================================================

export const getBlkListTopLevel = (listType, queryStr) => {
  store.dispatch(StoreBlkList.GetTopLevel({
    queryStr: queryStr,
    listType: listType,
  }));

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    // make the network request
    setTimeout(() => {
      let response = mock.blkList;
      store.dispatch(StoreBlkList.SetTopLevel(response));
    }, 500);
  }
  else {
    // get block list
    const ep = network.endpoint.block.list[listType];
    let params = [];
    switch(listType) {
      case blkListType.ALL: {
        params = [0, PAGE_SIZE]
        break;
      }
    }
    network.request(ep, params)
    .then((response) => {
      store.dispatch(StoreBlkList.SetTopLevel(response));
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreBlkList.SetTopLevel({}));
    });
  }
}

export const getBlkListPaging = (listType, queryStr, pageNumber,pageSize=0, start=null, end=null) => {
  store.dispatch(StoreBlkList.GetPaging());

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = Object.assign({}, store.getState().blkList.response);
      response.page.number = pageNumber;
      store.dispatch(StoreBlkList.SetPaging(response));
    }, 500);
  }
  else {
    const ep = network.endpoint.block.list[listType];
    let size = (pageSize > PAGE_SIZE) ? pageSize : PAGE_SIZE;
    //console.log(size);
    let params = [];
    switch(listType) {
      case blkListType.ALL: {
        if(start!==null){
          params = [pageNumber, size, start, end];
        }else{
          params = [pageNumber, size];
        }
        break; 
      }
    }
    network.request(ep, params)
    .then((response) => {
      store.dispatch(StoreBlkList.SetPaging(response));
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreBlkList.SetPaging({}));
    });
  }
}

export const getBlkRetrieveTopLevel = (queryStr) => {
  store.dispatch(StoreBlkRetrieve.GetTopLevel({
    queryStr: queryStr
  }));

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = {
        blk: mock.blk,
        txn: mock.txnListArry
      };
      store.dispatch(StoreBlkRetrieve.SetTopLevel(response));
    }, 500);
  }
  else {
    // sanitize input string
    let request = nc_trim(queryStr);
    if (!nc_isPositiveInteger(request) && !nc_isValidEntity(request)) {
      store.dispatch(StoreBlkRetrieve.SetTopLevel({
        blk: {
          content: {}
        },
        txn: {}
      }));
      return;
    }

    // get block details
    const ep = network.endpoint.block.detail;
    let params = [request,  0, PAGE_SIZE];
    network.request(ep, params)
    .then((response) => {
      
      let transactionDetails = { content:[] };
      let internalTransactions = { content:[] };
      let blockDetails = response;
      if (response && response.content && response.content[0] && response.content[0].transactionList) {
        let txnList = response.content[0].transactionList;
        transactionDetails = {
          content: txnList
        }
        //get internal transactions
        let ep_2 = network.endpointV2.transfer.list[trnListType.BY_BLOCK];
        network.request(ep_2,params).then((res)=>{
            internalTransactions = res;
              store.dispatch(StoreBlkRetrieve.SetTopLevel({
                blk: blockDetails,
                txn: transactionDetails,
                itxn: internalTransactions
              }));
        }).catch((err)=>{
         console.log(err);
        });
      }else{
          store.dispatch(StoreBlkRetrieve.SetTopLevel({
            blk: blockDetails,
            txn: transactionDetails,
            itxn: internalTransactions
          }));
      }
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreBlkRetrieve.SetTopLevel({
        blk: {},
        txn: {}
      }));
    });
  }
}

// ========================================================
// Transactions 
// ========================================================

export const getTxnListTopLevel = (listType, queryStr) => {
  store.dispatch(StoreTxnList.GetTopLevel({
    queryStr: queryStr,
    listType: listType,
  }));

 
  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = mock.txnList;
      store.dispatch(StoreTxnList.SetTopLevel(response));
    }, 500);
  }
  else {
    // get transaction list
    const ep = network.endpoint.transaction.list[listType];
    let params = [];
    let request = nc_trim(queryStr);

    switch(listType) {
      case txnListType.ALL: {
        params = [0, PAGE_SIZE]
        break;
      }
      case txnListType.BY_BLOCK: {
        if (!nc_isPositiveInteger(request) && !nc_isValidEntity(request)) {
          store.dispatch(StoreTxnList.SetTopLevel({ content:[] }));
          return;
        }

        params = [request]
        break;
      }
    }

    network.request(ep, params)
    .then((response) => {
      store.dispatch(StoreTxnList.SetTopLevel(response));
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreTxnList.SetTopLevel({}));
    });
  }
}

export const getTxnListPaging = (listType, queryStr, pageNumber, pageSize, start=null, end=null) => {
  store.dispatch(StoreTxnList.GetPaging());

  //console.log('txn list paging');

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = Object.assign({}, store.getState().txnList.response);
      response.page.number = pageNumber;

      store.dispatch(StoreTxnList.SetPaging(response));
    }, 500);
  }
  else {

    //console.log(listType);
    const ep = ((start!==null)&&(start>0)) ? network.endpoint.transaction.list[3] : network.endpoint.transaction.list[listType];
    let params = [];
    let size = (pageSize > PAGE_SIZE) ? pageSize : PAGE_SIZE;

    let date = new Date();

    
      let e = Math.floor((end!==null) ? end : (date.getTime()/1000)-date.getTimezoneOffset()*60);
      let s = Math.ceil(((start!==null)&&(start>0)) ? start : e-(43800*60) );
    
    switch(listType) {
      case txnListType.ALL: {
        if((end!==null)&&(start!==null)){
          params = [pageNumber, size, s, e];
        }else if(start!==null){
          params = [pageNumber, size,s];
        }else{
          params = [pageNumber, size];
        }
        break;
      }
      case txnListType.BY_BLOCK: {
        params = [nc_trim(queryStr), pageNumber, PAGE_SIZE];
        break;
      }
      
    }
    network.request(ep, params)
    .then((response) => {
      store.dispatch(StoreTxnList.SetPaging(response));
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreTxnList.SetPaging({}));
    });
  }
};

export const getTxnRetrieveTopLevel = (queryStr,subStr=null) => {
  if(subStr === null){
    store.dispatch(StoreTxnRetrieve.GetTopLevel({
        queryStr: queryStr
    }));
  }
  
  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = mock.txn;
      store.dispatch(StoreTxnRetrieve.SetTopLevel(response));
    }, 500);
  }
  else {
    let request = nc_trim(queryStr);

    if (!nc_isValidEntity(request)) {
      store.dispatch(StoreTxnRetrieve.SetTopLevel({
        content: []
      }));
      return;
    }
    if(subStr === null){
        // get transaction details
        const ep = network.endpoint.transaction.detail;
        let params = [request];
        network.request(ep, params)
        .then((response) => {

          store.dispatch(StoreTxnRetrieve.SetTopLevel(response));
          getTxnRetrieveTxnLogList(request, 0);
          getTxnRetrievePagingTrnList(request, 0);

        })
        .catch((error) => {
          console.log(error);
          store.dispatch(StoreTxnRetrieve.SetTopLevel({}));
        });
    }else{
        // get transfer details
        const ep = network.endpointV2.transfer.detail;
        let request_b = nc_trim(subStr);
        let params = [request,request_b];
        network.request(ep, params)
        .then((response) => {

          store.dispatch(StoreTxnRetrieve.SetTransfer(response));
        })
        .catch((error) => {
          console.log(error);
          store.dispatch(StoreTxnRetrieve.SetTransfer({}));
        });
    }

  }
}


export const getTxnRetrievePagingTrnList = (queryStr, pageNumber, pageSize, start, end) => {
  store.dispatch(StoreTxnRetrieve.GetPagingTrn());

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      store.dispatch(StoreTxnRetrieve.SetPagingTrn({}));
    }, 500);
  }
  else {
    const ep = network.endpointV2.transfer.list[trnListType.BY_TXN];
    let params = [queryStr, pageNumber, PAGE_SIZE];
    network.request(ep, params)
    .then((response) => {
      
      store.dispatch(StoreTxnRetrieve.SetPagingTrn(response)); 
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreTxnRetrieve.SetPagingTrn({}));
    });
  }
}
export const getTxnRetrieveTxnLogList = (queryStr, pageNumber, pageSize) => {
  store.dispatch(StoreTxnRetrieve.GetPagingTrn());
   if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      store.dispatch(StoreTxnRetrieve.SetPagingTrn({}));
    }, 500);
  }
  else {
    const ep = network.endpointV2.transactionLog.list[txnLogListType.BY_TXN];
    let params = [queryStr, pageNumber, PAGE_SIZE];
    network.request(ep, params)
    .then((response) => {
     store.dispatch(StoreTxnRetrieve.SetTxnLogs(response));
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreTxnRetrieve.SetTxnLogs({}));
    });
  }
}
// ========================================================
// Accounts 
// ========================================================

export const getAccListTopLevel = () => {
  store.dispatch(StoreAccList.GetTopLevel());

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = mock.accList;
      store.dispatch(StoreAccList.SetTopLevel(response));
    }, 500);
  }
  else {
    // get transaction list
    const ep = network.endpoint.account.list;
    
    let params = [];
    
    network.request(ep, params)
    .then((response) => {
      store.dispatch(StoreAccList.SetTopLevel(response));

        //get the data for the rich list
        getAccRichList();

    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreAccList.SetTopLevel({}));
    });
  }
}

export const getAccRichList = () => {
  
  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    store.dispatch(StoreAccList.SetRichList({}));
  }
  else {
    // get transaction list
    const ep = network.endpoint.account.rich;
    
    let params = [];
    
    network.request(ep, params)
    .then((response) => {

      store.dispatch(StoreAccList.SetRichList(response));

    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreAccList.SetRichList({}));
    });
  }
}

export const getAccRetrieveTopLevel = (acc,tkn=null) => {
  store.dispatch(StoreAccRetrieve.GetTopLevel({
    queryStr: acc
  }));

  
  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = {
        acc: mock.acc,
        blk: mock.blkListArry,
        txn: mock.txnListArry,
        web3: false
      };
      store.dispatch(StoreAccRetrieve.SetTopLevel(response));
    }, 500);
  }
  else {
    // validate the account to make sure it's a valid account string
    let request = nc_trim(acc);
    let requestb = tkn;

    if (request == 0) {
      request = "0000000000000000000000000000000000000000000000000000000000000000"
    } else if (!nc_isValidEntity(request)) {
      store.dispatch(StoreAccRetrieve.SetTopLevel({
        content: null
      }));
      return;
    } else {
      request = nc_sanitizeHex(acc);
    }
    
    // get account details
    const ep = network.endpoint.account.detail;
    let params = []; 
    
    if(requestb!=null){
      
      params = [request,requestb];
      
    }else{
      params = [request];
    }
     
    network.request(ep, params)
    .then((response) => {
      const isAccValid = nc_isObjectValid(response);
      const isAccEmpty = nc_isObjectEmpty(response, isAccValid);

      
      store.dispatch(StoreAccRetrieve.SetTopLevel(response));
      
            
      if (!isAccEmpty) {
        //console.log('this call!');
        getAccRetrievePagingTxnList(request, requestb, 0);
        getAccRetrievePagingBlkList(request, 0);
        //TODO:improve
        getAccRetrievePagingTrnList(request, 0);
        if(response.content[0].hasInternalTransfer){

            //getAccRetrievePagingTrnList(request, 0);
        }
        
        //console.log(JSON.stringify(response));
        
      }
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreAccRetrieve.SetTopLevel({}));
    });
  }
}


export const getAccTxnRetrieveCSV = (acc,key,start,end,range) => {
  store.dispatch(StoreAccRetrieve.GetTopLevel({
    queryStr: acc
  }));

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    
  }
  else {
    // validate the account to make sure it's a valid account string
    let request = nc_trim(acc);

    let recaptcha = nc_trim(key);

    if(request == 0) {
      request = "0000000000000000000000000000000000000000000000000000000000000000"
    }else {
      request = nc_sanitizeHex(acc);
    }
    
    // get account details
    const ep = network.endpoint.download.accountTxns;

    let params = [];
    let paramsA = [];
    let paramsB = [];
    let paramsC = [];

    params = [request,'',start,end,recaptcha];
    paramsA = [request,'','Account_Tokens'];
    paramsB = [request,'','Account_Transactions',0,999];
    paramsC = [request,'','Accoun_Mined_Blocks',0,999];
    
    //postRequest/request
    network.downloadRequest(ep, params, true)
    .then((response) => {
          //console.log(JSON.stringify(response));      
        fileDownload(response, 'Account_'+request+'.csv');
         
    })
    .catch((error) => {
      
      console.log(error);      
    });


   

    return;

  }
}

export const getAccRetrievePagingTxnList = (queryStr, tkn=null, pageNumber, pageSize, start=null, end=null) => {
  store.dispatch(StoreAccRetrieve.GetPagingTxn());

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = Object.assign({}, store.getState().accRetrieve.response.txn);
      response.page.number = pageNumber;

      store.dispatch(StoreAccRetrieve.SetPagingTxn(response));
    }, 500);
  }
  else {
    
    const ep = ((start!==null)&&(start>0)) ? network.endpoint.transaction.list[txnListType.BY_ACCOUNT] : network.endpoint.transaction.list[txnListType.BY_ACCOUNT];
    
    let size = (pageSize > PAGE_SIZE) ? pageSize : PAGE_SIZE;
    
    let date = new Date();
    let e = Math.floor((end!==null) ? end : (date.getTime()/1000)-date.getTimezoneOffset()*60);
    let s = Math.ceil(((start!==null)&&(start>0)) ? start : e-(43800*60) );

    
    let params = []; 
    
    if(tkn!==null){
      params = [queryStr,tkn ,pageNumber, size,s];
    }else if((tkn!==null)&&(end!==null)){
      params = [queryStr, tkn, pageNumber, size, s, e];
    }else if(end!==null){
      params = [queryStr, null, pageNumber, size, s, e];
    }else{
      params = [queryStr, null, pageNumber, size];
    }
    

    network.request(ep, params)
    .then((response) => {
      
      let acc = store.getState().accRetrieve.response.acc;
      
      if (acc && acc.data && acc.data.content && acc.data.content[0]) {
        if (nc_sanitizeHex(acc.data.content[0].address) == nc_sanitizeHex(queryStr)) {
           store.dispatch(StoreAccRetrieve.SetPagingTxn(response));  
        }
      }
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreAccRetrieve.SetPagingTxn({}));
    });
  }
}

export const getAccRetrievePagingBlkList = (queryStr, pageNumber, pageSize, start, end) => {
  store.dispatch(StoreAccRetrieve.GetPagingBlk());

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = Object.assign({}, store.getState().accRetrieve.response.blk);
      response.page.number = pageNumber;

      store.dispatch(StoreAccRetrieve.SetPagingBlk(response));
    }, 500);
  }
  else {
    const ep = network.endpoint.block.list[blkListType.BY_ACCOUNT];
    let params = [queryStr, pageNumber, pageSize, start, end];
    network.request(ep, params)
    .then((response) => {
      
      let acc = store.getState().accRetrieve.response.acc;
      if (acc && acc.data && acc.data.content && acc.data.content[0]) {
        if (nc_sanitizeHex(acc.data.content[0].address) == nc_sanitizeHex(queryStr)) {
            store.dispatch(StoreAccRetrieve.SetPagingBlk(response));  
        }
      }
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreAccRetrieve.SetPagingBlk({}));
    });
  }
}

export const getAccRetrievePagingTrnList = (queryStr, pageNumber, pageSize, start, end) => {
  store.dispatch(StoreAccRetrieve.GetPagingTrn());

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = Object.assign({}, store.getState().accRetrieve.response.blk);
      response.page.number = pageNumber;

      store.dispatch(StoreAccRetrieve.SetPagingBlk(response));
    }, 500);
  }
  else {
    const ep = network.endpointV2.transfer.list[trnListType.BY_ACCOUNT];
    let params = [queryStr, pageNumber, pageSize];
    network.request(ep, params)
    .then((response) => {
      
      let acc = store.getState().accRetrieve.response.acc;
      if (acc && acc.data && acc.data.content && acc.data.content[0]) {
        if (nc_sanitizeHex(acc.data.content[0].address) == nc_sanitizeHex(queryStr)) {
            //console.log(JSON.stringify(response));
            store.dispatch(StoreAccRetrieve.SetPagingTrn(response));  
        }
      }
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreAccRetrieve.SetPagingTrn({}));
    });
  }
}

export const getAccRetrieveTknList = (queryStr, pageNumber) => {
  store.dispatch(StoreAccRetrieve.GetTkn());

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = Object.assign({}, store.getState().accRetrieve.response.blk);
      response.page.number = pageNumber;

      store.dispatch(StoreAccRetrieve.SetPagingBlk(response));
    }, 500);
  }
  else {
    const ep = network.endpoint.token.list[tknListType.BY_ACCOUNT];
    let params = [queryStr, pageNumber, PAGE_SIZE];
    network.request(ep, params)
    .then((response) => {
      
      let acc = store.getState().accRetrieve.response.acc;
      if (acc && acc.data && acc.data.content && acc.data.content[0]) {
        if (nc_sanitizeHex(acc.data.content[0].address) == nc_sanitizeHex(queryStr)) {
            store.dispatch(StoreAccRetrieve.SetTkn(response));  
        }
      }
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreAccRetrieve.SetTkn({}));
    });
  }
}
// ========================================================
// Contracts 
// ========================================================

export const getCntrListTopLevel = () => {
  store.dispatch(StoreCntrList.GetTopLevel());


  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = mock.accList;
      store.dispatch(StoreCntrList.SetTopLevel(response));
    }, 500);
  }
  else {
    // get transaction list
    const ep = network.endpoint.contract.list;
    
    let params = [];
    
    network.request(ep, params)
    .then((response) => {
       
      store.dispatch(StoreCntrList.SetTopLevel(response));

    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreCntrList.SetTopLevel({}));
    });
  }
}

export const getCntrListPaging = (listType, queryStr, pageNumber, pageSize, start=0, end=0) => {
  store.dispatch(StoreCntrList.GetPaging());

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = Object.assign({}, store.getState().tknList.response);
      response.page.number = pageNumber;

      store.dispatch(StoreCntrList.SetPaging(response));
    }, 500);
  }
  else {
    const ep = network.endpoint.contract.list;
    
    let size = (pageSize > PAGE_SIZE) ? pageSize : PAGE_SIZE;
    let params = [pageNumber, size, start, end];
        
    network.request(ep, params)
    .then((response) => {
      store.dispatch(StoreCntrList.SetPaging(response));
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreCntrList.SetPaging({}));
    });
  }
}

export const getCntrRetrieveTopLevel = (queryStr, page, size) => {
  store.dispatch(StoreCntrRetrieve.GetTopLevel({
    queryStr: queryStr
  }));

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = {
        cntr: mock.cntr,
        blk: mock.blkListArry,
        txn: mock.txnListArry,
        web3: false
      };
      store.dispatch(StoreCntrRetrieve.SetTopLevel(response));
    }, 500);
  }
  else {
    // validate the contract to make sure it's a valid contract string
    let request = nc_trim(queryStr);

    if (request == 0) {
      request = "0000000000000000000000000000000000000000000000000000000000000000"
    } else if (!nc_isValidEntity(request)) {
      store.dispatch(StoreCntrRetrieve.SetTopLevel({
        content: []
      }));
      return;
    } else {
      request = nc_sanitizeHex(queryStr);
    }
    
    // get contract details
    const ep = network.endpoint.contract.detail;
    let params = [request,page,size];
    //console.log(ep,params);
    network.request(ep, params)
    .then((response) => {
      const isCntrValid = nc_isObjectValid(response);
      const isCntrEmpty = nc_isObjectEmpty(response, isCntrValid);

      store.dispatch(StoreCntrRetrieve.SetTopLevel(response));
      
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreCntrRetrieve.SetTopLevel({}));
    });
  }
}

export const getCntrRetrievePagingTxnList = (queryStr, pageNumber) => {
  store.dispatch(StoreCntrRetrieve.GetPagingTxn());

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = Object.assign({}, store.getState().accRetrieve.response.txn);
      response.page.number = pageNumber;

      store.dispatch(StoreCntrRetrieve.SetPagingTxn(response));
    }, 500);
  }
  else {
    // get transaction list
    const ep = network.endpoint.contract.detail;
    let params = [queryStr, null, null, pageNumber, PAGE_SIZE];
    network.request(ep, params)
    .then((response) => {
     
      let cntr = store.getState().cntrRetrieve.response.acc;

      if (cntr && cntr.data && cntr.data.content && cntr.data.content[0]) {
        if (nc_sanitizeHex(cntr.data.content[0].contractAddr) == nc_sanitizeHex(queryStr)) {            
            store.dispatch(StoreCntrRetrieve.SetPagingTxn(response));  
        }
      }
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreCntrRetrieve.SetPagingTxn({}));
    });
  }
}

export const getCntrRetrievePagingBlkList = (queryStr, pageNumber) => {
  store.dispatch(StoreCntrRetrieve.GetPagingBlk());

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = Object.assign({}, store.getState().accRetrieve.response.blk);
      response.page.number = pageNumber;

      store.dispatch(StoreCntrRetrieve.SetPagingBlk(response));
    }, 500);
  }
  else {
    const ep = network.endpoint.block.list[blkListType.BY_ACCOUNT];
    let params = [queryStr, pageNumber, PAGE_SIZE];
    
    network.request(ep, params)
    .then((response) => {
      let acc = store.getState().cntrRetrieve.response.acc;
      if (acc && acc.data && acc.data.content && acc.data.content[0]) {
        if (nc_sanitizeHex(acc.data.content[0].contractAddr) == nc_sanitizeHex(queryStr)) {
            store.dispatch(StoreCntrRetrieve.SetPagingBlk(response));  
        }
      }
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreCntrRetrieve.SetPagingBlk({}));
    });
  }
}
export const getCntrRetrievePagingEventList = (queryStr, pageNumber) => {
  store.dispatch(StoreCntrRetrieve.GetPagingEvent());

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = Object.assign({}, store.getState().accRetrieve.response.blk);
      response.page.number = pageNumber;

      store.dispatch(StoreCntrRetrieve.SetPagingEvent(response));
    }, 500);
  }
  else {
    const ep = network.endpoint.event.list[eventListType.BY_ACCOUNT];
    let params = [queryStr, pageNumber, PAGE_SIZE];
    console.log('I am here!');
    network.request(ep, params)
    .then((response) => {
     let acc = store.getState().cntrRetrieve.response.acc;
      if (acc && acc.data && acc.data.content && acc.data.content[0]) {
        if (nc_sanitizeHex(acc.data.content[0].contractAddr) == nc_sanitizeHex(queryStr)) {
            store.dispatch(StoreCntrRetrieve.SetPagingEvent(response));  
        }
      }
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreCntrRetrieve.SetPagingEvent({}));
    });
  }
}

export const getCntrRetrieveTknList = (queryStr, pageNumber) => {
  store.dispatch(StoreCntrRetrieve.GetTkn());

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = Object.assign({}, store.getState().accRetrieve.response.blk);
      response.page.number = pageNumber;

      store.dispatch(StoreCntrRetrieve.SetPagingBlk(response));
    }, 500);
  }
  else {
    const ep = network.endpoint.token.list[tknListType.BY_ACCOUNT];
    let params = [queryStr, pageNumber, PAGE_SIZE];
    network.request(ep, params)
    .then((response) => {
      let acc = store.getState().accRetrieve.response.acc;
      if (acc && acc.data && acc.data.content && acc.data.content[0]) {
        if (nc_sanitizeHex(acc.data.content[0].contractAddr) == nc_sanitizeHex(queryStr)) {
            store.dispatch(StoreCntrRetrieve.SetTkn(response));  
        }
      }
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreCntrRetrieve.SetTkn({}));
    });
  }
}
// ========================================================
// Dashboard 
// ========================================================

//activate dark-mode
export const setDarkMode = (isdark) => {
  store.dispatch(StoreDark.SetAll(isdark));
}


export const setDashboardData = (response) => {
  const isResponseEmpty = nc_isObjectEmpty(response);
  
  if(!isResponseEmpty) {
    let data = response.content[0];
    //console.log(JSON.stringify(data.transactions));
    store.dispatch(StoreKpis.SetAll(data.metrics));
    store.dispatch(StoreBlkRt.SetAll(data.blocks));
    store.dispatch(StoreTxnRt.SetAll(data.transactions));
    
  }
}


export const getDashboardData = () => {
  const ep = network.endpoint.dashboard;
  let params = [];
  
  network.request(ep, params)
  .then((response) => {
    
    setDashboardData(response);

    network.startInterval(ep,params,(response) => {
        setDashboardData(response);
    });
  })
  .catch((error) => {
    console.log(error);
    
  });
}
export const setKPIData = (response) => {
  
  if(response.content.length > 0) {
    let data = response.content[0];
    
    store.dispatch(StoreKpis.SetAll(data.metrics));
  }
}

export const setHealthData = (response) => {

  if(response.content.length > 0) {
    let data = response.content[0];

    store.dispatch(StoreKpis.SetHealth(data));
  }
}

export const getKPIData = () => {


     const ep = network.endpoint.dashboard;
     let params = [];

     network.request(ep,params)
     .then((response) => {
         setKPIData(response);
         network.startInterval(ep,params,(response) => {
         setKPIData(response);
       });
     })
     .catch((error) => {
       console.log(error);
       setKPIData({content:[]});

     });

 }
export const getHealthData = () => {

    const ep = network.endpointV2.health;
    let params = [];

    network.request(ep,params)
    .then((response) => {
        setHealthData(response);
        network.startInterval(ep,params,(response) => {
        setHealthData(response);
      });
    })
    .catch((error) => {
      console.log(error);
      //setKPIData({content:[]});
    });
}

// ========================================================
// Tokens
// ========================================================

export const getTknListTopLevel = (listType, queryStr) => {
  store.dispatch(StoreTknList.GetTopLevel({
    queryStr: queryStr,
    listType: listType,
  }));

  
  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = mock.tknList;

      store.dispatch(StoreTknList.SetTopLevel(response));
    }, 500);
  }
  else {
    // get transaction list
    const ep = network.endpoint.token.list[listType];
    let params = [];
    let request = nc_trim(queryStr);

    switch(listType) {
      case tknListType.ALL: {
        params = [0, PAGE_SIZE]
        break;
      }
      case tknListType.BY_ACCOUNT: {
        if (!nc_isPositiveInteger(request) && !nc_isValidEntity(request)) {
          store.dispatch(StoreTknList.SetTopLevel({ content:[] }));
          return;
        }

        params = [request]
        break;
      }
    }

    network.request(ep, params)
    .then((response) => {
      store.dispatch(StoreTknList.SetTopLevel(response));
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreTknList.SetTopLevel({}));
    });
  }
}

export const getTknListPaging = (listType, queryStr, pageNumber, pageSize,start=0, end=0) => {
  store.dispatch(StoreTknList.GetPaging());
  
  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = Object.assign({}, store.getState().tknList.response);
      response.page.number = pageNumber;

      store.dispatch(StoreTknList.SetPaging(response));
    }, 500);
  }else {

    
    const ep = network.endpoint.token.list[listType];
    let params = [];
    let size = (pageSize > PAGE_SIZE) ? pageSize : PAGE_SIZE;
    params = [pageNumber, size];
    
    network.request(ep, params)
    .then((response) => {
      store.dispatch(StoreTknList.SetPaging(response));
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreTknList.SetPaging({}));
    });
  }
}

export const getTknRetrieveTopLevel = (queryStr) => {
  store.dispatch(StoreTknRetrieve.GetTopLevel({
    queryStr: queryStr
  }));

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    console.log("getTknRetrieveTopLevel");
    setTimeout(() => {
       let response = {
        tkn: mock.tkn,
        blk: mock.blkListArry,
        txn: mock.txnListArry,
        web3: false
      };
      store.dispatch(StoreTknRetrieve.SetTopLevel(response));
    }, 500);
  }
  else {
    
    let request = nc_trim(queryStr);
    if (!nc_isValidEntity(request)) {
      store.dispatch(StoreTknRetrieve.SetTopLevel({
        content: []
      }));
      return;
    }

    // get transaction details
    const ep = network.endpoint.token.detail;
    let params = [request];
    network.request(ep, params)
    .then((response) => {
      store.dispatch(StoreTknRetrieve.SetTopLevel(response));
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreTknRetrieve.SetTopLevel({}));
    });
  }
}

export const getTknRetrievePagingTxnList = (queryStr, pageNumber, pageSize) => {
  store.dispatch(StoreTknRetrieve.GetPagingTxn());

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = Object.assign({}, store.getState().tknRetrieve.response.txn);
      response.page.number = pageNumber;

      store.dispatch(StoreTknRetrieve.SetPagingTxn(response));
    }, 500);
  }
  else {
    // get transaction list
    const ep = network.endpoint.token.detail;
    let params = [queryStr, pageNumber, pageSize,0,PAGE_SIZE];
    network.request(ep, params)
    .then((response) => {
      store.dispatch(StoreTknRetrieve.SetTopLevel(response));
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreTknRetrieve.SetTopLevel({}));
    });
  }
}
export const getTknRetrievePagingAccList = (queryStr, pageNumber, pageSize) => {
  store.dispatch(StoreTknRetrieve.GetPagingBlk());

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = Object.assign({}, store.getState().tknRetrieve.response.blk);
      response.page.number = pageNumber;

      store.dispatch(StoreTknRetrieve.SetPagingBlk(response));
    }, 500);
  }
  else {
    const ep = network.endpoint.token.detail;
    let params = [queryStr,0,PAGE_SIZE, pageNumber, pageSize];
    network.request(ep, params)
    .then((response) => {
      store.dispatch(StoreTknRetrieve.SetTopLevel(response));
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreTknRetrieve.SetTopLevel({}));
    });
  }
}

 let showView = (entity,request) => {

    
    switch(entity)
    {


    // Top Level 
    // ---------
      case 'block':
      {  
         hashHistory.push('/block/'+request);
         break;
    
      }
      case 'transaction':
      {
        hashHistory.push('/transaction/'+request);
        break;
      }
      case'token':
      {
        hashHistory.push('/token/'+request);
        break;
      }
      case'account':
      {
        hashHistory.push('/account/'+request);
        break;
      }
      case'contract':
      {
        
        hashHistory.push('/contract/'+request);
        break;
      }



      default: 
      {
        return "";
      }
    }

  }
//This utilizes the functionality of the v2 API
export const globalSearch = (queryStr) => {

    const ep = network.endpointV2.search;
    let request = queryStr;
    let param = [request];

    network.request(ep, param).then((response) =>{
        //TODO:compensate for tokens

        response.queryStr = queryStr;
        if(response.searchResults && response.searchResults.length > 0){

          if(response.searchResults.length > 1){

            store.dispatch(StoreRetrieve.Set(response));
          }else{
            showView(response.searchResults[0].type,response.searchResults[0].key);
          }
        }else{
            store.dispatch(StoreRetrieve.Set(response));
        }
    })
    .catch((error) => {
       console.log(error);
       store.dispatch(StoreRetrieve.Set(""));
    });
}


export const getRetrieveTopLevel = (queryStr) => {
  store.dispatch(StoreRetrieve.GetTopLevel({
    queryStr: queryStr
  }));

  //console.log('search network call!');

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = {
        data: mock.data,
        
      };
      store.dispatch(StoreBlkRetrieve.SetTopLevel(response));
    }, 500);
  }
  else {
    // sanitize input string
    let request = nc_trim(queryStr.toLowerCase());


    const ep = network.endpoint.search;
    let params = [request,  0, PAGE_SIZE];
    network.request(ep, params)
    .then((response) => {
     

      if(typeof response.searchType !== "undefined" && response.searchType !== "token"){ 

        showView(response.searchType,request);
       
      }
      else if(typeof response.searchType !== "undefined"){ 
        store.dispatch(StoreRetrieve.SetTopLevel(response));
        hashHistory.push('/search/');
      }
      else{
        store.dispatch(StoreRetrieve.SetTopLevel({

        }));
        hashHistory.push('/search/');
      }
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreRetrieve.SetTopLevel({
        
      }));
    });
  }
}

export const RetrieveDownload =(type, data) => {

   if (!network.NCNETWORK_REQUESTS_ENABLED) {
    
   }
   else {
    // sanitize input string
    let request = nc_trim(type);

    // get block details
    const ep = network.endpoint.download.detail;
     
    let params = [request, data];
    network.postRequest(ep, params)
    .then((response) => {
      
        console.log(JSON.stringify(response)); 
        
    })
    .catch((error) => {
      console.log(error);
      
    });
  }

}
export const submitFeedback =(topic=null,message=null,key=null) => {

   if (!network.NCNETWORK_REQUESTS_ENABLED) {
    
   }
   else {
    // sanitize input string
    let post_topic = nc_trim(topic);
    let post_message = nc_trim(message);
    // get block details
    const ep = network.endpoint.contact.detail;
        
    let params = [post_topic, post_message, key];
    network.postRequest(ep, params, true)
    .then((response) => {
        
        store.dispatch(StoreContactRetrieve.SetData(response));
    
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreContactRetrieve.SetData({}));
      
    });
  }

}
export const getChartRetrieve = (queryStr) => {
  store.dispatch(StoreChartRetrieve.GetChart({
    queryStr: queryStr
  }));

 
  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = {
        data: mock.data,
        
      };
      store.dispatch(StoreBlkRetrieve.SetTopLevel(response));
    }, 500);
  }
  else {
    // sanitize input string
    let request = nc_trim(queryStr);

    // get block details
    const ep = network.endpoint.chart.detail;
    let params = [request];
    network.request(ep, params)
    .then((response) => {
      
       store.dispatch(StoreChartRetrieve.SetChart(response));
    
    })
    .catch((error) => {
      
        console.log(error);
        store.dispatch(StoreChartRetrieve.SetChart({
        
      }));
    });
  }
}


























