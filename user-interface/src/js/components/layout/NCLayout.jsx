/* eslint-disable */
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router'
import { connect } from 'react-redux';

import moment from "moment";
import { Menu, MenuItem, Position, Classes, InputGroup, Popover, Button, PopoverInteractionKind, Spinner, Tooltip } from "@blueprintjs/core";

import { ncNetwork_pollForKpiList, ncNetwork_pollForStaticInfo } from 'network/NCNetwork';

import NCLivenessIndicator from 'components/layout/NCLivenessIndicator';
import NCTopLevelSearch from 'components/layout/NCTopLevelSearch';
import NCLoading from 'components/common/NCLoading';

import { NCNETWORK_REQUESTS_ENABLED } from 'network/NCNetwork';

import { NCEntity, NCEntityInfo } from 'lib/NCEnums';
import { disconnectSocket } from 'network/NCNetwork';
import * as network from 'network/NCNetworkRequests';

class NCLayout extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    network.getDashboardData();
  }

  componentWillUnmount() {
    disconnectSocket();
  };

  renderExplorerMenu = () => {
    return (
      <Menu className="NCNavMenu">
        <MenuItem
          className="nav-option"
          iconName={NCEntityInfo[NCEntity.BLOCK].icon}
          onClick={() => {
            hashHistory.push('/blocks');
          }}
          text="Blocks"
        />
        <MenuItem
          className="nav-option"
          iconName={NCEntityInfo[NCEntity.TXN].icon}
          onClick={() => {
            hashHistory.push('/transactions');
          }}
          text="Transactions"
        />
        <MenuItem
          className="nav-option"
          iconName={NCEntityInfo[NCEntity.ACCOUNT].icon}
          onClick={() => {
            hashHistory.push('/accounts');
          }}
          text="Accounts"
        />
      </Menu>
    );
  }

  render() 
  {
    const pathname = this.props.location.pathname;
    
    // wait on the response from KPI list to load application
    if (NCNETWORK_REQUESTS_ENABLED && this.props.blkRt.momentUpdated == null) { 
      return (
        <NCLoading
          title={"Connecting to Server"}
          marginTop={140}/>
      );
    }

    let latestBlock = null;
    if (this.props.blkRt.data && 
      Array.isArray(this.props.blkRt.data) && 
      this.props.blkRt.data[0] ) {
      latestBlock = this.props.blkRt.data[0];
    }

    return (
      <div className="NCPage">
        <div className="NCHeader pt-navbar">
          <div className="row">
            
            <div className="pt-navbar-group navbar-group-left">
              <Link to={"/dashboard"} className="logo">
                <img className="logo-img" src="img/logo/aion-icon.svg" alt="logo"/>
                <span className="title">Dashboard</span>
              </Link>
              <span className="pt-navbar-divider"></span>              
              <Popover
                content={this.renderExplorerMenu()}
                interactionKind={PopoverInteractionKind.CLICK}
                position={Position.BOTTOM}>
                <Button 
                  className="navbar-btn-active pt-button pt-minimal"
                  iconName="pt-icon-dashboard"
                  rightIconName="pt-icon-caret-down"
                  text="Explorer"/>          
              </Popover>
            </div>

            <div className="pt-navbar-group navbar-group-right">
              <NCTopLevelSearch/>
              <span className="pt-navbar-divider"></span>
              <NCLivenessIndicator 
                momentEnd={latestBlock ? moment.unix(latestBlock.timestampVal) : null}
                latestBlockNumber={latestBlock ? latestBlock.blockNumber : null }
                dbLag={0}
                lastUpdated={this.props.blkRt.momentUpdated}
              />
            </div>

          </div>
        </div>
        
        <div className="NCPageContent">
          <div className="container">
          { this.props.children }
          </div>
        </div>
        <div className="NCFooter">
          <div>
            <span className="text">Powered By</span>
            <img className="logo" src="img/logo/aion-logo.svg" alt="logo"/>
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state) => {
  return ({
    blkRt: state.blkRt,
  })
})(NCLayout);
































