/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';

import {BigNumber} from 'bignumber.js';
import NCEntityLabel from 'components/common/NCEntityLabel';

import { NCEntity } from 'lib/NCEnums';
import { nc_decimalPrettify, nc_numFormatterACSensitive,nc_numFormatterAionCoin,nc_decimalPoint, nc_numFormatter } from 'lib/NCUtility';
import NCLink from 'components/common/NCLink';

import NCEntityDetail from 'components/common/NCEntityDetail';

const EMPTY_STR = "Not Available";
const NOT_CONTRACT = "Not a Contract";
import * as MSG from 'lib/NCTerms';//MSG.strings.Cntr_detail_row1

export default class NCCntrDetail extends Component
{
  render() {
    let { entity } = this.props;
    
    //let balance = nc_numFormatterACSensitive(entity.balance);
    let balance = (entity.balance) ? nc_decimalPrettify(nc_decimalPoint(entity.balance,18)) : 0;
     //let bal = nc_numFormatterACSensitive(entity.balance);nc_numFormatterAionCoin(num.toFixed(),8);
        //console.log(entity.tokenDecimal);
    //let balance = entity.tokenName ? nc_decimalPrettify(nc_addDecimal(entity.balance)) : nc_decimalPrettify(entity.balance);

    let desc = [
      {
        field: MSG.strings.Cntr_detail_row1,
        value:  <NCEntityLabel
                  entityType={ NCEntity.ACCOUNT }
                  entityId={ entity.contractAddr}
                  linkActive={ true }/>
      },
      
      {
        field: MSG.strings.Cntr_detail_row2,
        value:  <NCEntityLabel
                  entityType={ NCEntity.BLOCK }
                  entityId={ entity.blockNumber}
                  linkActive={ true }/>
      },
      {
        field: MSG.strings.Cntr_detail_row3,
        value:  <NCEntityLabel
                  entityType={ NCEntity.TXN }
                  entityId={ entity.contractTxHash}
                  linkActive={ true }/>
      },
      {
        field: MSG.strings.Cntr_detail_row4,
        value:  <NCEntityLabel
                  entityType={ NCEntity.ACCOUNT }
                  entityId={ entity.contractCreatorAddr}
                  linkActive={ true }/>
      },
      {
        field: MSG.strings.Cntr_detail_row5,
        value:  balance == null ? "Balance Service Unavailable" :
                <span className="">{balance + " AION"}

                </span>
      },
      {
        field: MSG.strings.Cntr_detail_row6,
        value:  !entity.nonce ? EMPTY_STR : entity.nonce
      },
      {
                    //Contract type
                    field: (entity.contractAddr) ?  "Type" : "",
                    value: entity.contractAddr ? (entity.type=="DEFAULT")? "FVM" : entity.type : "",
            },
    ];

    let bridge = [
      {
        field: MSG.strings.Cntr_detail_row1,
        value:  <NCEntityLabel
                  entityType={ NCEntity.CNTR }
                  entityId={ entity.contractAddr}
                  linkActive={ true }/>
      },
      {
        field: MSG.strings.Cntr_detail_row5,
        value:  balance == null ? "Balance Service Unavailable" :
                <span className="">{balance + " AION"}
                  {entity.isATB == true ? "" : <span className="subtitle">{"(as of block " + entity.blockNumber + ")"}</span>}
                </span>
      },
      {
        field: MSG.strings.Cntr_detail_row6,
        value:  !entity.nonce ? EMPTY_STR : entity.nonce
      },

      {
        field: MSG.strings.Cntr_detail_row7,
        value: <p>{MSG.strings.Cntr_detail_row7_sub_a} <a href="https://docs.aion.network/docs/swap-overview">{MSG.strings.Cntr_detail_row7_sub_b}</a> </p>
      }

    ];

    return (
      <NCEntityDetail desc={!entity.isATB ? desc : bridge }/>
    );
  }
}
























