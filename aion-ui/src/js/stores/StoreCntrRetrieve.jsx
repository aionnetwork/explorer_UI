/* eslint-disable */
import moment from 'moment';

// Top Level 
// ---------
export const GetTopLevel = (data) => 
{
  return {
    type: 'CNTR_RETRIEVE_GET_TOP_LEVEL',
    data: data,
  }
}
export const SetTopLevel = (data) => 
{
  return {
    type: 'CNTR_RETRIEVE_SET_TOP_LEVEL',
    data: data,
  }
}

// Paging Transaction
// ------------------
export const GetPagingTxn = (data) => 
{
  return {
    type: 'CNTR_RETRIEVE_GET_PAGING_TXN',
    data: data,
  }
}
export const SetPagingTxn = (data) => 
{
  return {
    type: 'CNTR_RETRIEVE_SET_PAGING_TXN',
    data: data,
  }
}
// Paging Transaction
// ------------------
export const GetTkn = (data) => 
{
  return {
    type: 'CNTR_RETRIEVE_GET_TKN',
    data: data,
  }
}
export const SetTkn = (data) => 
{
  return {
    type: 'CNTR_RETRIEVE_SET_TKN',
    data: data,
  }
}
// Paging Block
// ------------
export const GetPagingBlk = (data) => 
{
  return {
    type: 'CNTR_RETRIEVE_GET_PAGING_BLK',
    data: data,
  }
}
export const SetPagingBlk = (data) => 
{
  return {
    type: 'CNTR_RETRIEVE_SET_PAGING_BLK',
    data: data,
  }
}
// Paging Event
// ------------
export const GetPagingEvent = (data) => 
{
  return {
    type: 'CNTR_RETRIEVE_GET_PAGING_EVENT',
    data: data,
  }
}
export const SetPagingEvent = (data) => 
{
  return {
    type: 'CNTR_RETRIEVE_SET_PAGING_EVENT',
    data: data,
  }
}
let initialState_StoreCntrRetrieve = 
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
    tkn: {
      data: null,
      momentUpdated: null
    },
    event: {
      data: null,
      momentUpdated: null
    },
    momentUpdated: null,
    web3: false
  }
};

export function reducer_cntrRetrieve (state = initialState_StoreCntrRetrieve, action) 
{
  switch(action.type)
  {
    // Top Level 
    // ---------
    case 'CNTR_RETRIEVE_GET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = true; 
      _state.isLoadingPagingEventList = true;

      _state.queryStr = action.data.queryStr;
      
      _state.token = action.data.token;

      _state.response.acc.momentUpdated = null;
      _state.response.blk.momentUpdated = null;
      _state.response.txn.momentUpdated = null;
      _state.response.event.momentUpdated = null;
      _state.momentUpdated = null;
      
      return _state;
    }
    case 'CNTR_RETRIEVE_SET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = false; 

      _state.token = action.data.token;
      
      _state.response.acc.data = action.data;
      _state.response.acc.momentUpdated = moment();
      _state.momentUpdated = moment();

      _state.response.event.data = action.data.content[0].event;
      console.log('coookfkdflsdlfksdlfklsk'+JSON.stringify(action.data.content[0].events));
      _state.response.event.momentUpdated = moment();
      _state.momentUpdated = moment();
      
      return _state;
    }

    // Paging Transaction
    // ------------------
    case 'CNTR_RETRIEVE_GET_PAGING_TXN':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPagingTxnList = true;

      return _state;
    }
    case 'CNTR_RETRIEVE_SET_PAGING_TXN':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPagingTxnList = false;
      
      _state.response.txn.data = action.data;
      _state.response.txn.momentUpdated = moment();
      _state.momentUpdated = moment();

      return _state;
    }
    // Paging Token
    // ------------------
    case 'CNTR_RETRIEVE_GET_TKN':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPagingTknList = true;

      return _state;
    }
    case 'CNTR_RETRIEVE_SET_TKN':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPagingTknList = false;
      
      _state.response.tkn.data = action.data;
      _state.response.tkn.momentUpdated = moment();
      //_state.momentUpdated = moment();

      return _state;
    }
    // Paging Block
    // ------------
    case 'CNTR_RETRIEVE_GET_PAGING_BLK':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPagingBlkList = true;
      
      return _state;
    }
    case 'CNTR_RETRIEVE_SET_PAGING_BLK':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPagingBlkList = false;
      
      _state.response.blk.data = action.data;
      _state.response.blk.momentUpdated = moment();
      _state.momentUpdated = moment();
      
      return _state;
    }
    // Paging Block
    // ------------
    case 'CNTR_RETRIEVE_GET_PAGING_EVENT':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPagingEventList = true;
      
      return _state;
    }
    case 'CNTR_RETRIEVE_SET_PAGING_EVENT':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPagingEventList = false;
      
      _state.response.event.data = action.data;
      _state.response.event.momentUpdated = moment();
      _state.momentUpdated = moment();

      console.log('event moment');
      
      return _state;
    }

    default: 
    {
      return state;
    }
  }
}


















































