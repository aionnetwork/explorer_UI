/* eslint-disable */
import React, { Component } from 'react';

import Recaptcha from 'react-recaptcha';
import NCNonIdealState from 'components/common/NCNonIdealState'

import moment from 'moment';
import { Button, Position, Classes, Popover, Menu, MenuItem, InputGroup, Intent, PopoverInteractionKind } from "@blueprintjs/core";


export default class TermsRetrieve extends Component
{ 
  download(){
    console.log('coool');
  }
  render() {  
    
    const style = { };
    const recapcontainer = {position:'relative',width:'310px',margin:'auto',top:'100px',padding:'5px' };
    const stylerecaptcha = {margin:'auto', };
    return (
      <div className= {''} style = {style}>

       <h1>Aion Dashboard Terms of Use</h1>
        
      </div>
    );
  }
}























