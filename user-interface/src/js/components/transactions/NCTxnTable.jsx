/* eslint-disable */

import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import NCTableReact from 'components/common/NCTableReact';

import moment from 'moment';
import { Button, Position, Classes, Popover, Menu, MenuItem, InputGroup, Intent, PopoverInteractionKind } from "@blueprintjs/core";
import { Table, Column, Cell, ColumnHeaderCell, SelectionModes } from "@blueprintjs/table"

import NCTableBase from 'components/common/NCTableBase';
import { NCSortType, NCEntity, nc_LinkToEntity } from 'lib/NCEnums';

import NCPagination from 'components/common/NCPagination';
import NCEntityLabel, {parseClientTransaction} from 'components/common/NCEntityLabel';
import { PAGE_SIZE } from 'network/NCNetworkRequests'

export default class NCTxnTable extends Component 
{
  constructor(props) {
    super(props);

    this.columnDescriptor = 
    [
      {
        name: "Block #",
        isSortable: true,
        isFilterable: true,
        width: 100,
        flex: false,
        objPath: 'blockNumber',
      },
      {
        name: "Timestamp",
        isSortable: true,
        isFilterable: true,
        width: 150,
        flex: false,
        objPath: 'timestampVal',
      },
      {
        name: "Transaction Hash",
        isSortable: true,
        isFilterable: true,
        width: null,
        flex: true,
        objPath: 'transactionHash',
      },
      {
        name: "From Address",
        isSortable: true,
        isFilterable: true,
        width: null,
        flex: true,
        objPath: 'fromAddr',
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
        isSortable: true,
        isFilterable: true,
        width: null,
        flex: true,
        objPath: 'toAddr',
      },
    ];

    this.generateTableContent = this.generateTableContent.bind(this);
  }

  generateTableContent(entityList) 
  {
    let tableContent = [];

    entityList.forEach((entity, i) => 
    {
      tableContent[i] = [];
      tableContent[i][0] = 
      <Cell>
        <NCEntityLabel 
          entityType={NCEntity.BLOCK} 
          entityName={entity.blockNumber}
          entityId={entity.blockNumber}/> 
      </Cell>;
      tableContent[i][1] = <Cell>{ moment.unix(entity.timestampVal).format('MMM D YYYY, hh:mm:ss a') }</Cell>;
      tableContent[i][2] = 
      <Cell>
        <NCEntityLabel 
          entityType={NCEntity.TXN} 
          entityName={entity.transactionHash}
          entityId={entity.transactionHash}/> 
      </Cell>;
      tableContent[i][3] = 
      <Cell>
        <NCEntityLabel 
          entityType={NCEntity.ACCOUNT} 
          entityName={entity.fromAddr}
          entityId={entity.fromAddr}/>
      </Cell>;
      tableContent[i][4] = 
      <Cell>
        <div className="arrow-cell">
          <span className="pt-icon-standard pt-icon-arrow-right"/>
        </div>
      </Cell>;
      tableContent[i][5] = 
      <Cell>
      {
        entity.toAddr ?
        <NCEntityLabel 
          entityType={NCEntity.ACCOUNT} 
          entityName={entity.toAddr}
          entityId={entity.toAddr}/>:
        "Contract Creation"
      }
      </Cell>;
    });

    return tableContent;
  }

  render() {
    const { data, isPaginated, isLoading, onPageCallback } = this.props;
    const page = data.page;
    const list = data.content;
    console.log(data);
    return (
      <div className={"NCTableWrapper"}>
      {
        (isPaginated) &&
        <NCPagination
          entityName={"transactions"}

          pageNumber={page.number}
          totalElements={page.totalElements}
          listSize={list.length}
          totalPages={page.totalPages}
          pageSize={page.size}
          
          onPageCallback={this.props.onPageCallback}
          isLoading={this.props.isLoading}/>
      }
        <NCTableReact
          data={list}
          generateTableContent={this.generateTableContent}
          columnDescriptor={this.columnDescriptor}/>
      </div>
    );
  }
}






























