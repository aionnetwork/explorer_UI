/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Tooltip, Position } from "@blueprintjs/core";

import NCKPIGroup from 'components/common/NCKPIGroup';
import NCLoading from 'components/common/NCLoading';

import { NCNETWORK_REQUESTS_ENABLED } from 'network/NCNetwork';

import {BigNumber} from 'bignumber.js'
import { nc_decimalPoint, nc_numFormatter, nc_numFormatter_with0Floor } from "lib/NCUtility";

import { hashHistory } from 'react-router';
import moment from 'moment';


class NCDashboardKPIs extends Component
{
  constructor(props) {

    super(props);

    this.kpiData = 
    [
      {
        title: <span><strong>Block Time</strong></span>,
        kpiList: [
          {
            value:"10",
            units:"s",
            title:["Target", "Block Time"],
            hoverContent: <span>Block time target for the network; <br/>PoW diffulty dynamically adjusted to acheive target</span>,
            tooltipPosition: Position.BOTTOM_LEFT
          },
          {
            value:"9.83",
            units:"s",
            title:["Current", "Block Time"],
            hoverContent: <span>Mean of the inter-block arrival time, averaged over last 64 blocks</span>,
          },
        ]
      },
      {
        title: <span><strong>Mining &nbsp;</strong>| &nbsp;EQUI2109</span>,
        kpiList: [
          {
            value:"10",
            units:"Sol/s",
            title:["Network", "Hash Rate"],
            hoverContent: <span>Network hash rate = (last block's difficulty) /<br/>(average block time over last 64 blocks)</span>,
          },
          {
            value:"15",
            units:"",
            title:["Average", "Difficulty"],
            hoverContent: "Difficulty, averaged over the last 64 blocks",
          },
          {
            value:"0.85",
            units:"",
            title:["Block", "Reward"],
            hoverContent: "Current block reward value, denominated in Aion network coin (AC)",
          },
        ]
      },
      {
        title: <span><strong>NRG</strong></span>,
        kpiList: [
          {
            value:"1000",
            units:"",
            title:["NRG / Tx", "Consumed"],
            hoverContent: "Average NRG per transaction for latest 64 blocks",
          },
          {
            value:"15",
            units:"",
            title:["NRG", "Price"],
            hoverContent: <span>Average NRG price per transaction for latest 128 blocks,<br/>denominated in base Aion network coin units</span>,
          },
        ]
      },
      {
        title: <span><strong>Transactions</strong></span>,
        kpiList: [
          {
            value:"45",
            units:"",
            title:["Txn", "/ Second"],
            hoverContent: "Transactions per second, averaged over last 64 blocks",
          },
          {
            value:"85",
            units:"",
            title:["24 Hr Peak", "Txn / Block"],
            hoverContent: "Peak number of transactions / block observed in last 24 hours",
          },
          {
            value:"3991",
            units:"",
            title:["24 Hr", "Txn Count"],
            hoverContent: "Number of transactions observed in last 24 hours",
            tooltipPosition: Position.BOTTOM_RIGHT,
          },
        ]
      },
      
    ];
  }

  render() {
    
    let momentUpdated = this.props.kpi.momentUpdated;

    if (NCNETWORK_REQUESTS_ENABLED && momentUpdated == null) {
      return (
        <NCLoading title={"Loading KPIs"} marginTop={70} marginBottom={70}/>
      );
    }

    const kpiList = this.props.kpi.data;

    this.kpiData[0].kpiList[0].value = kpiList.targetBlockTime;
    this.kpiData[0].kpiList[1].value = nc_decimalPoint(kpiList.averageBlockTime, 2);

    this.kpiData[1].kpiList[0].value = nc_numFormatter(kpiList.hashRate, 1);
    this.kpiData[1].kpiList[1].value = nc_numFormatter(kpiList.averageDifficulty, 1);
    this.kpiData[1].kpiList[2].value = nc_decimalPoint(kpiList.lastBlockReward, 2);

    this.kpiData[2].kpiList[0].value = nc_numFormatter(kpiList.averageEnergyConsumed, 2);
    this.kpiData[2].kpiList[1].value = nc_numFormatter(kpiList.averageEnergyPrice, 2);

    this.kpiData[3].kpiList[0].value = nc_numFormatter_with0Floor(kpiList.transactionPerSecond, 2);
    this.kpiData[3].kpiList[1].value = nc_numFormatter(kpiList.peakTransactionsPerBlockInLast24hours, 0);
    this.kpiData[3].kpiList[2].value = nc_numFormatter(kpiList.totalTransactionsInLast24hours, 3);

    let ncKPIs = []

    this.kpiData.forEach((kpiGroup, i) => 
    {
      ncKPIs.push(<NCKPIGroup 
                    key={i} 
                    kpiGroup={kpiGroup}/>);
      ncKPIs.push(<span key={this.kpiData.length + i} className="NCKPIGroupDivider"/>);
    });
    
    return (
      <div className="NCKPIContainer">
      { ncKPIs }
      </div>
    );
  }
}

export default connect((state) => {
  return ({
    kpi: state.kpi,
  })
})(NCDashboardKPIs);

































