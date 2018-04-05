/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';

import NCEntityLabel from 'components/common/NCEntityLabel';

import { NCEntity } from 'lib/NCEnums';
import { nc_numFormatterAionCoin, nc_numFormatter } from 'lib/NCUtility';
import NCLink from 'components/common/NCLink';

import NCEntityDetail from 'components/common/NCEntityDetail';

const EMPTY_STR = "Not Available";

export default class NCAccDetail extends Component
{
  render() {
    let { entity } = this.props;
    
    let desc = [
      {
        field: "Address",
        value:  <NCEntityLabel
                  entityType={ NCEntity.ACCOUNT }
                  entityId={ entity.addr }
                  linkActive={ false }/>
      },
      {
        field: "Balance",
        value:  nc_numFormatterAionCoin(entity.balance) + " AION"
      },
      {
        field: "Transaction Count",
        value: !entity.numTransactions ? EMPTY_STR : 
                <NCLink 
                  link={"/transactions?account=" + entity.addr} 
                  title={nc_numFormatter(entity.numTransactions)}
                  enabled={entity.numTransactions && entity.numTransactions > 0}/>
      },
      {
        field: "Blocks Mined",
        value: !entity.numBlocksMined ? EMPTY_STR : 
                <NCLink 
                  link={"/blocks?account=" + entity.addr} 
                  title={nc_numFormatter(entity.numBlocksMined, 3)}
                  enabled={entity.numBlocksMined && entity.numBlocksMined > 0}/>  
      },
      /*
      {
        field: "Latest Transaction",
        value: 
          entity.lastTransactionTimestamp == 0 ? 
          moment.unix(entity.lastTransactionTimestamp).format('LLLL') : 
          "Not Available"
      },
      {
        field: "First Transaction",
        value:  
          entity.firstTransactionTimestamp == 0 ? 
          moment.unix(entity.firstTransactionTimestamp).format('LLLL') :
          "Not Available"
      },*/
    ];

    return (
      <NCEntityDetail desc={desc}/>
    );
  }
}
























