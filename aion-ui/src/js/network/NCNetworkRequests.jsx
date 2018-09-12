/* eslint-disable */
import * as network from 'network/NCNetwork';
import { store } from 'stores/NCReduxStore'

import * as mock from 'lib/NCData';

import * as StoreKpis from 'stores/StoreKpis';

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

import * as StoreRetrieve from 'stores/StoreRetrieve';

import {BigNumber} from 'bignumber.js';
import { nc_isObjectEmpty, nc_trim, nc_isValidEntity, nc_isPositiveInteger, nc_sanitizeHex, nc_isObjectValid } from 'lib/NCUtility';
import { tknListType, txnListType, blkListType, accListType } from 'lib/NCEnums';

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

export const getBlkListPaging = (listType, queryStr, pageNumber) => {
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
    let params = [];
    switch(listType) {
      case blkListType.ALL: {
        params = [pageNumber, PAGE_SIZE, 'blockNumber,desc']
        break; 
      }/*
      case blkListType.BY_ACCOUNT: {
        let request = nc_sanitizeHex(queryStr);
        if (request == 0) {
          request = "0000000000000000000000000000000000000000000000000000000000000000"
        }

        params = [request, pageNumber, PAGE_SIZE]
        break;
      }*/
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
          content: []
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

  console.log('txn list top level');

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
        params = [0, PAGE_SIZE, 'blockNumber,desc']
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

export const getTxnListPaging = (listType, queryStr, pageNumber) => {
  store.dispatch(StoreTxnList.GetPaging());

  console.log('txn list paging');

  if (!network.NCNETWORK_REQUESTS_ENABLED) {
    setTimeout(() => {
      let response = Object.assign({}, store.getState().txnList.response);
      response.page.number = pageNumber;

      store.dispatch(StoreTxnList.SetPaging(response));
    }, 500);
  }
  else {
    const ep = network.endpoint.transaction.list[listType];
    let params = [];
    switch(listType) {
      case txnListType.ALL: {
        params = [pageNumber, PAGE_SIZE, 'blockNumber,desc']
        break;
      }
      case txnListType.BY_BLOCK: {
        params = [nc_trim(queryStr), pageNumber, PAGE_SIZE]
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

  console.log('txn retrieve list top level');

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
    console.log(ep);
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

export const getAccRetrieveTopLevel = (queryStr) => {
  store.dispatch(StoreAccRetrieve.GetTopLevel({
    queryStr: queryStr
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
    let request = nc_trim(queryStr);

    if (request == 0) {
      request = "0000000000000000000000000000000000000000000000000000000000000000"
    } else if (!nc_isValidEntity(request)) {
      store.dispatch(StoreAccRetrieve.SetTopLevel({
        content: []
      }));
      return;
    } else {
      request = nc_sanitizeHex(queryStr);
    }
    
    // get account details
    const ep = network.endpoint.account.detail;
    let params = [request];
    console.log(ep);
    network.request(ep, params)
    .then((response) => {
      const isAccValid = nc_isObjectValid(response);
      const isAccEmpty = nc_isObjectEmpty(response, isAccValid);

      console.log(JSON.stringify(response));
      // ok, make requests for blocks and transactions for this account
      store.dispatch(StoreAccRetrieve.SetTopLevel(response));
      console.log("Coool!");
      // we can save on a network request if the nonce is zero
      if (!isAccEmpty) {
        getAccRetrievePagingTxnList(request, 0);
        getAccRetrievePagingBlkList(request, 0);
        //getAccRetrieveTknList(request, 0);
        console.log("not empty!");
      }
    })
    .catch((error) => {
      console.log(error);
      store.dispatch(StoreAccRetrieve.SetTopLevel({}));
    });
  }
}

export const getAccRetrievePagingTxnList = (queryStr, pageNumber) => {
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
    const ep = network.endpoint.transaction.list[txnListType.BY_ACCOUNT];
    let params = [queryStr, pageNumber, PAGE_SIZE];
    network.request(ep, params)
    .then((response) => {
      // ok, now make sure that the response you got is still valid
      // ie. matches up to the account loaded on-screen
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

export const getAccRetrievePagingBlkList = (queryStr, pageNumber) => {
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
    let params = [queryStr, pageNumber, PAGE_SIZE];
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
// Dashboard 
// ========================================================

// using pub-sub to subscribe to data updates from webserver
// function to update stores upon receipt of published data
export const setDashboardData = (response) => {
  const isResponseEmpty = nc_isObjectEmpty(response);
  if(!isResponseEmpty) {
    let data = response.content[0];
    store.dispatch(StoreBlkRt.SetAll(data.blocks));
    store.dispatch(StoreTxnRt.SetAll(data.transactions));
    store.dispatch(StoreKpis.SetAll(data.metrics));
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

    // connect to socket after initial data fetch
    network.connectSocket((response) => {
      setDashboardData(response);
    });
  })
  .catch((error) => {
    console.log(error);
    
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
        params = [0, PAGE_SIZE, 'blockNumber,desc']
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

export const getTknListPaging = (listType, queryStr, pageNumber) => {
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
    switch(listType) {
      case tknListType.ALL: {
        params = [pageNumber, PAGE_SIZE, 'blockNumber,desc']
        break;
      }
      case tknListType.BY_BLOCK: {
        params = [nc_trim(queryStr), pageNumber, PAGE_SIZE]
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
    console.log("getTknRetrieveTopLevel live");
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
      console.log(JSON.stringify(response.searchType));
      if(typeof response.searchType !== "undefined"){ 
        store.dispatch(StoreRetrieve.SetTopLevel(response));
        console.log("right!");
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



























