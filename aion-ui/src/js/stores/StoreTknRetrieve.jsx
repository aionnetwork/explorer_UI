/* eslint-disable */
import moment from 'moment';

// Top Level 
// ---------
export const GetTopLevel = (data) => 
{
  return {
    type: 'TKN_RETRIEVE_GET_TOP_LEVEL',
    data: data,
  }
}
export const SetTopLevel = (data) => 
{
  return {
    type: 'TKN_RETRIEVE_SET_TOP_LEVEL',
    data: data,
  }
}

// Paging Transaction
// ------------------
export const GetPagingTxn = (data) => 
{
  return {
    type: 'TKN_RETRIEVE_GET_PAGING_TXN',
    data: data,
  }
}
export const SetPagingTxn = (data) => 
{
  return {
    type: 'TKN_RETRIEVE_SET_PAGING_TXN',
    data: data,
  }
}

// Paging Block
// ------------
export const GetPagingBlk = (data) => 
{
  return {
    type: 'TKN_RETRIEVE_GET_PAGING_BLK',
    data: data,
  }
}
export const SetPagingBlk = (data) => 
{
  return {
    type: 'TKN_RETRIEVE_SET_PAGING_BLK',
    data: data,
  }
}

let initialState_StoreTknRetrieve = 
{
  isLoadingPagingBlkList: false,
  isLoadingPagingTxnList: false,
  isLoadingPagingTknList: false,
  isLoadingTopLevel: false, 
  
  queryStr: "",

  response: {
    transfers: {
      data: null,
      momentUpdated: null
    },
    holders: {
      data: null,
      momentUpdated: null
    },
    tkn: {
      data: null,
      momentUpdated: null
    },
  },
  momentUpdated: null,
  web3: false
};

export function reducer_tknRetrieve (state = initialState_StoreTknRetrieve, action) 
{
  switch(action.type)
  {
    // Top Level 
    // ---------
    case 'TKN_RETRIEVE_GET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = true; 
      _state.queryStr = action.data.queryStr;
      
      //_state.response.tkn = null;
      _state.response.tkn.momentUpdated = null;
      _state.response.holders.momentUpdated = null;
      _state.response.transfers.momentUpdated = null;
      _state.momentUpdated = null;
      
      return _state;
    }
    case 'TKN_RETRIEVE_SET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = false; 
      
      //_state.response = action.data;
      //console.log("This data: "+JSON.stringify(action));

      _state.response.tkn.data = action.data;
      _state.response.tkn.momentUpdated = moment();

    if(typeof action.data.content != 'undefined'){
      _state.response.transfers.data = action.data.content[0].transfers;//{"content":[]};
       _state.response.holders.data = action.data.content[0].holders;//{"content":[]};

      _state.response.transfers.momentUpdated = moment();     
      _state.response.holders.momentUpdated = moment();
    }

      _state.momentUpdated = moment();
      
      return _state;
    }

    // Paging Transaction
    // ------------------
    case 'TKN_RETRIEVE_GET_PAGING_TXN':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPagingTxnList = true;

      return _state;

    }
    case 'TKN_RETRIEVE_SET_PAGING_TXN':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPagingTxnList = false;
      
      _state.response.txn.data = action.data;
      _state.response.txn.momentUpdated = moment();
      _state.momentUpdated = moment();

      return _state;
    }

    case 'TKN_RETRIEVE_GET_PAGING_BLK':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPagingBlkList = true;
      
      return _state;
    }
    case 'TKN_RETRIEVE_SET_PAGING_BLK':
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



















































