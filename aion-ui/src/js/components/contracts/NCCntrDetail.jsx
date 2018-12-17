/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';

import {BigNumber} from 'bignumber.js';
import NCEntityLabel from 'components/common/NCEntityLabel';

import { NCEntity } from 'lib/NCEnums';
import { nc_decimalPrettify, nc_numFormatterACSensitive, nc_numFormatter } from 'lib/NCUtility';
import NCLink from 'components/common/NCLink';

import NCEntityDetail from 'components/common/NCEntityDetail';

const EMPTY_STR = "Not Available";
const NOT_CONTRACT = "Not a Contract";
export default class NCCntrDetail extends Component
{
  render() {
    let { entity } = this.props;
    
    //let balance = nc_numFormatterACSensitive(entity.balance);
    let balance = (entity.balance) ? nc_decimalPrettify(entity.balance) : 0;

    let desc = [
      {
        field: "Address",
        value:  <NCEntityLabel
                  entityType={ NCEntity.CNTR }
                  entityId={ entity.contractAddr}
                  linkActive={ true }/>
      },
      /*{
        field: "Name",
        value:  <NCEntityLabel
                  entityType={ NCEntity.CONTRACT }
                  entityId={ entity.contractName}
                  linkActive={ false }/>
      },*/
      {
        field: "Block Number",
        value:  <NCEntityLabel
                  entityType={ NCEntity.BLOCK }
                  entityId={ entity.blockNumber}
                  linkActive={ true }/>
      },
      {
        field: "Transaction Hash",
        value:  <NCEntityLabel
                  entityType={ NCEntity.TXN }
                  entityId={ entity.contractTxHash}
                  linkActive={ true }/>
      },
      {
        field: "Creator",
        value:  <NCEntityLabel
                  entityType={ NCEntity.ACCOUNT }
                  entityId={ entity.contractCreatorAddr}
                  linkActive={ true }/>
      },
      {
        field: "Balance",
        value:  balance == null ? "Balance Service Unavailable" :
                <span className="">{balance + " AION"}
                  <span className="subtitle">{"(as of block " + entity.blockNumber + ")"}</span>
                </span>
      },
      {
        field: "Nonce",
        value:  !entity.nonce ? EMPTY_STR : entity.nonce
      }
    ];

    let bridge = [
      {
        field: "Address",
        value:  <NCEntityLabel
                  entityType={ NCEntity.CNTR }
                  entityId={ entity.contractAddr}
                  linkActive={ true }/>
      },
      {
        field: "Balance",
        value:  balance == null ? "Balance Service Unavailable" :
                <span className="">{balance + " AION"}
                  {entity.isATB == true ? "" : <span className="subtitle">{"(as of block " + entity.blockNumber + ")"}</span>}
                </span>
      },
      {
        field: "Nonce",
        value:  !entity.nonce ? EMPTY_STR : entity.nonce
      },
      {
        field: "Notice",
        value: <p>This is a special bridge contract. To learn more about it click <a href="https://docs.aion.network/docs/swap-overview">here</a> </p>
      }

    ];

    return (
      <NCEntityDetail desc={!entity.isATB ? desc : bridge }/>
    );
  }
}
























