/* eslint-disable */
import moment from 'moment';


export const SetData = (data) => 
{
  return {
    type: 'CONTACT_RETRIEVE_SET',
    data: data,
  }
}



let initialState_StoreContactRetrieve = 
{
  isLoadingPagingList: false,
  isLoading: false, 
  
  queryStr: "",

  response: "Error!",
  momentUpdated: null
};

export function reducer_contactRetrieve (state = initialState_StoreContactRetrieve, action) 
{
  switch(action.type)
  {
    
    case 'CONTACT_RETRIEVE_SET':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoading = false; 
      
      _state.response = "Success!";
      _state.momentUpdated = moment();
      
      return _state;
    }
    default: 
    {
      return state;
    }
  }
}


















































