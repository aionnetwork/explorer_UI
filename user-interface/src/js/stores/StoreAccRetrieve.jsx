/* eslint-disable */
import moment from 'moment';

// Top Level 
// ---------
export const GetTopLevel = (data) => 
{
  return {
    type: 'ACC_RETRIEVE_GET_TOP_LEVEL',
    data: data,
  }
}
export const SetTopLevel = (data) => 
{
  return {
    type: 'ACC_RETRIEVE_SET_TOP_LEVEL',
    data: data,
  }
}

// Paging Transaction
// ------------------
export const GetPagingTxn = (data) => 
{
  return {
    type: 'ACC_RETRIEVE_GET_PAGING_TXN',
    data: data,
  }
}
export const SetPagingTxn = (data) => 
{
  return {
    type: 'ACC_RETRIEVE_SET_PAGING_TXN',
    data: data,
  }
}

// Paging Block
// ------------
export const GetPagingBlk = (data) => 
{
  return {
    type: 'ACC_RETRIEVE_GET_PAGING_BLK',
    data: data,
  }
}
export const SetPagingBlk = (data) => 
{
  return {
    type: 'ACC_RETRIEVE_SET_PAGING_BLK',
    data: data,
  }
}

let initialState_StoreBlkRetrieve = 
{
  isLoadingPagingBlkList: false,
  isLoadingPagingTxnList: false,
  isLoadingTopLevel: false, 
  
  queryStr: "",
  
  response: {
    acc: {
      data: null,
      momentUpdated: null
    },
    blk: {
      data: null,
      momentUpdated: null
    },
    txn: {
      data: null,
      momentUpdated: null
    },
    momentUpdated: null,
    web3: false
  }
};

export function reducer_accRetrieve (state = initialState_StoreBlkRetrieve, action) 
{
  switch(action.type)
  {
    // Top Level 
    // ---------
    case 'ACC_RETRIEVE_GET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = true; 
      _state.queryStr = action.data.queryStr;
      
      _state.response.acc.momentUpdated = null;
      _state.response.blk.momentUpdated = null;
      _state.response.txn.momentUpdated = null;
      _state.momentUpdated = null;
      
      return _state;
    }
    case 'ACC_RETRIEVE_SET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = false; 
      
      _state.response.acc.data = action.data;
      _state.response.acc.momentUpdated = moment();
      _state.momentUpdated = moment();
      
      return _state;
    }

    // Paging Transaction
    // ------------------
    case 'ACC_RETRIEVE_GET_PAGING_TXN':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPagingTxnList = true;

      return _state;
    }
    case 'ACC_RETRIEVE_SET_PAGING_TXN':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPagingTxnList = false;
      
      _state.response.txn.data = action.data;
      _state.response.txn.momentUpdated = moment();
      _state.momentUpdated = moment();

      return _state;
    }

    // Paging Block
    // ------------
    case 'ACC_RETRIEVE_GET_PAGING_BLK':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPagingBlkList = true;
      
      return _state;
    }
    case 'ACC_RETRIEVE_SET_PAGING_BLK':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPagingBlkList = false;
      
      _state.response.blk.data = action.data;
      _state.response.blk.momentUpdated = moment();
      _state.momentUpdated = moment();
      
      return _state;
    }

    default: 
    {
      return state;
    }
  }
}


















































