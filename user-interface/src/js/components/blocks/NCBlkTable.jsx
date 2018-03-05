/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';
import { Cell } from "@blueprintjs/table"

import NCEntityLabel from 'components/common/NCEntityLabel';
import NCPagination from 'components/common/NCPagination';
import NCTableReact from 'components/common/NCTableReact';
import NCLink from 'components/common/NCLink';

import { NCEntity } from 'lib/NCEnums';
import { nc_numFormatterBytes, nc_numFormatterAionCoin, nc_hexPrefix } from 'lib/NCUtility';

import { PAGE_SIZE } from 'network/NCNetworkRequests'

export default class NCBlkTable extends Component 
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
        flex: false,
        objPath: 'blockNumber',
      },
      {
        name: "Timestamp",
        isSortable: false,
        isFilterable: false,
        width: 150,
        flex: false,
        objPath: 'timestampVal',
      },
      {
        name: "Txn Count",
        isSortable: false,
        isFilterable: false,
        width: 90,
        flex: false,
        objPath: 'numTransactions',
      },
      {
        name: "Miner Address",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: 'minerAddress',
      },
      {
        name: "Nrg Consumed",
        isSortable: false,
        isFilterable: false,
        width: 110,
        flex: false,
        objPath: 'nrgConsumed',
      },
      {
        name: "Difficulty",
        isSortable: false,
        isFilterable: false,
        width: 110,
        flex: false,
        objPath: 'difficulty',
      },
      {
        name: "Block Size",
        isSortable: false,
        isFilterable: false,
        width: 110,
        flex: false,
        objPath: 'size',
      },
    ];
  }

  generateTableContent = (entityList) => 
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
        <NCLink 
          link={"/transactions?block=" + entity.blockHash} 
          title={entity.numTransactions} 
          enabled={ entity.numTransactions > 0 }/>
      </Cell>;
      tableContent[i][3] = 
      <Cell>
        <NCEntityLabel 
          entityType={NCEntity.ACCOUNT} 
          entityName={nc_hexPrefix(entity.minerAddress)}
          entityId={entity.minerAddress}/> 
      </Cell>;
      tableContent[i][4] = <Cell>{ nc_numFormatterAionCoin(entity.nrgConsumed) }</Cell>;
      tableContent[i][5] = <Cell>{entity.difficulty}</Cell>;
      tableContent[i][6] = <Cell>{ nc_numFormatterBytes(entity.size, 2) }</Cell>;
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
          entityName={"blocks"}

          pageNumber={page.number}
          totalElements={page.totalElements}
          listSize={list.length}
          totalPages={page.totalPages}
          pageSize={page.size}

          currentListSize={list.length}
          
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





























