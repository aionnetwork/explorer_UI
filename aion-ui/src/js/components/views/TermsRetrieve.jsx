/* eslint-disable */
import React, { Component } from 'react';

import moment from 'moment';
import {  Position } from "@blueprintjs/core";


import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';

export default class TermsRetrieve extends Component
{ 
  download(){
    console.log('coool');
  }
  render() {  
    

    const breadcrumbs = [
      {
        link: '/',
        body: 'Home',
      },
      {
        link: '/Terms',
        body: '#',
      }

    ];
     const page =
      <div> 
        <NCExplorerHead
          
          breadcrumbs={breadcrumbs}
          title={"Terms"}
          subtitle={''}


        />  

       
        
      </div>;


    return (
      <NCExplorerPage
        isLoading={false}
        isDataValid={true} 
        isDataEmpty={false}
       
        loadingStr={"Loading terms"}
        invalidDataStr={"Server error. Block structure invalid."}
        emptyDataStr={"No block found for descriptor:."}

        page={page}

        />
    );
  }
}























