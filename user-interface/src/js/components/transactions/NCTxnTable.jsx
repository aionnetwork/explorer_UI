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
        isSortable: false,
        isFilterable: false,
        width: 100,
        flex: false,
        objPath: 'blockNumber',
      },
      {
        name: "Timestamp",
        isSortable: false,
        isFilterable: false,
        width: 150,
        flex: false,
        objPath: 'blockTimestamp',
      },
      {
        name: "Transaction Hash",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: 'transactionHash',
      },
      {
        name: "From Address",
        isSortable: false,
        isFilterable: false,
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
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: 'toAddr',
      },
    ];

    this.generateTableContent = this.generateTableContent.bind(this);

    this.state = {
      pageNumber: 0
    }
  }

  generateTableContent(entityList) 
  {
    let tableContent = [];

    entityList.forEach((entity, i) => 
    {
      // depending on if the enetity is an array or an object, we do different things!
      // [transactionHash, fromAddr, toAddr, value, blockTimestamp, blockNumber]
      tableContent[i] = [];
      if (Array.isArray(entity)) {
        // ------------------------ entity is an array ----------------------------
        tableContent[i][0] = 
        <Cell>
          <NCEntityLabel 
            entityType={NCEntity.BLOCK} 
            entityName={entity[5]}
            entityId={entity[5]}/> 
        </Cell>;
        tableContent[i][1] = <Cell>{ moment.unix(entity[4]).format('MMM D YYYY, hh:mm:ss a') }</Cell>;
        tableContent[i][2] = 
        <Cell>
          <NCEntityLabel 
            entityType={NCEntity.TXN} 
            entityName={entity[0]}
            entityId={entity[0]}/> 
        </Cell>;
        tableContent[i][3] = 
        <Cell>
          <NCEntityLabel 
            entityType={NCEntity.ACCOUNT} 
            entityName={entity[1]}
            entityId={entity[1]}/>
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
          entity[2] ?
          <NCEntityLabel 
            entityType={NCEntity.ACCOUNT} 
            entityName={entity[2]}
            entityId={entity[2]}/>:
          "Contract Creation"
        }
        </Cell>;
      } else {
        // ------------------------ entity is an object ----------------------------
        tableContent[i][0] = 
        <Cell>
          <NCEntityLabel 
            entityType={NCEntity.BLOCK} 
            entityName={entity.blockNumber}
            entityId={entity.blockNumber}/> 
        </Cell>;
        tableContent[i][1] = <Cell>{ moment.unix(entity.blockTimestamp).format('MMM D YYYY, hh:mm:ss a') }</Cell>;
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
      }
    });

    return tableContent;
  }

  selfPageData = (pageNumber) => {
    this.setState({
      pageNumber: pageNumber
    });
  }

  render() {
    const { data, isPaginated, isLoading, onPageCallback } = this.props;
    const list = data.content;
    let tableList = list;

    let paginationObj = null;
    const page = data.page;
    if (isPaginated) {
      if (page == null) {
        if (list.length > PAGE_SIZE) { // we have to paginate
          let numPages = Math.ceil(list.length / PAGE_SIZE);
          let startIdx = this.state.pageNumber * PAGE_SIZE;
          let endIdx = startIdx + PAGE_SIZE;

          tableList = list.slice(startIdx, endIdx);

          paginationObj = 
          <NCPagination
              entityName={"transactions"}

              pageNumber={this.state.pageNumber}
              totalElements={list.length}
              listSize={tableList.length}
              totalPages={numPages}
              pageSize={PAGE_SIZE}
              
              onPageCallback={this.selfPageData}
              isLoading={false}/>;
        }
      } else {
        paginationObj = 
        <NCPagination
            entityName={"transactions"}

            pageNumber={page.number}
            totalElements={page.totalElements}
            listSize={list.length}
            totalPages={page.totalPages}
            pageSize={page.size}
            
            onPageCallback={onPageCallback}
            isLoading={isLoading}/>;
      }
    }

    return (
      <div className={"NCTableWrapper"}>
        { paginationObj }
        <NCTableReact
          data={tableList}
          generateTableContent={this.generateTableContent}
          columnDescriptor={this.columnDescriptor}/>
      </div>
    );
  }
}






























