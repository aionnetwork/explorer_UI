/* eslint-disable */
import moment from 'moment';
import * as mock from 'lib/NCData';

export const SetAll = (isdark) => 
{
  return {
    type: 'DARK_MODE',
    data: isdark}
}

let default_mode = JSON.parse(localStorage.getItem('d_mode'));

let initialState_StoreDark = 
{
  data: default_mode,
}

export function reducer_dark (state = initialState_StoreDark, action) 
{
  switch(action.type)
  {
    case 'DARK_MODE':
    {
      
      let _state = Object.assign({}, state);
      console.log('dark mode');
      //let val = localStorage.getItem('mode');
      if(action.data!==null){ 
        _state.data = action.data;
      }

      return _state;
    }
    default: 
    {
      return state;
    }
  }

   
}






























































