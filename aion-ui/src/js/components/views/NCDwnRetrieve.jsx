/* eslint-disable */
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';

import Recaptcha from 'react-recaptcha';

import { Position, Intent, Popover, Tab2, Tabs2, Tooltip, Button, Menu, MenuItem, PopoverInteractionKind } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";

import NCBlkTable from 'components/blocks/NCBlkTable';
import NCTxnTableOwn from 'components/transactions/NCTxnTableOwn';

import NCAccDetail from 'components/accounts/NCAccDetail';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
import NCExplorerSection from 'components/common/NCExplorerSection';
import NCNonIdealState from 'components/common/NCNonIdealState';

import { NCEntity, NCEntityInfo } from 'lib/NCEnums';

import * as StoreAccRetrieve from 'stores/StoreAccRetrieve';

import { nc_hexPrefix, nc_isListValid, nc_isListEmpty, nc_isPositiveInteger, nc_isObjectValid, nc_isStrEmpty, nc_isObjectEmpty,nc_LinkToEntityWithParam, nc_trim } from 'lib/NCUtility';
//import { nc_FindEntity, nc_CanLinkToEntity, nc_LinkToEntity, nc_isObjectEmpty, nc_isStrEmpty, nc_trim } from 'lib/NCUtility';

import * as network from 'network/NCNetworkRequests';

class NCDwnRetrieve extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      queryStr: '',
      entity: NCEntity.ACCOUNT,
      recaptcha:'',
      button: true
    } 
    this.captcha = this.captcha.bind(this);
  }

  componentWillMount() {
    this.isFirstRenderAfterMount = true;
  }

  componentDidMount() {
    this.requestDownload();
  }

  componentWillReceiveProps(nextProps) {
    this.isFirstRenderAfterMount = false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.params.accId != this.props.params.accId)
      this.requestDownload();
  }

  requestDownload = () => {
       //this.download('uyuy');
       //network.getAccRetrieveCSV(this.props.params.accId, 'nothing');
      
  }

  captcha(key){
      this.setState({recaptcha:response})
  }

  download(a){
       console.log(a);
       this.setState({button:true});
       network.getAccRetrieveCSV(this.props.params.accId, a);
       //return;
  }

  verifyCallback(response) {
       //this.state.recaptcha = response;
        this.setState({recaptcha:response,button:false});
   };

 
  render() {
    
    
    const style = {position:'relative',textAlign:'center',width:'100%',margin:'auto',top:'100px',padding:'25px' };
    const recapcontainer = {position:'relative',width:'310px',margin:'auto',top:'100px',padding:'5px' };
    const stylerecaptcha = {margin:'auto', };

    // create a variable to store the component instance
    let recaptchaInstance;
 
    // create a reset function
    const resetRecaptcha = () => {
      recaptchaInstance.reset();  
    };

    let button = this.state.button;
    let recaptcha= this.state.recaptcha;

    return (
      <div className= {''} style = {style}>

        <p>To complete your download, please verify that you are not a robot by completing the captcha below then click download. </p>
       
       <div className= {''} style = {recapcontainer}>
        <Recaptcha
          ref={e => recaptchaInstance = e}
          style = {stylerecaptcha}
          sitekey="6LfwrXMUAAAAAEpZCdMFD0ba96ryOUDGPMyqHZPA"
          verifyCallback={this.verifyCallback.bind(this)}
        />
        <br/>
        <Button  text='Download' disabled={button} onClick={() => {resetRecaptcha(); this.download(recaptcha)}} className = "pt-button pt-minimal" rightIconName="download" />
        
       </div>
        
      </div>
    );
  }
}

export default connect((state) => {
  return ({
    accRetrieve: state.accRetrieve,
  })
})(NCDwnRetrieve);

