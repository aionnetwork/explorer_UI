/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Tooltip, Position } from "@blueprintjs/core";

import NCKPIGroup from 'components/common/NCKPIGroup';
import NCLoading from 'components/common/NCLoading';

import { NCNETWORK_REQUESTS_ENABLED } from 'network/NCNetwork';

import {BigNumber} from 'bignumber.js'
import { nc_decimalPoint, nc_numFormatter, nc_numFormatter_with1Floor, nc_numFormatterACSensitive, nc_isNumber } from "lib/NCUtility";

import { hashHistory } from 'react-router';
import moment from 'moment';

const KPI_BLK_RANGE = 128;

class NCDashboardKPIs extends Component
{
  constructor(props) {

    super(props);

    this.kpiData = 
    [
      /*{
        title: <span><strong></strong></span>,
        kpiList: [/*
          {
            value:"$95665.83",
            units:"",
            title:["", "USD/AION"],
            hoverContent: "Mean of inter-block arrival time over last "+KPI_BLK_RANGE+" blocks",
          },
          {
            value:"90083",
            units:"",
            title:["Deployed", "Contracts"],
            hoverContent: "Mean of inter-block arrival time over last "+KPI_BLK_RANGE+" blocks",
          },
          {
            value:"9983",
            units:"ATS",
            title:["Token", "Contracts"],
            hoverContent: "Mean of inter-block arrival time over last "+KPI_BLK_RANGE+" blocks",
          },
        ]
      },
      {
        title: <span><strong>Block Time</strong></span>,
        kpiList: [
          /*{
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
            hoverContent: "Mean of inter-block arrival time over last "+KPI_BLK_RANGE+" blocks",
          },
        ]
      },*/
      {
        title: <span><strong>Network&nbsp;</strong>| &nbsp;EQUI2109</span>,
        kpiList: [
          {
            value:"9.83",
            units:"s",
            title:["Current", "Block Time"],
            hoverContent: "Mean of inter-block arrival time over the last 24 hours. The target block time for the network is 10s. PoW difficulty is dynamically adjusted to acheive target. ",
          },
          {
            value:"10",
            units:"Sol/s",
            title:["Network", "Hash Rate"],
            hoverContent: <span>{"Network hash rate = (last block's difficulty) /"}<br/>{"(average block time over the last 24 hours.)"}</span>,
          },
          {
            value:"15",
            units:"",
            title:["Average", "Difficulty"],
            hoverContent: "Difficulty, averaged over the last 24 hours.",
          },
          {
            value:"1000",
            units:"",
            title:["Consumed", "NRG / Block"],
            hoverContent: "Average NRG consumed per block for the last 24 hours.",
          },
          /*{
            value:"0.85",
            units:"",
            title:["Block", "Reward"],
            hoverContent: "Current block reward value, denominated in Aion coin (AION)",
          },*/
        ]
      },
      /*{
        title: <span><strong>NRG</strong></span>,
        kpiList: [
          {
            value:"1000",
            units:"",
            title:["Consumed", "NRG / Block"],
            hoverContent: "Average NRG consumed per block for latest "+KPI_BLK_RANGE+" blocks",
          },
          {
            value:"15",
            units:"",
            title:["Limit", "NRG / Block"],
            hoverContent: "Average NRG limit per block for latest "+KPI_BLK_RANGE+" blocks",
          },
        ]
      },*/
      {
        title: <span><strong>Transaction </strong></span>,
        kpiList: [
          
          {
            value:"45",
            units:"",
            title:["Txn", "/ Second"],
            hoverContent: "Transactions per second, averaged over the last 24 hours",
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

    //this.kpiData[0].kpiList[0].value = kpiList.targetBlockTime;
    //this.kpiData[0].kpiList[1].value = nc_decimalPoint(kpiList.averageBlockTime, 2);

    this.kpiData[0].kpiList[0].value = nc_decimalPoint(kpiList.averageBlockTime, 2);
    this.kpiData[0].kpiList[1].value = nc_numFormatter_with1Floor(kpiList.hashRate, 1);
    this.kpiData[0].kpiList[2].value = nc_numFormatter_with1Floor(kpiList.averageDifficulty, 1);
    this.kpiData[0].kpiList[3].value = nc_numFormatter(kpiList.averageNrgConsumedPerBlock, 2);
    //this.kpiData[0].kpiList[4].value = nc_numFormatter(kpiList.averageNrgLimitPerBlock, 2);

    /*this.kpiData[1].kpiList[2].value = kpiList.lastBlockReward == null ? null :  
                                          (BigNumber(String(kpiList.lastBlockReward)).lt(2) ? 
                                          nc_decimalPoint(kpiList.lastBlockReward, 2) :
                                          nc_numFormatterACSensitive(kpiList.lastBlockReward, 2));*/

    //this.kpiData[3].kpiList[0].value = nc_numFormatter(kpiList.averageNrgConsumedPerBlock, 2);
    //this.kpiData[2].kpiList[1].value = nc_numFormatter(kpiList.averageNrgLimitPerBlock, 2);

    //this.kpiData[1].kpiList[0].value = nc_numFormatter(kpiList.averageNrgConsumedPerBlock, 2);
    this.kpiData[1].kpiList[0].value = nc_numFormatter_with1Floor(kpiList.transactionPerSecond, 2);
    this.kpiData[1].kpiList[1].value = kpiList.peakTransactionsPerBlockInLast24hours != null ? 
                                          nc_numFormatter(kpiList.peakTransactionsPerBlockInLast24hours, 0) : 
                                          null;
    this.kpiData[1].kpiList[2].value = kpiList.totalTransactionsInLast24hours != null ? 
                                          nc_numFormatter(kpiList.totalTransactionsInLast24hours, 3) : 
                                          null;

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

































