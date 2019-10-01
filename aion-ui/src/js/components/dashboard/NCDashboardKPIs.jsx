/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Tooltip, Position } from "@blueprintjs/core";
import NCLink from 'components/common/NCLink';

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
        title: <span><strong>PoW &nbsp;</strong>| &nbsp;{MSG.strings.kpi_tab1_subtitle}</span>,
        kpiList: [
          {
            value:"--",
            units:"s",
            title:["Average", MSG.strings.kpi_block_l2],
            hoverContent: MSG.strings.kpi_block_desc,
          },
          {
            value:"--",
            units:"Sol/s",
            title:[MSG.strings.kpi_hash_l1, MSG.strings.kpi_hash_l2],
            hoverContent: <span>{MSG.strings.kpi_hash_desc}</span>,
          },
          {
            value:"--",
            units:"",
            title:[MSG.strings.kpi_difficulty_l1, MSG.strings.kpi_difficulty_l2],
            hoverContent: MSG.strings.kpi_difficulty_desc,
          },
          {
            value:"--",
            units:"",
            title:[MSG.strings.kpi_NRG_l1, MSG.strings.kpi_NRG_l2],
            hoverContent: MSG.strings.kpi_NRG_desc,
          },
          
        ]
      },

      {
              title: <span><strong>PoS &nbsp;</strong> </span>,
              kpiList: [
                {
                  value:"--",
                  units:"",
                  title:["Average", "Block Time"],
                  onClick: this.link,
                  hoverContent: "Mean of PoS block arrival time over the last hour. The target block time for PoS blocks is 20 seconds. PoS difficulty is dynamically adjusted to achieve target.",
                },
                {
                  value:"--",
                  units:"",
                  title:["Average", "Issuance"],
                  hoverContent: "Mean of block rewards for PoS blocks for the previous 1024 blocks",
                },
                {
                  value:"--",
                  units:"",
                  title:["% of Network", "staked"],
                  hoverContent: "[Total Staked Aion/ Circulating Supply]*100",
                },
                {
                  value:"--",
                  units:"",
                  title:["Average", " Difficulty"],
                  hoverContent: "Difficulty, averaged over the last hour",
                  tooltipPosition: Position.BOTTOM_RIGHT,
                },
              ]
      },
      
      {
        title: <span><strong>{MSG.strings.kpi_tab2_title}</strong></span>,
        kpiList: [
          
          {
            value:"--",
            units:"",
            title:[MSG.strings.kpi_TXNPEAK_l1, MSG.strings.kpi_TXNPEAK_l2],
            hoverContent: MSG.strings.kpi_TXNPEAK_desc,
          },
          {
            value:"--",
            units:"",
            title:[MSG.strings.kpi_TXNTIME_l1, MSG.strings.kpi_TXNTIME_l2],
            hoverContent: MSG.strings.kpi_TXNTIME_desc,
          },
          {
            value:"--",
            units:"",
            title:[MSG.strings.kpi_TXNCOUNT_l1, MSG.strings.kpi_TXNCOUNT_l2],
            hoverContent: MSG.strings.kpi_TXNCOUNT_desc,
            tooltipPosition: Position.BOTTOM_RIGHT,
          },
        ]
      },
      
    ];
  }

  link  = () => {
      location.href="https://docs.aion.network";
  }


  render() {
    
    let momentUpdated = this.props.kpi.momentUpdated;

    if (NCNETWORK_REQUESTS_ENABLED && momentUpdated == null) {
      return (
        <NCLoading title={"Loading KPIs"} marginTop={70} marginBottom={70}/>
      );
    }

    const kpiList = this.props.kpi.data;

    this.kpiData[0].kpiList[0].value = nc_decimalPoint(kpiList.powBlockTime, 2);
    this.kpiData[0].kpiList[1].value = nc_numFormatter_with1Floor(kpiList.averagedHashPower, 1);
    this.kpiData[0].kpiList[2].value = nc_numFormatter_with1Floor(kpiList.powBlockDifficulty, 1);
    this.kpiData[0].kpiList[3].value = nc_numFormatter(kpiList.averageNrgConsumed, 2);
    ///add unity stuff here
    this.kpiData[1].kpiList[0].value = kpiList.posBlockTime!==-999 ? nc_decimalPoint(kpiList.posBlockTime, 2) : '--';
    this.kpiData[1].kpiList[1].value = nc_numFormatter_with1Floor(kpiList.averagePosIssuance, 1);
    this.kpiData[1].kpiList[2].value = nc_numFormatter_with1Floor(kpiList.percentageOfNetworkStaking, 1);
    this.kpiData[1].kpiList[3].value = kpiList.posBlockDifficulty!==-999 ? nc_numFormatter(kpiList.posBlockDifficulty, 2) : '--';

    this.kpiData[2].kpiList[0].value = nc_numFormatter_with1Floor(kpiList.transactionsPerSecond, 2);
    this.kpiData[2].kpiList[1].value = kpiList.peakTransactionsPerBlock != null ?
                                          nc_numFormatter(kpiList.peakTransactionsPerBlock, 0) :
                                          null;
    this.kpiData[2].kpiList[2].value = kpiList.totalTransaction != null ?
                                          nc_numFormatter(kpiList.totalTransaction, 3) :
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

































