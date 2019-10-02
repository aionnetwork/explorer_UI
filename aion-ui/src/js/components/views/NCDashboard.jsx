/* eslint-disable */
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import {InputGroup, Button, Intent, Tabs2, Tab2 } from "@blueprintjs/core";
import { stopInterval, intervalID } from 'network/NCNetwork';

import NCRecentBlocks from 'components/dashboard/NCRecentBlocks';
import NCDashboardKPIs from 'components/dashboard/NCDashboardKPIs';
import NCTxnRealtime from 'components/transactions/NCTxnRealtime';
import NCComponentLazyLoad from 'components/common/NCComponentLazyLoad';

import * as MSG from 'lib/NCTerms';

import * as network from 'network/NCNetworkRequests';

export default class NCDashboard extends Component
{
  componentDidMount()
  {
    
  }

 componentWillMount() {
    //stopInterval(intervalID.health);
    network.getDashboardData();
    //network.getHealthData();
    //network.getKPIData();
 }

  componentWillUnmount() {
    stopInterval(intervalID.dashboard);
    //network.getHealthData();
  }

  render() {
    return (
      <NCComponentLazyLoad>
        <div className="NCDashboard">
          <NCDashboardKPIs/>
          <div className="NCDashboardPanel">
            <div className="NCRecentBlocksContainer">
              <div className="NCTitle section blue">
                <span className="title">{MSG.strings.landing_blocks_title}</span>
                <Button 
                  className=" pt-button pt-minimal"
                  
                  onClick={() => {hashHistory.push('/blocks');}}
                  text={MSG.strings.landing_view_link}/>
              </div>
              <NCRecentBlocks/>
            </div>
            <div className="NCRecentTransactionsContainer">
              <div className="NCTitle section">
                <span className="title">{MSG.strings.landing_transactions_title}</span>
                <Button 
                  className=" pt-button pt-minimal"
                  
                  onClick={() => {hashHistory.push('/transactions');}}
                  text={MSG.strings.landing_view_link}/> 
              </div>
              <NCTxnRealtime/>
            </div>
            
          </div>
        </div>
      </NCComponentLazyLoad>
    );
  }
}





























