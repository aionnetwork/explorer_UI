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
        width: 200,
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
      let holderAddr = null;
      let contractAddr = null;
      let balance = null;
      

      // [blockHash, blockNumber, difficulty, nrgConsumed, nrgLimit, size, blockTimestamp, totalDifficulty, numTransactions]
      if (Array.isArray(entity)) {
        blockNumber = entity[3];
        holderAddr = entity[0];
        contractAddr = entity[1];
        balance = entity[2];
      } else {
        blockNumber = entity.blockNumber;
        holderAddr = entity.holderAddr;
        contractAddr = entity.contractAddr;
        balance = entity.tknBalance;
        
      }

      tableContent[i] = [];  
      tableContent[i][0] = 
      <Cell>
        <NCEntityLabel 
          entityType={NCEntity.BLOCK} 
          entityName={blockNumber}
          entityId={blockNumber}/> 
      </Cell>;
      tableContent[i][1] = 
      <Cell>
        <NCEntityLabel 
          entityType={NCEntity.ACCOUNT} 
          entityName={holderAddr}
          entityId={holderAddr}/> 
      </Cell>;
      tableContent[i][2] = 
      <Cell>
        <NCEntityLabel 
          entityType={NCEntity.CNTR} 
          entityName={contractAddr}
          entityId={contractAddr}/> 
      </Cell>;

      
      tableContent[i][3] = <Cell>{ balance }</Cell>;
      
    });

    return tableContent;
  }

  render() {
    const { data, isPaginated, isLoading, onPageCallback, isLatest=false } = this.props;

    //console.log(JSON.stringify(data));
    
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





























