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
  
  isLoading: false, 
  response: false,
  message: "success!!"
  
};

export function reducer_contactRetrieve (state = initialState_StoreContactRetrieve, action) 
{
  switch(action.type)
  {
    
    case 'CONTACT_RETRIEVE_SET':
    {
      let _state = Object.assign({}, state);
      
      _state.isLoading = false; 
      _state.response = true;
      _state.message = "success!!";
      
      return _state;
    }
    default: 
    {
      return state;
    }
  }
}


















































