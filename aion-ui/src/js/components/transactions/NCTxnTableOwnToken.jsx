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
import { PAGE_SIZE } from 'network/NCNetworkRequests'

import { nc_numFormatterAionCoin } from 'lib/NCUtility';

export default class NCTxnTableOwn extends Component 
{
  constructor(props) {
    super(props);

    this.columnDescriptor = 
    [
      {
        name: "Block #",
        isSortable: false,
        isFilterable: false,
        width: 100,
        flex: false,
        objPath: null,
      },
      {
        name: "Timestamp",
        isSortable: false,
        isFilterable: false,
        width: 160,
        flex: false,
        objPath: null,
      },
      {
        name: "Value",
        isSortable: false,
        isFilterable: false,
        width: 100,
        flex: false,
        objPath: null,
      },
      
      {
        name: "From Address",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: "", // arrow
        isSortable: false,
        isFilterable: false,
        width: 40,
        flex: false,
      },
      {
        name: "To Address",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
    ];

    this.generateTableContent = this.generateTableContent.bind(this);
  }

  generateTableContent(entityList) 
  {
    let tableContent = [];

    entityList.forEach((entity, i) => 
    {
      let blockNumber = null;
      let transactionHash = null;
      let fromAddr = null;
      let toAddr = null;
      let blockTimestamp = null;
      let value = null;
      let transferTimestamp =null;

      // [transactionHash, fromAddr, toAddr, value, blockTimestamp, blockNumber]
      if (Array.isArray(entity)) {
        blockNumber = entity[5];
        transactionHash = entity[0];
        fromAddr = entity[1];
        toAddr = entity[2];
        blockTimestamp = entity[4];
        value = entity[3];
      } else {
        blockNumber = entity.blockNumber;
        transactionHash = entity.transactionHash;
        fromAddr = entity.fromAddr;
        toAddr = entity.toAddr;
        transferTimestamp = entity.transferTimestamp;
        value = entity.tknValue;
      }

      let isFrom = true;
      if (this.props.ownAddr == fromAddr)
        isFrom = true;

      let isTo = false;
      if (this.props.ownAddr == toAddr)
        isTo = true;

      // Generate tableContent
      tableContent[i] = [];
      tableContent[i][0] = 
      <Cell copy={blockNumber}>
        <NCEntityLabel 
          entityType={NCEntity.BLOCK} 
          entityName={blockNumber}
          entityId={blockNumber}/> 
      </Cell>;
      tableContent[i][1] = <Cell copy={ moment.unix(transferTimestamp).format('MMM D YYYY, hh:mm:ss a') }>{ moment.unix(transferTimestamp).format('MMM D YYYY, hh:mm:ss a') }</Cell>;
      tableContent[i][2] = <Cell copy={ value ? value : 0 }>{ value ? value : 0 }</Cell>;
     
      tableContent[i][3] = 
      <Cell copy={fromAddr} intent={ isFrom ? Intent.PRIMARY : Intent.NONE } tooltip={ isFrom ? "own account" : undefined }>
        <NCEntityLabel 
          entityType={NCEntity.SEARCH} 
          entityName={fromAddr}
          entityId={fromAddr}
          linkActive={isFrom ? false : true}/>
      </Cell>;
      tableContent[i][4] = 
      <Cell>
        <div className="arrow-cell">
          <span className="pt-icon-standard pt-icon-arrow-right"/>
        </div>
      </Cell>;
      tableContent[i][5] = 
      <Cell copy={toAddr} intent={ isTo ? Intent.PRIMARY : Intent.NONE } tooltip={ isTo ? "own account" : undefined }>
      {
        toAddr ?
        <NCEntityLabel 
          entityType={NCEntity.SEARCH} 
          entityName={toAddr}
          entityId={toAddr}
          linkActive={isTo ? false : true}/>:
        "Contract Creation"
      }
      </Cell>;
    });

    return tableContent;
  }
  
  render() {
    const { ownAddr, data, isPaginated, isLoading, onPageCallback, isLatest=false } = this.props;
    //console.log("Txn loading state: " + isLoading);
    return (
      <NCTableReactPaginated
        data={data}
        onPageCallback={onPageCallback}
        isLoading={isLoading}
        isPaginated={isPaginated}
        entityName={"blocks"}
        generateTableContent={this.generateTableContent}
        columnDescriptor={this.columnDescriptor}
        isLatest={isLatest}/>
    );
  }
}






























