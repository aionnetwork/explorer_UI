/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';

import NCEntityLabel from 'components/common/NCEntityLabel';
import NCLink from 'components/common/NCLink';

import { NCEntity } from 'lib/NCEnums';
import { nc_isStrEmpty, nc_numFormatterBytes, nc_numFormatterAionCoin, nc_isPositiveInteger, nc_hexPrefix } from 'lib/NCUtility';

import NCEntityDetail from 'components/common/NCEntityDetail';

const EMPTY_STR = "Not Available";

export default class NCBlkDetail extends Component
{
  render() {
    let { entity } = this.props;

    let desc = 
    [
      {
        field: "Time Proposed",
        value: moment.unix(entity.timestampVal).format('LLLL')
      },
      {
        field: "Block Number",
        value: <NCEntityLabel
                  entityType={ NCEntity.BLOCK }
                  entityId={ entity.blockNumber }
                  linkActive={ false }/>
      },
      {
        field: "Transaction Count",
        value: <NCLink 
                  link={"/transactions?block=" + entity.blockHash} 
                  title={entity.numTransactions}
                  enabled={entity.numTransactions && entity.numTransactions > 0} />
      },
      // ---------------------------------------------------------------
      {
        field: "Block Hash",
        value: <NCEntityLabel
                  entityType={ NCEntity.BLOCK }
                  entityId={ entity.blockHash }
                  entityName={ nc_hexPrefix(entity.blockHash) }
                  linkActive={ false }/>
      },
      {
        field: "Parent Hash",
        value: <NCEntityLabel
                  entityType={ NCEntity.BLOCK }
                  entityId={ entity.parentHash }
                  entityName={ nc_hexPrefix(entity.parentHash) }/>
      },
      {
        field: "Miner",
        value: <NCEntityLabel
                  entityType={ NCEntity.ACCOUNT }
                  entityId={ entity.minerAddress }
                  entityName={ nc_hexPrefix(entity.minerAddress) }/>
      },
      // ---------------------------------------------------------------
      {
        field: "Receipt Root",
        value: nc_isStrEmpty(entity.receiptTxRoot) ? EMPTY_STR : nc_hexPrefix(entity.receiptTxRoot),
      },
      {
        field: "Transaction Root",
        value: nc_isStrEmpty(entity.txTrieRoot) ? EMPTY_STR : nc_hexPrefix(entity.txTrieRoot),
      },
      {
        field: "State Root",
        value: nc_isStrEmpty(entity.stateRoot) ? EMPTY_STR : nc_hexPrefix(entity.stateRoot),
      },
      // ---------------------------------------------------------------
      {
        field: "Difficulty",
        value: nc_isPositiveInteger(entity.difficulty) ? entity.difficulty: EMPTY_STR,
      },
      {
        field: "Total Difficulty",
        value: nc_isPositiveInteger(entity.totalDifficulty) ? entity.totalDifficulty: EMPTY_STR,
      },
      {
        field: "Nonce",
        value: nc_isStrEmpty(entity.nonce) ? EMPTY_STR : entity.nonce,
      },
      {
        field: "Block Reward",
        value: entity.blockReward != null ? entity.blockReward : EMPTY_STR,
      },
      {
        field: "Nrg Consumed",
        value: entity.nrgConsumed != null ? nc_numFormatterAionCoin(entity.nrgConsumed, 0)  + " AION": EMPTY_STR,
      },
      {
        field: "Nrg Limit",
        value: entity.nrgLimit != null ? nc_numFormatterAionCoin(entity.nrgLimit, 0)  + " AION": EMPTY_STR,
      },
      // ---------------------------------------------------------------
      {
        field: "Block Size",
        value: nc_numFormatterBytes(entity.size, 2),
      },
      {
        field: "Bloom Filter",
        value: entity.bloom ? <pre className={"nc-resizable enforce-min-height"}>{ entity.bloom }</pre> : "No Logs (Empty Bloom Filter)",
      },
      {
        field: "Extra Data",
        value: entity.extraData ? <pre className={"nc-resizable enforce-min-height"}>{ entity.extraData }</pre> : "No Extra Data",
      },
      {
        field: "Equihash Solution",
        value: entity.solution ? <pre className={"nc-resizable enforce-min-height"}>{ entity.solution }</pre> : EMPTY_STR,
      },
    ];

    return (
      <NCEntityDetail desc={desc}/>
    );
  }
}
























