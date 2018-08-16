/* eslint-disable */
import moment from 'moment';
import { tknListType } from 'lib/NCEnums';

// Top Level 
// ---------
export const GetTopLevel = (data) => 
{
  return {
    type: 'TKN_LIST_GET_TOP_LEVEL',
    data: data,
  }
}
export const SetTopLevel = (data) => 
{
  return {
    type: 'TKN_LIST_SET_TOP_LEVEL',
    data: data,
  }
}

// Paging
// ------ 
export const GetPaging = (data) => 
{
  return {
    type: 'TKN_LIST_GET_PAGING',
    data: data,
  }
}
export const SetPaging = (data) => 
{
  return {
    type: 'TKN_LIST_SET_PAGING',
    data: data,
  }
}

let initialState_StoreTknList = 
{
  isLoadingPaging: false,
  isLoadingTopLevel: false, 
  
  queryStr: "",
  listType: tknListType.ALL,
  
  response: null,
  momentUpdated: null
};

export function reducer_tknList (state = initialState_StoreTknList, action) 
{
  switch(action.type)
  {
    // Top Level 
    // ---------
    case 'TKN_LIST_GET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = true; 
      _state.queryStr = action.data.queryStr;
      _state.listType = action.data.listType;
      
      _state.response = null;
      _state.momentUpdated = null;
      
      return _state;
    }
    case 'TKN_LIST_SET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = false; 
      
      _state.response = action.data;
      _state.momentUpdated = moment();
      
      return _state;
    }

    // Paging
    // ------ 
    case 'TKN_LIST_GET_PAGING':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPaging = true;
      
      return _state;
    }
    case 'TKN_LIST_SET_PAGING':
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



















































