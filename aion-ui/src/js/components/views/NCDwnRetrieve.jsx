/* eslint-disable */
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';

import Recaptcha from 'react-recaptcha';

import { Position, Popover, Tab2, Tabs2, Tooltip, Button, Menu, MenuItem, PopoverInteractionKind } from "@blueprintjs/core";
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
      entity: NCEntity.ACCOUNT
    } 
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
       network.getAccRetrieveCSV(this.props.params.accId);
  }

  requestDownloadb = (type, data) => {
    network.RetrieveDownload(type, data);
  }

  render() {
    
    const verifyCallback = function (response) {
       console.log(response);
    };
    const style = {position:'relative',textAlign:'center',width:'100%',margin:'auto',top:'100px',padding:'25px' };
    const recapcontainer = {position:'relative',width:'310px',margin:'auto',top:'100px',padding:'5px' };
    const stylerecaptcha = {margin:'auto', };

    return (
      <div className= {''} style = {style}>

        <p>To complete your download, please verify that you are not a robot by completing the captcha below then click download. </p>
       
       <div className= {''} style = {recapcontainer}>
        <Recaptcha
          style = {stylerecaptcha}
          sitekey="6LfwrXMUAAAAAEpZCdMFD0ba96ryOUDGPMyqHZPA"
          verifyCallback={verifyCallback}
        />
        <Button  text = {'Download'} type = {"button"} onClick = {this.download} ></Button>
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

