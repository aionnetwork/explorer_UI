/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Tabs2, Tab2 } from "@blueprintjs/core";

import NCRecentBlocks from 'components/dashboard/NCRecentBlocks';
import NCDashboardKPIs from 'components/dashboard/NCDashboardKPIs';
import NCTxnRealtime from 'components/transactions/NCTxnRealtime';
import NCComponentLazyLoad from 'components/common/NCComponentLazyLoad';

export default class NCDashboard extends Component
{
  componentDidMount()
  {
    // subscribe for block and transaction streams
  }

  componentWillUnmount() 
  {
    // unsubscribe for block and transaction streams
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
              </div>
              <NCRecentBlocks/>
            </div>
            <div className="NCRecentTransactionsContainer">
              <div className="NCTitle section">
                <span className="title">Recent Transactions</span>
              </div>
              <NCTxnRealtime/>
            </div>
            
          </div>
        </div>
      </NCComponentLazyLoad>
    );
  }
}





























