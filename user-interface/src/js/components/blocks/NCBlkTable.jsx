/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';
import { Cell } from "@blueprintjs/table"

import NCEntityLabel from 'components/common/NCEntityLabel';
import NCPagination from 'components/common/NCPagination';
import NCTableReact from 'components/common/NCTableReact';
import NCLink from 'components/common/NCLink';

import { NCEntity } from 'lib/NCEnums';
import { nc_numFormatter, nc_numFormatterBytes, nc_numFormatterAionCoin, nc_hexPrefix } from 'lib/NCUtility';

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
        flex: true,
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
        name: "Txn Count",
        isSortable: false,
        isFilterable: false,
        width: 90,
        flex: false,
        objPath: 'numTransactions',
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

    this.state = {
      pageNumber: 0
    }
  }

  generateTableContent = (entityList) => 
  {
    let tableContent = [];

    entityList.forEach((entity, i) => 
    {
      // depending on if the enetity is an array or an object, we do different things!
      // blockHash, blockNumber, difficulty, nrgConsumed, nrgLimit, size, blockTimestamp, totalDifficulty, numTransactions
      tableContent[i] = [];
      if (Array.isArray(entity)) {
        // ------------------------ entity is an array ----------------------------
        tableContent[i][0] = 
        <Cell>
          <NCEntityLabel 
            entityType={NCEntity.BLOCK} 
            entityName={entity[1]}
            entityId={entity[1]}/> 
        </Cell>;
        tableContent[i][1] = <Cell>{ moment.unix(entity[6]).format('MMM D YYYY, hh:mm:ss a') }</Cell>;
        tableContent[i][2] = 
        <Cell>
          <NCLink 
            link={"/transactions?block=" + entity[1]} 
            title={entity[8]} 
            enabled={ entity[8] > 0 }/>
        </Cell>;
        tableContent[i][3] = <Cell>{ nc_numFormatter(entity[3], 2) }</Cell>;
        tableContent[i][4] = <Cell>{entity[2]}</Cell>;
        tableContent[i][5] = <Cell>{ nc_numFormatterBytes(entity[5], 2) }</Cell>;
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
          <NCLink 
            link={"/transactions?block=" + entity.blockNumber} 
            title={entity.numTransactions} 
            enabled={ entity.numTransactions > 0 }/>
        </Cell>;
        tableContent[i][3] = <Cell>{ nc_numFormatter(entity.nrgConsumed, 2) }</Cell>;
        tableContent[i][4] = <Cell>{entity.difficulty}</Cell>;
        tableContent[i][5] = <Cell>{ nc_numFormatterBytes(entity.size, 2) }</Cell>;
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
              entityName={"blocks"}

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
            entityName={"blocks"}

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





























