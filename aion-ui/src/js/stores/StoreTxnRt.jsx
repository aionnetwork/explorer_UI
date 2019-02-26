/* eslint-disable */
import moment from 'moment';

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
  data: [],
}

export function reducer_txnRt (state = initialState_StoreRtTransactions, action) 
{
  switch(action.type)
  {
    case 'RT_TRANSACTIONS_SET_ALL':
    {
      let _state = Object.assign({}, state);
      
      let data = action.data;
      if (!Array.isArray(data)) return _state;

      //sanitize block data coming from different sources
      /*for (let i=0; i < data.length; i++) 
      {
        if (data[i].toAddr == null && data[i].to != null)
          data[i].toAddr = data[i].to;   

        if (data[i].fromAddr == null && data[i].from != null)
          data[i].fromAddr = data[i].from;

        if (data[i].blockTimestamp == null && data[i].timestamp != null)
          data[i].blockTimestamp = data[i].timestamp;

        if (data[i].transactionHash == null && data[i].hash != null)
          data[i].transactionHash = data[i].hash;
      }*/


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