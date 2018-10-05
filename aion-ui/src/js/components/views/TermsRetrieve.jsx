/* eslint-disable */
import React, { Component } from 'react';

import Recaptcha from 'react-recaptcha';
import NCNonIdealState from 'components/common/NCNonIdealState'

import moment from 'moment';
import { Button, Position, Classes, Popover, Menu, MenuItem, InputGroup, Intent, PopoverInteractionKind } from "@blueprintjs/core";

import NCTxnTable from 'components/transactions/NCTxnTable';
import NCBlkDetail from 'components/blocks/NCBlkDetail';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
import NCExplorerSection from 'components/common/NCExplorerSection';


export default class TermsRetrieve extends Component
{ 
  download(){
    console.log('coool');
  }
  render() {  
    
    const style = { };
    const recapcontainer = {position:'relative',width:'310px',margin:'auto',top:'100px',padding:'5px' };
    const stylerecaptcha = {margin:'auto', };
    const breadcrumbs = [
      {
        link: '/',
        body: 'Home',
      },
      {
        link: '/blocks',
        body: 'Blocks',
      },
      {
        link: '#',
        body: 'Block Details',
      }
    ];
     const page =
      <div> 
        <NCExplorerHead
          
          breadcrumbs={breadcrumbs}
          title={"Block"}
          subtitle={'desc'}


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























