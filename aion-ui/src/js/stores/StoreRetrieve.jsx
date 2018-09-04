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
    type: 'RETRIEVE_SET_TOP_LEVEL',
    data: data,
  }
}


let initialState_StoreRetrieve = 
{
  isLoadingTopLevel: false, 
  
  queryStr: "",
  
  response: {
    
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
      
      _state.response.acc.momentUpdated = null;
      _state.response.blk.momentUpdated = null;
      _state.response.txn.momentUpdated = null;

      _state.momentUpdated = null;
      
      return _state;
    }
    case 'RETRIEVE_SET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = false; 
      
      _state.response.data = action.data;
      _state.response.acc.momentUpdated = moment();
      _state.momentUpdated = moment();
      
      return _state;
    }
    default: 
    {
      return state;
    }
  }
}


















































