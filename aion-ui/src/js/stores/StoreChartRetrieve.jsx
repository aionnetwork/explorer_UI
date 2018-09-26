/* eslint-disable */
import moment from 'moment';

// Top Level 
// ---------
export const GetChart = (data) => 
{
  return {
    type: 'CHART_RETRIEVE_GET',
    data: data,
  }
}
export const SetChart = (data) => 
{
  return {
    type: 'CHART_RETRIEVE_SET',
    data: data,
  }
}

// Paging
// ------
export const GetPagingChart = (data) => 
{
  return {
    type: 'CHART_RETRIEVE_GET_PAGING',
    data: data,
  }
}
export const SetPagingChart = (data) => 
{
  return {
    type: 'CHART_RETRIEVE_SET_PAGING',
    data: data,
  }
}

let initialState_StoreChartRetrieve = 
{
  isLoadingPagingList: false,
  isLoading: false, 
  
  queryStr: "",

  response: {
   
  },
  momentUpdated: null
};

export function reducer_chartRetrieve (state = initialState_StoreChartRetrieve, action) 
{
  switch(action.type)
  {
    // Top Level 
    // ---------
    case 'CHART_RETRIEVE_GET':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoading = true; 
      _state.queryStr = action.data.queryStr;

      //console.log(JSON.stringify(action));
      
      _state.momentUpdated = null;
      
      return _state;
    }
    case 'CHART_RETRIEVE_SET':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoading = false; 
      
      _state.response = action.data;
      _state.momentUpdated = moment();
      
      return _state;
    }

    // Paging
    // ------ 
    case 'CHART_RETRIEVE_GET_PAGING':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoadingPagingTxnList = true;
      
      return _state;
    }
    case 'CHART_RETRIEVE_SET_PAGING':
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


















































