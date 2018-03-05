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
      if (data.constructor !== Array) return _state;

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
















































