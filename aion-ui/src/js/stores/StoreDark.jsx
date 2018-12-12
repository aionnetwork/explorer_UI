/* eslint-disable */
import moment from 'moment';
import * as mock from 'lib/NCData';

export const SetAll = (isdark) => 
{
  return {
    type: 'DARK_MODE',
    data: isdark}
}


let initialState_StoreDark = 
{
  data: false,
}

export function reducer_dark (state = initialState_StoreDark, action) 
{
  switch(action.type)
  {
    case 'DARK_MODE':
    {
      let _state = Object.assign({}, state);
      console.log('dark mode');
      _state.data = action.data;
      
      return _state;
    }
    default: 
    {
      return state;
    }
  }

   
}






























































