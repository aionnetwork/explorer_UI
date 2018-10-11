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
export default class NCAccDetail extends Component
{
  render() {
    let { entity } = this.props;
    
    let balance = nc_numFormatterACSensitive(entity.balance);

    let desc = [
      {
        field: "Address",
        value:  <NCEntityLabel
                  entityType={ NCEntity.ACCOUNT }
                  entityId={ entity.address }
                  linkActive={ false }/>
      },
      {
        field: "Balance",
        value:  entity.tokenName  ?
                entity.balance == null ? "Balance Service Unavailable" :
                <span className="strong">
                  {entity.balance + " " + entity.tokenName}                
                </span>
                :
                entity.balance == null ? "Balance Service Unavailable" :
                <span className="strong">{entity.balance + " AION"}
                  <span className="subtitle">{"(as of block " + entity.lastBlockNumber + ")"}</span>
                </span>


      },
      {
        field: "Nonce",
        value: !entity.nonce ? EMPTY_STR : entity.nonce
      },
      
      
    ];

    return (
      <NCEntityDetail desc={desc}/>
    );
  }
}
























