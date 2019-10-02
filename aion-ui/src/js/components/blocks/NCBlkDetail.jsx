/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';

import NCEntityLabel from 'components/common/NCEntityLabel';
import NCLink from 'components/common/NCLink';

import { NCEntity } from 'lib/NCEnums';
import { nc_numPrettify, nc_isStrEmpty, nc_numFormatter, nc_numFormatterACSensitive, nc_numFormatterBytes, nc_hexPrefix } from 'lib/NCUtility';

import NCEntityDetail from 'components/common/NCEntityDetail';
import * as MSG from 'lib/NCTerms';

const EMPTY_STR = "Not Available";
//import {BigNumber} from 'bignumber.js';

export default class NCBlkDetail extends Component
{
  render() {
    let { entity } = this.props;
    let sealType = "PoW"
    let desc = 
    [
      {
        field: MSG.strings.Blk_detail_row1,
        value: moment.unix(entity.blockTimestamp).format('MMM D YYYY, hh:mm:ss a')
      },
      {
        field: MSG.strings.Blk_detail_row2,
        value: <NCEntityLabel
                  entityType={ NCEntity.BLOCK }
                  entityId={ entity.blockNumber }
                  linkActive={ false }/>
      },
      {
              field: MSG.strings.Blk_detail_row21,
              value: entity.sealType === "POS" ? "Proof of Stake (PoS)" : "Proof of Work (PoW)"
      },
      {
        field: MSG.strings.Blk_detail_row3,
        value: <NCLink 
                  link={"/transactions?block=" + entity.blockHash} 
                  title={entity.numTransactions}
                  enabled={false} />
      },
      // ---------------------------------------------------------------
      {
        field: MSG.strings.Blk_detail_row4,
        value: <NCEntityLabel
                  entityType={ NCEntity.BLOCK }
                  entityId={ entity.blockHash }
                  entityName={ nc_hexPrefix(entity.blockHash) }
                  linkActive={ false }/>
      },
      {
        field: MSG.strings.Blk_detail_row5,
        value: <NCEntityLabel
                  entityType={ NCEntity.BLOCK }
                  entityId={ entity.parentHash }
                  entityName={ nc_hexPrefix(entity.parentHash) }/>
      },
      {
        field: MSG.strings.Blk_detail_row6,
        value: <NCEntityLabel
                  entityType={ NCEntity.ACCOUNT }
                  entityId={ entity.minerAddress }
                  entityName={ nc_hexPrefix(entity.minerAddress) }/>
      },
      // ---------------------------------------------------------------
      {
        field: MSG.strings.Blk_detail_row7,
        value: nc_isStrEmpty(entity.receiptTxRoot) ? EMPTY_STR : nc_hexPrefix(entity.receiptTxRoot),
      },
      {
        field: MSG.strings.Blk_detail_row8,
        value: nc_isStrEmpty(entity.txTrieRoot) ? EMPTY_STR : nc_hexPrefix(entity.txTrieRoot),
      },
      {
        field: MSG.strings.Blk_detail_row9,
        value: nc_isStrEmpty(entity.stateRoot) ? EMPTY_STR : nc_hexPrefix(entity.stateRoot),
      },
      // ---------------------------------------------------------------
      {
        field: MSG.strings.Blk_detail_row10,
        value: entity.difficulty ? nc_numPrettify(entity.difficulty) : EMPTY_STR,
      },
      {
        field: MSG.strings.Blk_detail_row11,
        value: entity.totalDifficulty ? nc_numPrettify(entity.totalDifficulty) : EMPTY_STR,
      },
      {
        field: (entity.sealType !== 'POW') ?  "" : MSG.strings.Blk_detail_row12,
        value: (entity.sealType !== 'POW') ?  "" : nc_isStrEmpty(entity.nonce) ? EMPTY_STR : nc_hexPrefix(entity.nonce),
      },
      {
        field: MSG.strings.Blk_detail_row13,
        value: entity.blockReward != null ? <span className="">
          {nc_numFormatterACSensitive(entity.blockReward, null) + " AION"}
          <span className="subtitle">{"(does not include transaction-fee payouts)"}</span>
        </span> : EMPTY_STR,
      },
      {
        field: MSG.strings.Blk_detail_row14,
        value: entity.nrgReward != null ? <span className="">
          {nc_numFormatterACSensitive(entity.nrgReward, null, false) + " AION"}
          <span className="subtitle">{"(transaction-fee payout for included transactions, minus own transactions)"}</span>
        </span> : EMPTY_STR,
      },
      {
        field: MSG.strings.Blk_detail_row15,
        value: entity.nrgConsumed != null ? nc_numFormatter(entity.nrgConsumed, 18)  + " NRG": EMPTY_STR,
      },
      {
        field: MSG.strings.Blk_detail_row16,
        value: entity.nrgLimit != null ? nc_numFormatter(entity.nrgLimit, 18)  + " NRG": EMPTY_STR,
      },
      // ---------------------------------------------------------------
      {
        field: MSG.strings.Blk_detail_row17,
        value: nc_numFormatterBytes(entity.size, 8),
      },
      {
         field: (entity.sealType !== 'POS') ?  "" : "Seed",
         value: (entity.sealType !== 'POS') ?  "" : entity.seed ? <pre className={"nc-resizable enforce-min-height"}>{entity.seed}</pre> : EMPTY_STR,
      },
      {
         field: (entity.sealType !== 'POS') ?  "" : "Public key",
         value: (entity.sealType !== 'POS') ?  "" : <NCEntityLabel
                                                                      entityType={ NCEntity.ACCOUNT }
                                                                      entityId={ entity.publicKey }
                                                                      entityName={ nc_hexPrefix(entity.publicKey) }/>
      },
      {
        field: (entity.sealType !== 'POS') ?  "" : "Signature",
        value: (entity.sealType !== 'POS') ?  "" : entity.signature ? <pre className={"nc-resizable enforce-min-height"}>{ entity.signature }</pre> : EMPTY_STR,
      },
      {
        field: MSG.strings.Blk_detail_row18,
        value: entity.bloom ? <pre className={"nc-resizable enforce-min-height"}>{ entity.bloom }</pre> : "No Logs (Empty Bloom Filter)",
      },
      {
        field: MSG.strings.Blk_detail_row19,
        value: entity.extraData ? <pre className={"nc-resizable enforce-min-height"}>{ entity.extraData }</pre> : "No Extra Data",
      },
      {
        field: (entity.sealType !== 'POW') ?  "" : MSG.strings.Blk_detail_row20,
        value: (entity.sealType !== 'POW') ?  "" : entity.solution ? <pre className={"nc-resizable enforce-min-height"}>{ entity.solution }</pre> : EMPTY_STR,
      },
    ];

    return (
      <NCEntityDetail desc={desc}/>
    );
  }
}
























