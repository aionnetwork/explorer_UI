/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Tooltip, Position } from "@blueprintjs/core";

import { NCKPIResponsive, NCKPIGroup} from 'components/common/NCKPIGroup';
import NCLoading from 'components/common/NCLoading';

import { NCNETWORK_REQUESTS_ENABLED } from 'network/NCNetwork';
import * as MSG from 'lib/NCTerms';

import {BigNumber} from 'bignumber.js';
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
      
      {
        title: <span><strong>{MSG.strings.kpi_tab1_title} &nbsp;</strong>| &nbsp;{MSG.strings.kpi_tab1_subtitle}</span>,
        kpiList: [
          {
            value:"9.83",
            units:"s",
            title:[MSG.strings.kpi_block_l1, MSG.strings.kpi_block_l2],
            hoverContent: MSG.strings.kpi_block_desc,
          },
          {
            value:"10",
            units:"Sol/s",
            title:[MSG.strings.kpi_hash_l1, MSG.strings.kpi_hash_l2],
            hoverContent: <span>{MSG.strings.kpi_hash_desc}</span>,
          },
          {
            value:"15",
            units:"",
            title:[MSG.strings.kpi_difficulty_l1, MSG.strings.kpi_difficulty_l2],
            hoverContent: MSG.strings.kpi_difficulty_desc,
          },
          {
            value:"1000",
            units:"",
            title:[MSG.strings.kpi_NRG_l1, MSG.strings.kpi_NRG_l2],
            hoverContent: MSG.strings.kpi_NRG_desc,
          },
          
        ]
      },
      
      {
        title: <span><strong>{MSG.strings.kpi_tab2_title}</strong></span>,
        kpiList: [
          
          {
            value:"45",
            units:"",
            title:[MSG.strings.kpi_TXNPEAK_l1, MSG.strings.kpi_TXNPEAK_l2],
            hoverContent: MSG.strings.kpi_TXNPEAK_desc,
          },
          {
            value:"85",
            units:"",
            title:[MSG.strings.kpi_TXNTIME_l1, MSG.strings.kpi_TXNTIME_l2],
            hoverContent: MSG.strings.kpi_TXNTIME_desc,
          },
          {
            value:"3991",
            units:"",
            title:[MSG.strings.kpi_TXNCOUNT_l1, MSG.strings.kpi_TXNCOUNT_l2],
            hoverContent: MSG.strings.kpi_TXNCOUNT_desc,
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

    let kpi = {}

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

































