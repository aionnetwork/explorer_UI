/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';
import { Cell } from "@blueprintjs/table"

import NCEntityLabel from 'components/common/NCEntityLabel';
import NCPagination from 'components/common/NCPagination';
import NCTableReactPaginated from 'components/common/NCTableReactPaginated';
import NCLink from 'components/common/NCLink';

import { NCEntity } from 'lib/NCEnums';
import { nc_numPrettify, nc_numFormatter, nc_numFormatterBytes, nc_numFormatterAionCoin, nc_hexPrefix } from 'lib/NCUtility';

import { PAGE_SIZE } from 'network/NCNetworkRequests'
import {BigNumber} from 'bignumber.js';

export default class NCAccTable extends Component 
{
  constructor(props) {
    super(props);

    this.columnDescriptor = 
    [
      {
        name: "Block #",
        isSortable: false,
        isFilterable: false,
        width: 120,
        flex: true,
        objPath: 'blockNumber',
      },
      {
        name: "Account",
        isSortable: false,
        isFilterable: false,
        width: 200,
        flex: false,
        objPath: 'holderAddr',
      },
      {
        name: "Contract",
        isSortable: false,
        isFilterable: false,
        width: 90,
        flex: false,
        objPath: 'contractAddr',
      },
      {
        name: "Balance",
        isSortable: false,
        isFilterable: false,
        width: 110,
        flex: false,
        objPath: 'tknBalance',
      },
      
    ];
  }

  generateTableContent = (entityList) => 
  {
    let tableContent = [];

    entityList.forEach((entity, i) => 
    {
      
      let blockNumber = null;
      let nrgConsumed = null;
      let difficulty = null;
      let size = null;
      let numTransactions = null;
      let blockTimestamp = null;

      // [blockHash, blockNumber, difficulty, nrgConsumed, nrgLimit, size, blockTimestamp, totalDifficulty, numTransactions]
      if (Array.isArray(entity)) {
        blockNumber = entity[1];
        nrgConsumed = entity[3];
        difficulty = entity[2];
        size = entity[5];
        numTransactions = entity[8];
        blockTimestamp = entity[6];
      } else {
        blockNumber = entity.blockNumber;
        nrgConsumed = entity.nrgConsumed;
        difficulty = entity.difficulty;
        size = entity.size;
        numTransactions = entity.numTransactions;
        blockTimestamp = entity.blockTimestamp;
      }

      tableContent[i] = [];  
      tableContent[i][0] = 
      <Cell copy={blockNumber}>
        <NCEntityLabel 
          entityType={NCEntity.BLOCK} 
          entityName={blockNumber}
          entityId={blockNumber}/> 
      </Cell>;
      tableContent[i][1] = 
      <Cell copy={holderAddr}>
        <NCEntityLabel 
          entityType={NCEntity.ACCOUNT} 
          entityName={holderAddr}
          entityId={holderAddr}/> 
      </Cell>;
      tableContent[i][2] = 
      <Cell copy={contractAddr}>
        <NCEntityLabel 
          entityType={NCEntity.CONTRACT} 
          entityName={contractAddr}
          entityId={contractAddr}/> 
      </Cell>;

      
      tableContent[i][3] = <Cell copy={ balance }>{ balance }</Cell>;
      
    });

    return tableContent;
  }

  render() {
    const { data, isPaginated, isLoading, onPageCallback, isLatest=false } = this.props;
    
    return (
      <NCTableReactPaginated
        data={data}
        onPageCallback={onPageCallback}
        isLoading={isLoading}
        isPaginated={isPaginated}
        entityName={"holders"}
        generateTableContent={this.generateTableContent}
        columnDescriptor={this.columnDescriptor}
        isLatest={isLatest}/>
    );
  }
}





























