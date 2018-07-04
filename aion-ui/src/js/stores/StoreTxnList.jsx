/* eslint-disable */
import moment from 'moment';
import { txnListType } from 'lib/NCEnums';

// Top Level 
// ---------
export const GetTopLevel = (data) => 
{
  return {
    type: 'TXN_LIST_GET_TOP_LEVEL',
    data: data,
  }
}
export const SetTopLevel = (data) => 
{
  return {
    type: 'TXN_LIST_SET_TOP_LEVEL',
    data: data,
  }
}

// Paging
// ------ 
export const GetPaging = (data) => 
{
  return {
    type: 'TXN_LIST_GET_PAGING',
    data: data,
  }
}
export const SetPaging = (data) => 
{
  return {
    type: 'TXN_LIST_SET_PAGING',
    data: data,
  }
}

let initialState_StoreBlkList = 
{
  isLoadingPaging: false,
  isLoadingTopLevel: false, 
  
  queryStr: "",
  listType: txnListType.ALL,
  
  response: null,
  momentUpdated: null
};

export function reducer_txnList (state = initialState_StoreBlkList, action) 
{
  switch(action.type)
  {
    // Top Level 
    // ---------
    case 'TXN_LIST_GET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = true; 
      _state.queryStr = action.data.queryStr;
      _state.listType = action.data.listType;
      
      _state.response = null;
      _state.momentUpdated = null;
      
      return _state;
    }
    case 'TXN_LIST_SET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = false; 
      
      _state.response = action.data;
      _state.momentUpdated = moment();
      
      return _state;
    }

    // Paging
    // ------ 
    case 'TXN_LIST_GET_PAGING':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPaging = true;
      
      return _state;
    }
    case 'TXN_LIST_SET_PAGING':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPaging = false;
      
      _state.response = action.data;
      _state.momentUpdated = moment();
      
      return _state;
    }

    default: 
    {
      return state;
    }
  }
}



















































