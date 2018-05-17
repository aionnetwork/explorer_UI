/* eslint-disable */
import moment from 'moment';

// Top Level 
// ---------
export const GetTopLevel = () => 
{
  return {
    type: 'ACC_LIST_GET_TOP_LEVEL',
  }
}
export const SetTopLevel = (data) => 
{
  return {
    type: 'ACC_LIST_SET_TOP_LEVEL',
    data: data,
  }
}

let initialState_StoreBlkList = 
{
  isLoadingTopLevel: false,
  response: {
    miners: null,
    txnInbound: null,
    txnOutbound: null
  },
  momentUpdated: null
};

export function reducer_accList (state = initialState_StoreBlkList, action) 
{
  switch(action.type)
  {
    // Top Level 
    // ---------
    case 'ACC_LIST_GET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = true; 

      _state.response.miners = null;
      _state.response.txnInbound = null;
      _state.response.txnOutbound = null;

      _state.momentUpdated = null;
      
      return _state;
    }
    case 'ACC_LIST_SET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = false; 
      
      _state.response.miners = action.data.miners;
      _state.response.txnInbound = action.data.txnInbound;
      _state.response.txnOutbound = action.data.txnOutbound;
      
      _state.momentUpdated = moment();
      
      return _state;
    }

    default: 
    {
      return state;
    }
  }
}



















































