/* eslint-disable */
import moment from 'moment';

// Top Level 
// ---------
export const GetTopLevel = (data) => 
{
  return {
    type: 'TXN_RETRIEVE_GET_TOP_LEVEL',
    data: data,
  }
}
export const SetTopLevel = (data) => 
{
  return {
    type: 'TXN_RETRIEVE_SET_TOP_LEVEL',
    data: data,
  }
}

// Paging Internal transfer
// ------------
export const GetPagingTrn = (data) => 
{
  return {
    type: 'TXN_RETRIEVE_GET_PAGING_TRN',
    data: data,
  }
}
export const SetPagingTrn = (data) => 
{
  return {
    type: 'TXN_RETRIEVE_SET_PAGING_TRN',
    data: data,
  }
}

export const SetTransfer = (data) =>
{
  return {
    type: 'TXN_RETRIEVE_SET_TRANSFER',
    data: data,
  }
}

export const SetTxnLogs = (data) =>
{
  return {
    type: 'TXN_RETRIEVE_SET_TXN_LOGS',
    data: data,
  }
}

let initialState_StoreBlkRetrieve = 
{
  isLoadingPagingTxnList: false,
  isLoadingTopLevel: false, 
  
  queryStr: "",

  response: {
    txn: null,
    itxn: null,
    trn: {
      data: null,
      momentUpdated: null
    },
  },
  
  momentUpdated: null
};

export function reducer_txnRetrieve (state = initialState_StoreBlkRetrieve, action) 
{
  switch(action.type)
  {
    // Top Level 
    // ---------
    case 'TXN_RETRIEVE_GET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = true; 
      _state.queryStr = action.data.queryStr;
      
      _state.response.txn = null;
      _state.momentUpdated = null;
      
      return _state;
    }
    case 'TXN_RETRIEVE_SET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = false; 
      
      _state.response.txn = action.data;
      _state.response.itxn = null;
      _state.momentUpdated = moment();
      
      return _state;
    }
    // Paging Internal transfers
    // ------------
    case 'TXN_RETRIEVE_GET_PAGING_TRN':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPagingTrnList = true;
      
      return _state;
    }
    case 'TXN_RETRIEVE_SET_PAGING_TRN':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPagingTrnList = false;
      
      _state.response.trn.data = action.data;
      _state.response.trn.momentUpdated = moment();
      _state.momentUpdated = moment();
      
      return _state;
    }
    case 'TXN_RETRIEVE_SET_TXN_LOGS':
    {
          let _state = Object.assign({}, state);
          if(typeof _state.response.txn.content !== "undefined"){
            _state.response.txn.content[0].log = action.data.content;
          }
          return _state;
    }
    case 'TXN_RETRIEVE_SET_TRANSFER':
    {
      let _state = Object.assign({}, state);

      _state.isLoadingTopLevel = false;
      _state.response.itxn = action.data;
      _state.momentUpdated = moment();

      return _state;
    }

    default: 
    {
      return state;
    }
  }
}



















































