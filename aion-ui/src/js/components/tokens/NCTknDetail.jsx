/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';

import { NCEntity } from 'lib/NCEnums';
import NCEntityLabel from 'components/common/NCEntityLabel';
import { Tooltip, Position } from "@blueprintjs/core";
import * as MSG from 'lib/NCTerms';

import NCEntityDetail from 'components/common/NCEntityDetail';

const EMPTY_STR = "Not Available";

export default class NCTknDetail extends Component
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
    let gran = MSG.Token.GRANULARITY;

    
    //let parsedInputData = this.parseInputData(entity);
    //const symbol = " (" + entity.symbol + ")";
    let desc = 
    [
      {
        field: "Created",
        value: moment.unix(entity.creationTimestamp).format('LLLL'),
      },
      {
        field: "Contract",
        value: <NCEntityLabel
                  entityType={NCEntity.CNTR}
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
        field: <div>
                Granularity {" "}
                <Tooltip
                  
                  content={gran} >
                  <span className="fa fa-info-circle fa-lg icon"></span>
                </Tooltip>
               
               </div>,
        value: entity.granularity,
      },
      
      {
        field: "TotalSupply",
        value: entity.totalSupply.toString(),
      },
      {
        field: "Liquid Supply",
        value: entity.liquidSupply.toString(),
      },
     
      
    ];

    return (
      <NCEntityDetail desc={desc}/>
    );
  }
}
























