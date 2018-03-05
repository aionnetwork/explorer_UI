/* eslint-disable */
import moment from 'moment';
import * as mock from 'lib/NCData';

export const SetAll = (transactionList) => 
{
  return {
    type: 'RT_TRANSACTIONS_SET_ALL',
    data: transactionList,
  }
}

let initialState_StoreRtTransactions = 
{
  momentUpdated: null,
  data: {},
}

export function reducer_txnRt (state = initialState_StoreRtTransactions, action) 
{
  switch(action.type)
  {
    case 'RT_TRANSACTIONS_SET_ALL':
    {
      let _state = Object.assign({}, state);
      
      let data = action.data;
      if (data.constructor !== Array) return _state;

      _state.data = data;
      _state.momentUpdated = moment();
      
      return _state;
    }
    default: 
    {
      return state;
    }
  }
}