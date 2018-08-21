/* eslint-disable */

import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import NCTableReactPaginated from 'components/common/NCTableReactPaginated';

import moment from 'moment';
import { Button, Position, Classes, Popover, Menu, MenuItem, InputGroup, Intent, PopoverInteractionKind } from "@blueprintjs/core";
import { Table, Column, Cell, ColumnHeaderCell, SelectionModes } from "@blueprintjs/table"

import NCTableBase from 'components/common/NCTableBase';
import { NCSortType, NCEntity, nc_LinkToEntity } from 'lib/NCEnums';

import NCPagination from 'components/common/NCPagination';
import NCEntityLabel, {parseClientTransaction} from 'components/common/NCEntityLabel';
import NCTokenLabel from 'components/common/NCTokenLabel';
import { PAGE_SIZE } from 'network/NCNetworkRequests'

import { nc_numFormatterAionCoin } from 'lib/NCUtility';

 const row = {
    height:"100px",
  }

export default class NCTknTable extends Component 
{
  constructor(props) {
    super(props);

    this.columnDescriptor = 
    [
      {
        name: "Token",
        isSortable: false,
        isFilterable: false,
        width: 300,
        flex: false,
        objPath: null,
      },
      {
        name: "Decimal",
        isSortable: false,
        isFilterable: false,
        width: 70,
        flex: false,
        objPath: null,
      },
      {
        name: "Frozen Supply",
        isSortable: false,
        isFilterable: false,
        width: 100,
        flex: false,
        objPath: null,
      },
      {
        name: "Liquid Supply",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: "Holders",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: "Transactions", // arrow
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
      },
      /*{
        name: "Contract",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: "Site",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: "To Address",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: "To Address",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },*/
    ];

    this.generateTableContent = this.generateTableContent.bind(this);
  }

 

  generateTableContent(entityList) 
  {
    let tableContent = [];
    console.log('tkn table');
    entityList.forEach((entity, i) => 
    {
      let blockNumber = null;
      let token = null;
      let symbol = null;
      let Addr = null;
      let totalSupply = null;
      let circulatingSupply = 0;
      let description = "This is a test description!";
      let decimal = null;
      let transactions = 0;
      let holders = 1;

      let contractHash = null;
      let fromAddr = null;
      let toAddr = null;
      let blockTimestamp = null;
      let value = null;

      // [transactionHash, fromAddr, toAddr, value, blockTimestamp, blockNumber]
      if (Array.isArray(entity)) {
        blockNumber = entity[5];
        token = entity[0];
        symbol = entity[1];
        fromAddr = entity[1];
        toAddr = entity[2];
        blockTimestamp = entity[4];
        value = entity[3];
      } else {
        blockNumber = entity.blockNumber;

        token = entity.name;
        symbol = entity.symbol;
        Addr = entity.Addr;
        totalSupply = entity.totalSupply;
        circulatingSupply = entity.circulatingSupply;
        decimal = entity.decimals;
        transactions = entity.transactions;
        holders = entity.holders;

        fromAddr = entity.fromAddr;
        toAddr = entity.toAddr;
        blockTimestamp = entity.blockTimestamp;
        value = entity.value;
      }

      // Generate tableContent
      tableContent[i] = [];
      tableContent[i][0] = 
      <Cell truncated={false}
       wrapText={true}>
        
        
        <NCTokenLabel 
          entityType={NCEntity.TKN} 
          entityName={token}
          entityDescription={description}
          entitySymbol={symbol}
          entityId={Addr}/>
        
        
       </Cell>
      ;
      tableContent[i][1] = <Cell>{ decimal }</Cell>;
      tableContent[i][2] = <Cell>{ totalSupply }</Cell>;
      tableContent[i][3] = 
      <Cell>
        <NCEntityLabel 
          entityType={NCEntity.TXN} 
          entityName={circulatingSupply}
          entityId={circulatingSupply}/> 
      </Cell>;
      tableContent[i][4] = 
      <Cell>
        <NCEntityLabel 
          entityType={NCEntity.ACCOUNT} 
          entityName={holders}
          entityId={holders}/>
      </Cell>;
      tableContent[i][5] = 
      <Cell>
        {transactions}
      </Cell>;
     
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
        entityName={"Tokens"}
        generateTableContent={this.generateTableContent}
        columnDescriptor={this.columnDescriptor}
        isLatest={isLatest}/>
    );
  }
}






























