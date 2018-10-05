/* eslint-disable */
import React, { Component } from 'react';

import Recaptcha from 'react-recaptcha';
import NCNonIdealState from 'components/common/NCNonIdealState'

import moment from 'moment';
import { Button, Position, Classes, Popover, Menu, MenuItem, InputGroup, Intent, PopoverInteractionKind } from "@blueprintjs/core";


export default class NCDwnRetrieve extends Component
{ 
  download(){
    console.log('coool');
  }
  render() {  
    
    const style = {position:'relative',textAlign:'center',width:'100%',margin:'auto',top:'100px',padding:'25px' };
    const recapcontainer = {position:'relative',width:'310px',margin:'auto',top:'100px',padding:'5px' };
    const stylerecaptcha = {margin:'auto', };
    return (
      <div className= {''} style = {style}>

        <p>To complete your download, please verify that you are not a robot by completing the captcha below then click download. </p>
       
       <div className= {''} style = {recapcontainer}>
        <Recaptcha
          style = {stylerecaptcha}
          sitekey="xxxxxxxxxxxxxxxxxxxx"
        />
        <Button  text = {'Download'} type = {"button"} onClick = {this.download} ></Button>
       </div>
        
      </div>
    );
  }
}























