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

let initialState_StoreBlkRetrieve = 
{
  isLoadingPagingTxnList: false,
  isLoadingTopLevel: false, 
  
  queryStr: "",

  response: {
    txn: null
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
      _state.momentUpdated = moment();
      
      return _state;
    }

    default: 
    {
      return state;
    }
  }
}



















































