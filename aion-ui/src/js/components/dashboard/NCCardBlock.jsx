/* eslint-disable */
import React, { Component } from 'react';

import { NCEntity } from 'lib/NCEnums';
import { nc_LinkToEntity } from 'lib/NCUtility';

import NCEntityLabel from 'components/common/NCEntityLabel';

import moment from "moment";

export default class NCCardBlock extends Component
{
  render() {

    let blk = this.props.block;

    let isEmpty = true;

    if (blk.numTransactions != null && blk.numTransactions > 0)
      isEmpty = false;

    return (
      <div className="NCCardBlock">

        <img className="block-child" src={ isEmpty ? "img/block/block-grey.svg" : "img/block/block-indigo.svg" }/>
        <div className={"block-card card-hover "+(isEmpty ? "" : "non-empty-block") }>
          <div className="block-number">
            <span className="subtitle pt-text-muted">Block #</span>
            <span className="title">{ blk.blockNumber != null ? blk.blockNumber : "Undefined" }</span>
          </div>
          <div className="proposer">
            <span className="subtitle pt-text-muted">Proposed by</span>
            <NCEntityLabel
              entityType={NCEntity.ACCOUNT}
              entityId={blk.minerAddress}/>

          </div>
          <div className="transaction-count">
            <span className="num-txns">{ blk.numTransactions != null ? blk.numTransactions : "0" }</span>
            <span className="txns-subtitle pt-text-muted">Transactions</span>
            {
              (blk.blockTime != null) &&
              <span className="txns-subtitle pt-text-muted">in</span>
            }
            {
              (blk.blockTime != null) &&
              <span className="proposal-time">{Math.round(blk.blockTime * 100) / 100}s</span>
            }
          </div>
          {/*<span className="time-elapsed pt-text-muted">{blk.blockTimestamp != null ? moment.unix(blk.blockTimestamp).fromNow() : ""}</span>*/}
          <button
            className="block-link pt-button pt-minimal pt-icon-circle-arrow-right pt-intent-primary"
            onClick={() => nc_LinkToEntity(NCEntity.BLOCK, blk.blockNumber)}
          />
        </div>
      </div>
    );
  }
}
