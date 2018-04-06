/* eslint-disable */
import moment from 'moment'; 
import * as mock from 'lib/NCData';

export const SetAll = (blockList) => 
{
  return {
    type: 'RT_BLOCKS_SET_ALL',
    data: blockList,
  }
}

let initialState_StoreRtBlocks = 
{
  momentUpdated: null,
  data: [],
}

export function reducer_blkRt (state = initialState_StoreRtBlocks, action) 
{
  switch(action.type)
  {
    case 'RT_BLOCKS_SET_ALL':
    {
      let _state = Object.assign({}, state);

      let data = action.data;

      if (!Array.isArray(data)) return _state;

      //sanitize block data coming from different sources
      for (let i=0; i < data.length; i++) 
      {
        if (data[i].blockNumber == null && data[i].number != null)
          data[i].blockNumber = data[i].number;
        
        if (data[i].timestampVal == null && data[i].timestamp != null)
          data[i].timestampVal = data[i].timestamp;

        if (data[i].minerAddress == null && data[i].miner != null)
          data[i].minerAddress = data[i].miner;
      }

      _state.data = data;
      _state.momentUpdated = moment();
      
      //console.log(_state);

      return _state;
    }
    default: 
    {
      return state;
    }
  }
}
















































