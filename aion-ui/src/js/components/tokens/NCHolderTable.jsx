/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';
import { Cell } from "@blueprintjs/table"

import NCEntityLabel from 'components/common/NCEntityLabel';
import NCPagination from 'components/common/NCPagination';
import NCTableReactPaginated from 'components/common/NCTableReactPaginated';
import NCLink from 'components/common/NCLink';

import { NCEntityInfo,NCEntity } from 'lib/NCEnums';
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
        name: "Account",
        isSortable: false,
        isFilterable: false,
        width: 120,
        flex: true,
        objPath: 'holderAddr',
      },
      {
        name: "Block #",
        isSortable: false,
        isFilterable: false,
        width: 200,
        flex: false,
        objPath: 'blockNumber',
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
      }
      
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
      let rawbalance = null;

     if (Array.isArray(entity)) {
        blockNumber = entity[3];
        holderAddr = entity[0];
        contractAddr = entity[1];
        balance = entity[2];
      } else {
        blockNumber = entity.blockNumber;
        holderAddr = entity.holderAddr;
        contractAddr = entity.contractAddr;
        balance = entity.rawBalance;
        rawbalance = entity.rawBalance;
      }

      tableContent[i] = [];  
      
      tableContent[i][0] = 
      <Cell copy={holderAddr} link={'#'+NCEntityInfo[NCEntity.ACCOUNT].absoluteUrl+''+holderAddr}>
        <NCEntityLabel 
          entityType={NCEntity.ACCOUNT} 
          
          entityId={holderAddr}/> 
      </Cell>;
      tableContent[i][1] = 
      <Cell copy={blockNumber} link={'#'+NCEntityInfo[NCEntity.BLOCK].absoluteUrl+''+blockNumber}>
        <NCEntityLabel 
          entityType={NCEntity.BLOCK} 
          entityName={blockNumber}
          entityId={blockNumber}/> 
      </Cell>;
      tableContent[i][2] = 
      <Cell copy={contractAddr} link={'#'+NCEntityInfo[NCEntity.CNTR].absoluteUrl+''+contractAddr}>
        <NCEntityLabel 
          entityType={NCEntity.CNTR} 
          
          entityId={contractAddr}/> 
      </Cell>;

      
      tableContent[i][3] = <Cell>{ balance }</Cell>;
      
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





























