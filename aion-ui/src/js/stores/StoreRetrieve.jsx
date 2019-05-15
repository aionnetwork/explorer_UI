/* eslint-disable */
import moment from 'moment';

// Top Level 
// ---------
export const GetTopLevel = (data) => 
{
  return {
    type: 'RETRIEVE_GET_TOP_LEVEL',
    data: data,
  }
}
export const Set = (data) =>
{
  return {
    type: 'SET_RESPONSE',
    data: data,
  }
}
export const SetTopLevel = (data) =>
{
  return {
    type: 'SET_TOP_LEVEL',
    data: data,
  }
}

let initialState_StoreRetrieve = 
{
  isLoadingTopLevel: false,

  queryStr: "",

  response: null
};

export function reducer_Retrieve (state = initialState_StoreRetrieve, action) 
{
  switch(action.type)
  {
    // Top Level 
    // ---------
    case 'RETRIEVE_GET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = true; 
      _state.queryStr = action.data.queryStr;
      
      _state.momentUpdated = null;
      
      return _state;
    }
    case 'SET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);

      _state.isLoadingTopLevel = false;

      _state.response.data = action.data;

      _state.momentUpdated = moment();



      return _state;
    }
    case 'SET_RESPONSE':
    {
          let _state = Object.assign({}, state);
          _state.response = action.data.searchResults;
          _state.queryStr = action.data.queryStr;
          return _state;
    }
    default: 
    {
      return state;
    }
  }
}


















































