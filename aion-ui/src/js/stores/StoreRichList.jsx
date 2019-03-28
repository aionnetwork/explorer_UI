/* eslint-disable */
import moment from 'moment';

// Rich List
// ---------

export const SetRichList = (data) => 
{
  return {
    type: 'ACC_RICH_LIST',
    data: data,
  }
}

let initialState_StoreRichList = 
{
  //isLoadingTopLevel: false,
  response: {
    
    richList: null
  }
  //momentUpdated: null
};

export function reducer_richList (state = initialState_StoreRichList, action) 
{
  switch(action.type)
  {
    // Top Level 
    // ---------
    case 'ACC_RICH_LIST':
    {
      let _state = Object.assign({}, state);
      console.log('rich list data');
                
      _state.response.richList = action.data.richList;
            
      return _state;
    }

    default: 
    {
      return state;
    }
  }
}



















































