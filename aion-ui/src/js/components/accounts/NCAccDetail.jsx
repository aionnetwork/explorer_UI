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
        value:  balance == null ? "Balance Service Unavailable" :
                <span className="strong">{balance + " AION"}
                  <span className="subtitle">{"(as of block " + entity.blockNumber + ")"}</span>
                </span>
      },
      {
        field: "Nonce",
        value: !entity.nonce ? EMPTY_STR : BigNumber(String(entity.nonce), 16).toString(10) 
      },
    ];

    return (
      <NCEntityDetail desc={desc}/>
    );
  }
}
























