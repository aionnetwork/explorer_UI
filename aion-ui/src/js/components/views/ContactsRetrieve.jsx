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
import NCExplorerContactUs from 'components/common/NCExplorerContactUs';


export default class ontactsRetrieve extends Component
{ 
  
  render() {  
    
   


    return (
      <NCExplorerContactUs
        isLoading={false}
        isDataValid={true} 
        isDataEmpty={false}
       
        loadingStr={"Loading terms"}
        invalidDataStr={"Server error. Block structure invalid."}
        emptyDataStr={"No block found for descriptor:."}

        

        />
    );
  }
}























