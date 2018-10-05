/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';

import {BigNumber} from 'bignumber.js';
import NCEntityLabel from 'components/common/NCEntityLabel';

import { NCEntity } from 'lib/NCEnums';
import { nc_numFormatterACSensitive, nc_numFormatter } from 'lib/NCUtility';
import NCLink from 'components/common/NCLink';

import NCEntityDetail from 'components/common/NCEntityDetail';

const EMPTY_STR = "Not Available";
const NOT_CONTRACT = "Not a Contract";
export default class NCCntrDetail extends Component
{
  render() {
    let { entity } = this.props;
    
    let balance = nc_numFormatterACSensitive(entity.balance);

    let desc = [
      {
        field: "Address",
        value:  <NCEntityLabel
                  entityType={ NCEntity.ACCOUNT }
                  entityId={ entity.contractAddr}
                  linkActive={ false }/>
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
                  linkActive={ false }/>
      },
      {
        field: "Transaction Hash",
        value:  <NCEntityLabel
                  entityType={ NCEntity.TXN }
                  entityId={ entity.contractTxHash}
                  linkActive={ false }/>
      },
      {
        field: "Creator",
        value:  <NCEntityLabel
                  entityType={ NCEntity.ACCOUNT }
                  entityId={ entity.contractCreatorAddr}
                  linkActive={ false }/>
      },
      {
        field: "Balance",
        value:  balance == null ? "Balance Service Unavailable" :
                <span className="strong">{balance + " AION"}
                  <span className="subtitle">{"(as of block " + entity.lastBlockNumber + ")"}</span>
                </span>
      }
      
    ];

    return (
      <NCEntityDetail desc={desc}/>
    );
  }
}
























