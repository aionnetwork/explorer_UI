/* eslint-disable */
import moment from 'moment';

// Top Level 
// ---------
export const GetTopLevel = (data) => 
{
  return {
    type: 'BLK_RETRIEVE_GET_TOP_LEVEL',
    data: data,
  }
}
export const SetTopLevel = (data) => 
{
  return {
    type: 'BLK_RETRIEVE_SET_TOP_LEVEL',
    data: data,
  }
}

// Paging
// ------
export const GetPagingTxn = (data) => 
{
  return {
    type: 'BLK_RETRIEVE_GET_PAGING_TXN',
    data: data,
  }
}
export const SetPagingTxn = (data) => 
{
  return {
    type: 'BLK_RETRIEVE_SET_PAGING_TXN',
    data: data,
  }
}

let initialState_StoreChartRetrieve = 
{
  isLoadingPagingTxnList: false,
  isLoadingTopLevel: false, 
  
  queryStr: "",

  response: {
    blk: null,
    txn: null
  },
  momentUpdated: null
};

export function reducer_chartRetrieve (state = initialState_StoreChartRetrieve, action) 
{
  switch(action.type)
  {
    // Top Level 
    // ---------
    case 'BLK_RETRIEVE_GET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = true; 
      _state.queryStr = action.data.queryStr;
      
      _state.momentUpdated = null;
      
      return _state;
    }
    case 'BLK_RETRIEVE_SET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = false; 
      
      _state.response = action.data;
      _state.momentUpdated = moment();
      
      return _state;
    }

    // Paging
    // ------ 
    case 'BLK_RETRIEVE_GET_PAGING_TXN':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPagingTxnList = true;
      
      return _state;
    }
    case 'BLK_RETRIEVE_SET_PAGING_TXN':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPagingTxnList = false;
      
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


















































