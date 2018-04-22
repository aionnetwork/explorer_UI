/* eslint-disable */
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router'
import { connect } from 'react-redux';

import {BigNumber} from 'bignumber.js'
import moment from "moment";
import { Menu, MenuItem, Position, Classes, InputGroup, Popover, Button, PopoverInteractionKind, Spinner, Tooltip, MenuDivider } from "@blueprintjs/core";

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
        {/*<MenuItem
          className="nav-option"
          iconName={NCEntityInfo[NCEntity.ACCOUNT].icon}
          onClick={() => {
            hashHistory.push('/accounts');
          }}
          text="Accounts"
        />*/}
      </Menu>
    );
  }

  renderConnectionMenu = () => {
    return (
      <Menu className="NCNavMenu">
        <MenuDivider title="Switch Network" />
        <MenuItem
          className="nav-option"
          onClick={() => window.open("https://testnet2.aion.network")}
          text="Testnet-1"/>
        <MenuItem
          className="nav-option"
          onClick={() => window.open("https://testnet1.aion.network")}
          text="Testnet-1"/>
      </Menu>
    );
  }

  render() 
  {
    const pathname = this.props.location.pathname;

    let kpi = this.props.kpi;
    
    // wait on the response from KPI list to load application
    if (NCNETWORK_REQUESTS_ENABLED && kpi.momentUpdated == null) { 
      return (
        <NCLoading
          title={"Connecting to Server"}
          marginTop={140}/>
      );
    }

    let momentEnd = kpi.data.endTimestamp ? moment.unix(BigNumber(kpi.data.endTimestamp).toNumber(10)) : null;
    /*let latestBlockNumber = kpi.data.endBlock ? BigNumber(kpi.data.endBlock).toNumber(10) : null; 
    let dbLag = (kpi.data.currentBlockchainHead && kpi.data.endBlock) ? 
                BigNumber(kpi.data.currentBlockchainHead).minus(BigNumber(kpi.data.endBlock)) : 0;*/
    let latestBlockNumber = kpi.data.dbBlockTableHead ? BigNumber(kpi.data.dbBlockTableHead).toNumber(10) : null; 
    let dbLag = (kpi.data.currentBlockchainHead && kpi.data.dbBlockTableHead) ? 
                BigNumber(kpi.data.currentBlockchainHead).minus(BigNumber(kpi.data.dbBlockTableHead)) : 0;
    let lastUpdated = kpi.momentUpdated;

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
              {/*<Button 
                  className="navbar-btn-active pt-button pt-minimal"
                  iconName="timeline-bar-chart"
                  onClick={() => window.open("https://metrics0.aion.network", "Aion | Metrics")}
                  text="Metrics"/>*/}   
            </div>

            <div className="pt-navbar-group navbar-group-right">
              <NCTopLevelSearch/>
              <span className="pt-navbar-divider"></span>
              <NCLivenessIndicator 
                momentEnd={momentEnd}
                latestBlockNumber={latestBlockNumber}
                dbLag={dbLag}
                lastUpdated={lastUpdated}
              />
              <Popover
                content={this.renderConnectionMenu()}
                interactionKind={PopoverInteractionKind.CLICK}
                position={Position.BOTTOM_RIGHT}>
                <Button 
                  className="navbar-btn-active pt-button pt-minimal"
                  rightIconName="pt-icon-caret-down"
                  text="Mainnet"/>          
              </Popover>

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
    kpi: state.kpi,
  })
})(NCLayout);
































