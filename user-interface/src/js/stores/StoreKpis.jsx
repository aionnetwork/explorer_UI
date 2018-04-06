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
    
    hashRate: null,
    averageDifficulty: null,
    lastBlockReward: null,

    targetBlockTime: 10,
    averageBlockTime: null,

    averageNrgLimitPerBlock: null,
    averageNrgConsumedPerBlock: null,

    startBlock: null,
    startTimestamp: null,

    endBlock: null,
    endTimestamp: null,

    currentBlockchainHead: null,
    blockWindow: null,
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
          
      data.hashRate = input.hashRate;
      data.averageDifficulty = input.averageDifficulty;
      data.lastBlockReward = input.lastBlockReward;
        
      data.averageBlockTime = input.averageBlockTime;
      data.targetBlockTime = input.targetBlockTime;
      
      data.averageNrgLimitPerBlock = input.averageNrgLimitPerBlock;
      data.averageNrgConsumedPerBlock = input.averageNrgConsumedPerBlock;

      data.startBlock = input.startBlock;
      data.startTimestamp = input.startTimestamp;
      
      data.endBlock = input.endBlock;
      data.endTimestamp = input.endTimestamp;

      data.blockWindow = input.blockWindow;
      data.currentBlockchainHead = input.currentBlockchainHead;

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






























































