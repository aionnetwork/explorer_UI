/* eslint-disable */
import moment from 'moment';

// Top Level 
// ---------
export const GetTopLevel = () => 
{
  return {
    type: 'CNTR_LIST_GET_TOP_LEVEL',
  }
}
export const SetTopLevel = (data) => 
{
  return {
    type: 'CNTR_LIST_SET_TOP_LEVEL',
    data: data,
  }
}

// Paging
// ------ 
export const GetPaging = (data) => 
{
  return {
    type: 'CNTR_LIST_GET_PAGING',
    data: data,
  }
}
export const SetPaging = (data) => 
{
  return {
    type: 'CNTR_LIST_SET_PAGING',
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

export function reducer_cntrList (state = initialState_StoreBlkList, action) 
{
  switch(action.type)
  {
    // Top Level 
    // ---------
    case 'CNTR_LIST_GET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = true; 

      _state.response.miners = null;
      _state.response.txnInbound = null;
      _state.response.txnOutbound = null;

      _state.momentUpdated = null;
      
      return _state;
    }
    case 'CNTR_LIST_SET_TOP_LEVEL':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingTopLevel = false; 
      
      _state.response.content = action.data.content;
      _state.response.page = action.data.page;
      //_state.response.txnInbound = action.data.txnInbound;
      //_state.response.txnOutbound = action.data.txnOutbound;
      
      _state.momentUpdated = moment();
      
      return _state;
    }
    case 'CNTR_LIST_SET_PAGING':
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



















































