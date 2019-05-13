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
export const SetTopLevel = (data) => 
{
  return {
    type: 'RETRIEVE_SET_TOP_LEVEL',
    data: data,
  }
}


let initialState_StoreRetrieve = 
{
  isLoadingTopLevel: false, 
  
  queryStr: "",
  
  response: {
    
    data:null,
    momentUpdated: null,
    web3: false
  }
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
    case 'RETRIEVE_SET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = false; 
      
      _state.response.data = action.data;
      
      _state.momentUpdated = moment();
      
      _state.response.test = "action.data";

      return _state;
    }
    default: 
    {
      return state;
    }
  }
}


















































