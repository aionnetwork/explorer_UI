/* eslint-disable */
import moment from 'moment';

export const SetAll = (data) => 
{
  return {
    type: 'APP_SET_ALL',
    data: data,
  }
}

let initialState_StoreConfig = 
{
  momentUpdated: null,
  data: {
    networkList: [],
  }
}

export function reducer_config (state=initialState_StoreConfig, action) 
{
  switch(action.type)
  {
    case 'APP_SET_ALL':
    {
      let input = action.data;
      let _state = Object.assign({}, state);

      if (Array.isArray(input.network_list)) {
        _state.data.networkList = input.network_list;
      }

      _state.momentUpdated = moment();
      return _state;
    }
    default: 
    {
      return state;
    }
  }
}






























































