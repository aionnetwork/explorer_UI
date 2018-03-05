/* eslint-disable */
import moment from 'moment';
import * as mock from 'lib/NCData';

export const SetAll = (data) => 
{
  return {
    type: 'KPI_SET_ALL',
    data: data,
  }
}

let initialState_StoreKPIs = 
{
  momentUpdated: null,
  data: {
    transactionPerSecond: null,
    peakTransactionsPerBlockInLast24hours: null,
    totalTransactionsInLast24hours: null,
    
    averageEnergyConsumed: null,
    averageEnergyPrice: null,
    
    hashRate: null,
    averageDifficulty: null,
    lastBlockReward: null,

    targetBlockTime: 10,
    averageBlockTime: null,
  },
}

export function reducer_kpis (state = initialState_StoreKPIs, action) 
{
  switch(action.type)
  {
    case 'KPI_SET_ALL':
    {
      let _state = Object.assign({}, state);
      
      let input = action.data;
      let data = _state.data;

      if (input == null) return _state;

      data.transactionPerSecond = input.transactionPerSecond;
          
      data.peakTransactionsPerBlockInLast24hours = input.peakTransactionsPerBlockInLast24hours;
      data.totalTransactionsInLast24hours = input.totalTransactionsInLast24hours;
          
      data.averageEnergyConsumed = input.averageEnergyConsumed;
      data.averageEnergyPrice = input.averageEnergyPrice;
          
      data.hashRate = input.hashRate;
      data.averageDifficulty = input.averageDifficulty;
      data.lastBlockReward = input.lastBlockReward;
          
      data.averageBlockTime = input.averageBlockTime;
          
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






























































