/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Position } from "@blueprintjs/core";

import { NCKPIResponsive, NCKPIGroup} from 'components/common/NCKPIGroup';
import NCLoading from 'components/common/NCLoading';

import { NCNETWORK_REQUESTS_ENABLED } from 'network/NCNetwork';

import {BigNumber} from 'bignumber.js'
import { nc_decimalPoint, nc_numFormatter, nc_numFormatter_with1Floor } from "lib/NCUtility";

//import { hashHistory } from 'react-router';
import moment from 'moment';

const KPI_BLK_RANGE = 128;

class NCDashboardKPIs extends Component
{
  constructor(props) {

    super(props);

    this.kpiData = 
    [
      
      {
        title: <span><strong>Network&nbsp;</strong>| &nbsp;EQUI2109</span>,
        kpiList: [
          {
            value:"9.83",
            units:"s",
            title:["Current", "Block Time"],
            hoverContent: "Mean of inter-block arrival time over the last hour. The target block time for the network is 10s. PoW difficulty is dynamically adjusted to acheive target. ",
          },
          {
            value:"10",
            units:"Sol/s",
            title:["Network", "Hash Rate"],
            hoverContent: <span>{"Network hash rate = (last block's difficulty) /"}<br/>{"(average block time over the last hour.)"}</span>,
          },
          {
            value:"15",
            units:"",
            title:["Average", "Difficulty"],
            hoverContent: "Difficulty, averaged over the last hour.",
          },
          {
            value:"1000",
            units:"",
            title:["Consumed", "NRG / Block"],
            hoverContent: "Average NRG consumed per block for the last hour.",
          },
          
        ]
      },
      
      {
        title: <span><strong>Transaction </strong></span>,
        kpiList: [
          
          {
            value:"45",
            units:"",
            title:["Txn", "/ Second"],
            hoverContent: "Transactions per second, averaged over the last hour",
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

    this.kpiData[0].kpiList[0].value = nc_decimalPoint(kpiList.averageBlockTime, 2);
    this.kpiData[0].kpiList[1].value = nc_numFormatter_with1Floor(kpiList.hashRate, 1);
    this.kpiData[0].kpiList[2].value = nc_numFormatter_with1Floor(kpiList.averageDifficulty, 1);
    this.kpiData[0].kpiList[3].value = nc_numFormatter(kpiList.averageNrgConsumedPerBlock, 2);
    this.kpiData[1].kpiList[0].value = nc_numFormatter_with1Floor(kpiList.transactionPerSecond, 2);
    this.kpiData[1].kpiList[1].value = kpiList.peakTransactionsPerBlockInLast24hours != null ? 
                                          nc_numFormatter(kpiList.peakTransactionsPerBlockInLast24hours, 0) : 
                                          null;
    this.kpiData[1].kpiList[2].value = kpiList.totalTransactionsInLast24hours != null ? 
                                          nc_numFormatter(kpiList.totalTransactionsInLast24hours, 3) : 
                                          null;

    let ncKPIs = [];
    let ncKPIr = [];

    //let kpi = {}

    this.kpiData.forEach((kpiGroup, i) => 
    {
      ncKPIs.push(<NCKPIGroup 
                    key={i} 
                    kpiGroup={kpiGroup}/>);
      ncKPIs.push(<span key={this.kpiData.length + i} className="NCKPIGroupDivider"/>);

      ncKPIr.push(<NCKPIResponsive 
                    key={i} 
                    kpiGroup={kpiGroup}/>);
      
    });
    
    return (
      <div>
      <div className="NCKPIContainer">
      { ncKPIs }
      </div>
      <div className="show" >
      { ncKPIr }
      </div>
      </div>
    );
  }
}

export default connect((state) => {
  return ({
    kpi: state.kpi,
  })
})(NCDashboardKPIs);

































