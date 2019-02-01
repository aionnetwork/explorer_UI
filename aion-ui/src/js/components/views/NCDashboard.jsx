/* eslint-disable */
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import { Button } from "@blueprintjs/core";

import NCRecentBlocks from 'components/dashboard/NCRecentBlocks';
import NCDashboardKPIs from 'components/dashboard/NCDashboardKPIs';
import NCTxnRealtime from 'components/transactions/NCTxnRealtime';
import NCComponentLazyLoad from 'components/common/NCComponentLazyLoad';

export default class NCDashboard extends Component
{
  componentDidMount()
  {
    
  }

 componentWillMount() {
    
  }

  render() {
    return (
      <NCComponentLazyLoad>
        <div className="NCDashboard">
          <NCDashboardKPIs/>
          <div className="NCDashboardPanel">
            <div className="NCRecentBlocksContainer">
              <div className="NCTitle section blue">
                <span className="title">Recent Blocks</span>
                <Button 
                  className=" pt-button pt-minimal"
                  
                  onClick={() => {hashHistory.push('/blocks');}}
                  text="View All"/>
              </div>
              <NCRecentBlocks/>
            </div>
            <div className="NCRecentTransactionsContainer">
              <div className="NCTitle section">
                <span className="title">Recent Transactions</span>
                <Button 
                  className=" pt-button pt-minimal"
                  
                  onClick={() => {hashHistory.push('/transactions');}}
                  text="View All"/> 
              </div>
              <NCTxnRealtime/>
            </div>
            
          </div>
        </div>
      </NCComponentLazyLoad>
    );
  }
}





























