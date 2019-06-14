/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';

import { NCEntity } from 'lib/NCEnums';
import NCEntityLabel, { parseClientTransaction } from 'components/common/NCEntityLabel';
import { Tooltip, Popover, PopoverInteractionKind, Position, Content, Button } from "@blueprintjs/core";
import * as MSG from 'lib/NCTerms';

import NCEntityDetail from 'components/common/NCEntityDetail';

import { nc_decimalPrettify,nc_addDecimal,nc_isStrEmpty, nc_numFormatter, nc_numFormatterAmp, nc_numFormatterBytes, nc_numFormatterACSensitive, nc_isPositiveInteger, nc_hexPrefix } from 'lib/NCUtility';

import {BigNumber} from 'bignumber.js';
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

    
    let parsedInputData = this.parseInputData(entity);
    const symbol = " (" + entity.symbol + ")";
    let desc = 
    [
      {
        field: MSG.strings.Tkn_detail_row1,
        value: moment.unix(entity.creationTimestamp).format('LLLL'),
      },
      {
        field: MSG.strings.Tkn_detail_row2,
        value: <NCEntityLabel
                  entityType={NCEntity.CNTR}
                  entityId={entity.contractAddr}
                  linkActive={true}/>,
      },
      {
        field: MSG.strings.Tkn_detail_row3,
        value: <NCEntityLabel
                  entityType={NCEntity.ACCOUNT}
                  entityId={entity.creatorAddress}
                  linkActive={true}/>,
      },
      {
        field: MSG.strings.Tkn_detail_row4,
        value: <NCEntityLabel
                  entityType={NCEntity.TXN}
                  entityId={entity.transactionHash}
                  linkActive={true}/>,
      },
      {
        field: MSG.strings.Tkn_detail_row5,
        value: entity.symbol,
      },
      // ---------------------------------------------------------------
      {
        field: <div>
                {MSG.strings.Tkn_detail_row6} {" "}
                <Tooltip
                  position={Position.RIGHT}
                  content={gran} >
                  <span className="fa fa-info-circle fa-lg icon"></span>
                </Tooltip>
               
               </div>,
        value: entity.granularity,
      },
      
      {
        field: <div>
                               {MSG.strings.Tkn_detail_row7} {" "}
                               <Tooltip
                                 position={Position.RIGHT}
                                 content={MSG.strings.si_prefix_msg} >
                                 <span className="fa fa-info-circle fa-lg icon"></span>
                               </Tooltip>

                              </div>,
        value: (entity.totalSupply < 0)? entity.totalSupply : nc_decimalPrettify(nc_addDecimal(entity.totalSupply.toString(),entity.tokenDecimal,8))+ " " + entity.symbol,
      },
      {
        field: MSG.strings.Tkn_detail_row8,
        value: (entity.liquidSupply < 0)? entity.liquidSupply : nc_decimalPrettify(nc_addDecimal(entity.liquidSupply.toString(),entity.tokenDecimal,8))+ " "+ entity.symbol,
      },
     
      
    ];

    return (
      <NCEntityDetail desc={desc}/>
    );
  }
}
























