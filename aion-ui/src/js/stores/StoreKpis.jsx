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
export const SetAllV2 = (data) =>
{
  return {
    type: 'KPI_SET_ALL_V2',
    data: data,
  }
}
export const SetHealth = (data) =>
{
  return {
    type: 'SET_HEALTH',
    data: data,
  }
}
export const getAll = (data) => 
{
  return {
    type: 'KPI_GET_ALL',
    data: data,
  }
}

let initialState_StoreKPIs = 
{
  momentUpdated: moment(),
  data: {
    transactionPerSecond: null,
    peakTransactionsPerBlockInLast24hours: null,
    peakTransactionsPerBlock: null,//v2
    totalTransactionsInLast24hours: null,
    totalTransactions: null,//v2
    
    hashRate: null,
    averagedHashPower: null,//v2
    averageDifficulty: null,
    //
    powBlockDifficulty: null,
    posBlockDifficulty: null,
    powBlockTime: null,
    posBlockTime: null,
    averagePosIssuance: null,
    percentageOfNetworkStaking: null,
    totalStake: null,
    //
    lastBlockReward: null,

    targetBlockTime: 10,
    averageBlockTime: null,

    averageNrgLimitPerBlock: null,
    averageNrgConsumedPerBlock: null,
    averageNrgLimit: null,//v2
    averageNrgConsumed: null,//v2
    startBlock: null,
    startTimestamp: null,

    endBlock: null,
    endTimestamp: null,

    currentBlockchainHead: null,
    blockWindow: null,
    status: "STALLED"


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
      data.dbBlockTableHead = input.dbBlockTableHead;

      _state.data = data;
      _state.momentUpdated = moment();
      
      return _state;
    }
    case 'KPI_SET_ALL_V2':
    {
          let _state = Object.assign({}, state);

          let input = action.data;
          let data = _state.data;

          if (input == null) return _state;

          data.transactionsPerSecond = input.transactionsPerSecond;
          data.peakTransactionsPerBlock = input.peakTransactionsPerBlock;
          data.totalTransaction = input.totalTransaction;

          data.averagedHashPower = input.averagedHashPower;
          data.averageDifficulty = input.averageDifficulty;
          data.lastBlockReward = input.lastBlockReward;

          data.averageBlockTime = input.averageBlockTime;
          data.targetBlockTime = input.targetBlockTime;

          data.averageNrgLimit = input.averageNrgLimit;
          data.averageNrgConsumed = input.averageNrgConsumed;

          data.powBlockDifficulty = input.powBlockDifficulty;
          data.posBlockDifficulty = input.posBlockDifficulty;
          data.powBlockTime = input.powBlockTime;
          data.posBlockTime = input.posBlockTime;
          data.averagePosIssuance = input.averagePosIssuance;
          data.percentageOfNetworkStaking = input.percentageOfNetworkStaking;
          data.totalStake = input.totalStake;

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
    case 'SET_HEALTH':
    {
          let _state = Object.assign({}, state);

                let input = action.data;
                let data = _state.data;

                if (input == null) return _state;

                data.endTimestamp = input.timestamp;

                data.currentBlockchainHead = input.blockchainHead;
                data.dbBlockTableHead = input.dbBlockHead;
                data.status = input.status;

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






























































