/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';
import { Cell } from "@blueprintjs/table"

import NCEntityLabel from 'components/common/NCEntityLabel';
import NCPagination from 'components/common/NCPagination';
import NCTableReact from 'components/common/NCTableReact';

import { NCEntity } from 'lib/NCEnums';
import { nc_numFormatterAionCoin, nc_numFormatter } from 'lib/NCUtility';
import { PAGE_SIZE } from 'network/NCNetworkRequests'

import NCLink from 'components/common/NCLink';

export default class NCAccTable extends Component 
{
  constructor(props) {
    super(props);

    this.columnDescriptor = 
    [
      {
        name: "Balance",
        isSortable: true,
        isFilterable: true,
        width: 150,
        flex: false,
        objPath: 'balance',
      },
      {
        name: "Transaction Count",
        isSortable: true,
        isFilterable: true,
        width: 150,
        flex: false,
        objPath: 'numTransactions',
      },
      {
        name: "Blocks Mined",
        isSortable: true,
        isFilterable: true,
        width: 150,
        flex: false,
        objPath: 'numBlocksMined',
      },
      {
        name: "Address",
        isSortable: true,
        isFilterable: true,
        width: null,
        flex: true,
        objPath: 'addr',
      },
      
    ];
  }

  generateTableContent = (entityList) => 
  {
    let tableContent = [];

    entityList.forEach((entity, i) => 
    {
      tableContent[i] = [];
      tableContent[i][0] = <Cell>{ nc_numFormatterAionCoin(entity.balance) }</Cell>;
      tableContent[i][1] = 
        <Cell>
          <NCLink 
            link={"/transactions?account=" + entity.addr} 
            title={nc_numFormatter(entity.numTransactions)}
            enabled={entity.numTransactions && entity.numTransactions > 0}/>
        </Cell>;
      tableContent[i][2] = 
        <Cell>
          <NCLink 
            link={"/blocks?account=" + entity.addr} 
            title={nc_numFormatter(entity.numBlocksMined, 3)}
            enabled={entity.numBlocksMined && entity.numBlocksMined > 0} />
        </Cell>;
      tableContent[i][3] = 
        <Cell>
          <NCEntityLabel 
            entityType={NCEntity.ACCOUNT} 
            entityId={entity.addr}/> 
        </Cell>;
    });

    return tableContent;
  }

  render() {
    const { data, isPaginated, isLoading, onPageCallback } = this.props;
    const page = data.page;
    const list = data.content;

    return (
      <div className={"NCTableWrapper"}>
      {
        (isPaginated) &&
        <NCPagination
          entityName={"accounts"}

          pageNumber={page.number}
          totalElements={page.totalElements}
          listSize={list.length}
          totalPages={page.totalPages}
          pageSize={page.size}
          
          onPageCallback={onPageCallback}
          isLoading={isLoading}/>
      }
        <NCTableReact
          data={list}
          generateTableContent={this.generateTableContent}
          columnDescriptor={this.columnDescriptor}/>
      </div>
    );
  }
}






























