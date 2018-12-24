/* eslint-disable */
import * as network from 'network/NCNetwork';
import { store } from 'stores/NCReduxStore'
import { Router, Route, IndexRedirect, hashHistory} from 'react-router'

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
import * as StoreAccRetrieve from 'stores/StoreAccRetrieve';

import * as StoreCntrList from 'stores/StoreCntrList';
import * as StoreCntrRetrieve from 'stores/StoreCntrRetrieve';

import * as StoreChartRetrieve from 'stores/StoreChartRetrieve';

import * as StoreRetrieve from 'stores/StoreRetrieve';



import {BigNumber} from 'bignumber.js';
import {nc_LinkToEntity, nc_getChartData, nc_isObjectEmpty, nc_trim, nc_isValidEntity, nc_isPositiveInteger, nc_sanitizeHex, nc_isObjectValid } from 'lib/NCUtility';
import { cntrListType, tknListType, txnListType, blkListType, accListType, eventListType } from 'lib/NCEnums';

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
      }/*
      case blkListType.BY_ACCOUNT: {
        let request = nc_sanitizeHex(queryStr);
        if (request == 0 || request == "0x0") {
          request = "0000000000000000000000000000000000000000000000000000000000000000"
        } else if (!nc_isValidEntity(request)) {
          store.dispatch(StoreBlkList.SetTopLevel({ content:[] }));
          return;
        }

        params = [request, 0, PAGE_SIZE]
        break;
      }*/
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

export const getBlkListPaging = (listType, queryStr, pageNumber,pageSize=0, start=0, end=0) => {
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
        params = [pageNumber, size, start, end]
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
      let blockDetails = response;
      if (response && response.content && response.content[0] && response.content[0].transactionList) {
        let txnList = response.content[0].transactionList;
        transactionDetails = {
          content: txnList
        }
      }

      store.dispatch(StoreBlkRetrieve.SetTopLevel({
        blk: blockDetails,
        txn: transactionDetails
      }));
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

  //console.log('coooo: '+listType);

  //console.log('txn list top level');

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
      }/*
      case txnListType.BY_ACCOUNT: {
        if (request == 0 || request == "0x0") {
          request = "0000000000000000000000000000000000000000000000000000000000000000"
        } else if (!nc_isValidEntity(request)) {
          store.dispatch(StoreTxnList.SetTopLevel({}));
          return;
        }

        params = [request, 0, PAGE_SIZE]
        break;
      }*/
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

    //let s = Math.round(((start!==null)&&(start>0)) ? start : ((end!==null)&&(end>0)) ? end-(43800*60) : 0) ;
    //let e = Math.round(isNaN(end) ? 0 : end);
    let e = Math.round((end!==null) ? end : new Date()/1000);
    let s = Math.round(((start!==null)&&(start>0)) ? start : e-(43800*60) );

    switch(listType) {
      case txnListType.ALL: {
        params = [pageNumber, size, s, e]
        break;
      }
      case txnListType.BY_BLOCK: {
        params = [nc_trim(queryStr), pageNumber, PAGE_SIZE]
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
}

export const getTxnRetrieveTopLevel = (queryStr) => {
  store.dispatch(StoreTxnRetrieve.GetTopLevel({
    queryStr: queryStr
  }));
    //console.log('4 index!');
  //console.log('txn retrieve list top level');

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

    // get transaction details
    const ep = network.endpoint.transaction.detail;
    let params = [request];
    network.request(ep, params)
    .then((response) => {
      store.dispatch(StoreTxnRetrieve.SetTopLevel(response));
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreTxnRetrieve.SetTopLevel({}));
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
    //console.log(ep);
    let params = [];
    
    network.request(ep, params)
    .then((response) => {
      store.dispatch(StoreAccList.SetTopLevel(response));
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreAccList.SetTopLevel({}));
    });
  }
}

export const getAccRetrieveTopLevel = (acc,tkn=null) => {
  store.dispatch(StoreAccRetrieve.GetTopLevel({
    queryStr: acc
  }));

  //console.log('This is the top ACC param:' + JSON.stringify(acc+tkn));

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
    //console.log(requestb);
    if(requestb!=null){
      //requestb = "nc_trim(tkn)";
      params = [request,requestb];
      //console.log('not null ok?'+requestb);
    }else{
      params = [request];
    }
     
    network.request(ep, params)
    .then((response) => {
      const isAccValid = nc_isObjectValid(response);
      const isAccEmpty = nc_isObjectEmpty(response, isAccValid);

      // ok, make requests for blocks and transactions for this account
      store.dispatch(StoreAccRetrieve.SetTopLevel(response));
      
      // we can save on a network request if the nonce is zero
      if (!isAccEmpty) {
        console.log('this call!');
        getAccRetrievePagingTxnList(request, requestb, 0);
        getAccRetrievePagingBlkList(request, 0);
        
      }
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreAccRetrieve.SetTopLevel({}));
    });
  }
}

//getAccRetrieveCSV
/*For an Account's Details
searchParam1 = Account Address
entityType = Account


For an Account's Tokens
searchParam1 = Account Address
entityType = Account_Tokens


For an Account's Transactions
searchParam1 = Account Address
searchParam2 = Token Address (optional)
entityType = Account_Transactions
rangeMin1 = some number
rangeMax1 = some number


For an Account's Mined Blocks
searchParam1 = Account Address
entityType = Account_Mined_Blocks
rangeMin1 = some number
rangeMax1 = some number*/
export const getAccTxnRetrieveCSV = (acc,key,range) => {
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

    params = [request,'',range[0],range[1],recaptcha];
    paramsA = [request,'','Account_Tokens'];
    paramsB = [request,'','Account_Transactions',0,999];
    paramsC = [request,'','Accoun_Mined_Blocks',0,999];
    
    network.request(ep, params, true)
    .then((response) => {
        console.log(response);
        //var fileDownload = require('js-file-download');
        fileDownload(response, 'Account_'+request+'.csv');
        //store.dispatch(StoreDwn.Setresponse(true));  
    })
    .catch((error) => {
      //store.dispatch(StoreDwn.Setresponse(false)); 
      console.log(error);      
    });


    /*
    network.request(ep, paramsB)
    .then((response) => {
        fileDownload(response, 'Account_'+request+'_Transactions.csv');
    })
    .catch((error) => {
      console.log(error);      
    });

    network.request(ep, paramsC)
    .then((response) => {
        fileDownload(response, 'Account_'+request+'_Mined_Blocks.csv');
    })
    .catch((error) => {
      console.log(error);      
    });


    network.request(ep, paramsA)
    .then((response) => {
        fileDownload(response, 'Account_'+request+'_Tokens.csv');
    })
    .catch((error) => {
      console.log(error);      
    });
    */

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
    // get transaction list
    //const ep = network.endpoint.transaction.list[txnListType.BY_ACCOUNT];
    //console.log(start+"##########"+end);

    const ep = ((start!==null)&&(start>0)) ? network.endpoint.transaction.list[4] : network.endpoint.transaction.list[txnListType.BY_ACCOUNT];
    
    let size = (pageSize > PAGE_SIZE) ? pageSize : PAGE_SIZE;
    
    //let e = Math.round((end!==null) ? end : new Date()/1000);
    //let s = Math.round(((start!==null)&&(start>0)) ? start : e-(43800*60) );
    let e = Math.round((end!==null) ? end : new Date()/1000);
    let s = Math.round(((start!==null)&&(start>0)) ? start : e-(43800*60) );

    let params = []; 
    if(tkn!==null){
      params = [queryStr,tkn ,pageNumber, PAGE_SIZE];
    }else{
      params = [queryStr, null, pageNumber, size, s, e];

      //console.log('we are here')
    }
    

    //console.log('params:'+JSON.stringify(params));
    //console.log(ep);
    //console.log('we are here');
    network.request(ep, params)
    .then((response) => {
      // ok, now make sure that the response you got is still valid
      // ie. matches up to the account loaded on-screen

      //console.log('oooo:'+JSON.stringify(response));
      let acc = store.getState().accRetrieve.response.acc;
      //console.log('Its reaching here too 1!');
      if (acc && acc.data && acc.data.content && acc.data.content[0]) {
        //console.log('Its reaching here too 2!');
        //console.log(nc_sanitizeHex(acc.data.content[0].address)+'  Its reaching here too!  '+nc_sanitizeHex(queryStr));
        if (nc_sanitizeHex(acc.data.content[0].address) == nc_sanitizeHex(queryStr)) {
            //console.log('Its reaching here too 3!');
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
    let params = [queryStr, pageNumber, PAGE_SIZE, start, end];
    network.request(ep, params)
    .then((response) => {
      // ok, now make sure that the response you got is still valid
      // ie. matches up to the account loaded on-screen
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
      // ok, now make sure that the response you got is still valid
      // ie. matches up to the account loaded on-screen
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


  //console.log("its here!!");

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = mock.accList;
      store.dispatch(StoreCntrList.SetTopLevel(response));
    }, 500);
  }
  else {
    // get transaction list
    const ep = network.endpoint.contract.list;
    //console.log(ep);
    let params = [];
    
    network.request(ep, params)
    .then((response) => {
       //console.log('contract response');
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
    console.log(listType);
    /*switch(listType) {
      case cntrListType.ALL: {
        params = [pageNumber, size]
        break;
      }
      case cntrListType.BY_ACCOUNT: {
        params = [nc_trim(queryStr), pageNumber, PAGE_SIZE]
        break;
      }
      
    }*/
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

export const getCntrRetrieveTopLevel = (queryStr) => {
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
    let params = [request];
    //console.log(ep);
    network.request(ep, params)
    .then((response) => {
      const isCntrValid = nc_isObjectValid(response);
      const isCntrEmpty = nc_isObjectEmpty(response, isCntrValid);

      //console.log(JSON.stringify(response));
      // ok, make requests for blocks and transactions for this contract
      store.dispatch(StoreCntrRetrieve.SetTopLevel(response));
      //console.log("Coool!"+isCntrEmpty);
      // we can save on a network request if the nonce is zero
      if (!isCntrEmpty) {
        //getCntrRetrievePagingTxnList(request, 0);
        //getCntrRetrievePagingBlkList(request, 0);
        //getCntrRetrievePagingEventList(request, 0);
        //getAccRetrieveTknList(request, 0);
        //console.log("not empty!");
      }
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
    //const ep = network.endpoint.transaction.list[txnListType.BY_ACCOUNT];
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
    //console.log('I am here on the block!');
    network.request(ep, params)
    .then((response) => {
      // ok, now make sure that the response you got is still valid
      // ie. matches up to the contract loaded on-screen
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
      // ok, now make sure that the response you got is still valid
      // ie. matches up to the contract loaded on-screen
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
      // ok, now make sure that the response you got is still valid
      // ie. matches up to the contract loaded on-screen
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


// using pub-sub to subscribe to data updates from webserver
// function to update stores upon receipt of published data
export const setDashboardData = (response) => {
  const isResponseEmpty = nc_isObjectEmpty(response);
  
  if(!isResponseEmpty) {
    let data = response.content[0];
    store.dispatch(StoreBlkRt.SetAll(data.blocks));
    store.dispatch(StoreTxnRt.SetAll(data.transactions));
    //store.dispatch(StoreKpis.SetAll(data.metrics));
  }
}


export const getDashboardData = () => {
  const ep = network.endpoint.dashboard;
  let params = [];
  //console.log(ep);
  network.request(ep, params)
  .then((response) => {
    //console.log(JSON.stringify(response));
    setDashboardData(response);

    //getAionPrice();//get price
    //network.eRequest('pro-api.coinmarketcap.com/v1/cryptocurrency/',true,'/listings/latest','{start: 1,limit: 5,convert: "USD"}',"{'CMC_PRO_API_KEY': 'e2738416-a8f2-4b17-ba40-eb376dff4d15'}");


    // connect to socket after initial data fetch
    network.connectSocket((response) => {
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

export const getKPIData = () => {
  
    // get data for liveness indicator in the header
    //console.log('get kpi');
    /*network.connectSocket((response) => {
      setKPIData(response);
    });*/
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
      //store.dispatch(StoreTknList.SetTopLevel({}));
    });
  
}

/*
export const setup = () => {
  network.configuration()
  .then((r) => {
    store.dispatch(StoreConfig.SetAll(r));
    getDashboardData();
  })
  .catch((e) => {
    console.log(e);
  });
}*/

// ========================================================
// Top Level Search 
// ========================================================
/*
export const getSearch = (callback, queryStr) => {
  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    // query for the new result
    setTimeout(() => {
      let block = {
        entityType: "block",
        ...mock.blk
      };

      callback(block);
    }, 2000);
  }
  else {
    const ep = network.endpoint.search;
    let params = [nc_trim(queryStr)];
    network.request(ep, params)
    .then((response) => {
      callback(response);
    })
    .catch((error) => {
      console.log(error);
      callback({});
    });
  }
}
*/

// ========================================================
// Tokens
// ========================================================

export const getTknListTopLevel = (listType, queryStr) => {
  store.dispatch(StoreTknList.GetTopLevel({
    queryStr: queryStr,
    listType: listType,
  }));

  //console.log('Then network level!');

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
      }/*
      case txnListType.BY_ACCOUNT: {
        if (request == 0 || request == "0x0") {
          request = "0000000000000000000000000000000000000000000000000000000000000000"
        } else if (!nc_isValidEntity(request)) {
          store.dispatch(StoreTxnList.SetTopLevel({}));
          return;
        }

        params = [request, 0, PAGE_SIZE]
        break;
      }*/
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

  if (network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = Object.assign({}, store.getState().tknList.response);
      response.page.number = pageNumber;

      store.dispatch(StoreTknList.SetPaging(response));
    }, 500);
  }
  else {
    const ep = network.endpoint.token.list[listType];
    let params = [];
    let size = (pageSize > PAGE_SIZE) ? pageSize : PAGE_SIZE;
    switch(listType) {
      case tknListType.ALL: {
        params = [pageNumber, size,start, end]
        break;
      }
      case tknListType.BY_BLOCK: {
        params = [nc_trim(queryStr), pageNumber, size]
        break;
      }
      /*
      case txnListType.BY_ACCOUNT: {
        let request = nc_trim(queryStr);
        if (request == 0 || request == "0x0") {
          request = "0000000000000000000000000000000000000000000000000000000000000000"
        }

        params = [request, pageNumber, PAGE_SIZE]
        break;
      }*/
    }
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
    //console.log("getTknRetrieveTopLevel live");
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

export const getTknRetrievePagingTxnList = (queryStr, pageNumber) => {
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
    const ep = network.endpoint.transaction.list[txnListType.BY_ACCOUNT];
    let params = [queryStr, pageNumber, PAGE_SIZE];
    network.request(ep, params)
    .then((response) => {
      // ok, now make sure that the response you got is still valid
      // ie. matches up to the account loaded on-screen
      let tkn = store.getState().tknRetrieve.response.tkn;

      if (tkn && tkn.data && tkn.data.content && tkn.data.content[0]) {
        if (nc_sanitizeHex(tkn.data.content[0].address) == nc_sanitizeHex(queryStr)) {
            store.dispatch(StoreTknRetrieve.SetPagingTxn(response));  
        }
      }
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreTknRetrieve.SetPagingTxn({}));
    });
  }
}
export const getTknRetrievePagingBlkList = (queryStr, pageNumber) => {
  store.dispatch(StoreTknRetrieve.GetPagingBlk());

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = Object.assign({}, store.getState().tknRetrieve.response.blk);
      response.page.number = pageNumber;

      store.dispatch(StoreTknRetrieve.SetPagingBlk(response));
    }, 500);
  }
  else {
    const ep = network.endpoint.block.list[blkListType.BY_ACCOUNT];
    let params = [queryStr, pageNumber, PAGE_SIZE];
    network.request(ep, params)
    .then((response) => {
      // ok, now make sure that the response you got is still valid
      // ie. matches up to the account loaded on-screen
      let tkn = store.getState().tknRetrieve.response.tkn;
      if (tkn && tkn.data && tkn.data.content && tkn.data.content[0]) {
        if (nc_sanitizeHex(tkn.data.content[0].address) == nc_sanitizeHex(queryStr)) {
            store.dispatch(StoretknRetrieve.SetPagingBlk(response));  
        }
      }
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreTknRetrieve.SetPagingBlk({}));
    });
  }
}

 let showView = (entity,request) => {

     //console.log(JSON.stringify(entity));
     //console.log(JSON.stringify(entity.content[0]));

    switch(entity.searchType)
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
    let request = nc_trim(queryStr);

    // get block details
    const ep = network.endpoint.search;
    let params = [request,  0, PAGE_SIZE];
    network.request(ep, params)
    .then((response) => {
      //console.log("Goo"+JSON.stringify(response));

      if(typeof response.searchType !== "undefined" && response.searchType !== "token"){ 

        showView(response,request);
       
      }
      else if(typeof response.searchType !== "undefined"){ 

        store.dispatch(StoreRetrieve.SetTopLevel(response));

      }
      else{
        store.dispatch(StoreRetrieve.SetTopLevel({
        
        }));
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
        //nc_getChartData(response,)
        //store.dispatch(StoreChartRetrieve.SetChart(response));
    
    })
    .catch((error) => {
      console.log(error);
      /*store.dispatch(StoreChartRetrieve.SetChart({
        
      }));*/
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
      
        console.log(JSON.stringify(response)); 
        //nc_getChartData(response,)
        //store.dispatch(StoreChartRetrieve.SetChart(response));
    
    })
    .catch((error) => {
      console.log(error);
      /*store.dispatch(StoreChartRetrieve.SetChart({
        
      }));*/
    });
  }

}
export const getChartRetrieve = (queryStr) => {
  store.dispatch(StoreChartRetrieve.GetChart({
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
    let request = nc_trim(queryStr);

    // get block details
    const ep = network.endpoint.chart.detail;
    //console.log(JSON.stringify(network.endpoint.chart.detail)+"   "+JSON.stringify(request)); 
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


























