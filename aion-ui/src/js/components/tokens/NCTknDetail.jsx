/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';

import { NCEntity } from 'lib/NCEnums';
import NCEntityLabel, { parseClientTransaction } from 'components/common/NCEntityLabel';
import NCEntityDetail from 'components/common/NCEntityDetail';

import { nc_isStrEmpty, nc_numFormatter, nc_numFormatterAmp, nc_numFormatterBytes, nc_numFormatterACSensitive, nc_isPositiveInteger, nc_hexPrefix } from 'lib/NCUtility';

import {BigNumber} from 'bignumber.js';
const EMPTY_STR = "Not Available";

export default class NCTxnDetail extends Component
{
  constructor(props) {
    super(props);
  }

  parseTxnLog = (txnLog) => {
    if (txnLog == null) return false;
    try {
      let parsed = JSON.parse(txnLog);

      if (!parsed || parsed.length == 0)
        return false;

      return(JSON.stringify(parsed, undefined, 2))
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  parseInputData = (data) => {
    let result = "";
    try {
      // get the function header
      if (data.length > 0) {
        result += data.substring(0, 8) + '\n';
        data = data.substring(8);
      }

      while (data.length > 0) {
        result += data.substring(0, 32) + '\n';
        data = data.substring(32);
      }
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  render() {
    let { entity } = this.props;

    //console.log(JSON.stringify(this.props));
    let parsedInputData = this.parseInputData(entity);
    const symbol = " (" + entity.symbol + ")";
    let desc = 
    [
      {
        field: "Created",
        value: moment.unix(entity.creationTimestamp/1000000).format('LLLL'),
      },
      {
        field: "Contract",
        value: <NCEntityLabel
                  entityType={NCEntity.TKN}
                  entityId={entity.contractAddr}
                  linkActive={true}/>,
      },
      {
        field: "Creator Addr",
        value: <NCEntityLabel
                  entityType={NCEntity.ACCOUNT}
                  entityId={entity.creatorAddress}
                  linkActive={true}/>,
      },
      {
        field: "Transaction",
        value: <NCEntityLabel
                  entityType={NCEntity.TXN}
                  entityId={entity.transactionHash}
                  linkActive={true}/>,
      },
      {
        field: "Symbol",
        value: entity.symbol,
      },
      // ---------------------------------------------------------------
      {
        field: "Decimal",
        value: entity.granularity,
      },
      /*{
        field: "Special Addr",
        value: <NCEntityLabel
                  entityType={NCEntity.ACCOUNT}
                  entityId={entity.specialAddress}
                  linkActive={true}/>,
      },*/
      {
        field: "TotalSupply",
        value: entity.totalSupply,
      },
      {
        field: "Liquid Supply",
        value: entity.liquidSupply,
      },
     
      
    ];

    return (
      <NCEntityDetail desc={desc}/>
    );
  }
}
























