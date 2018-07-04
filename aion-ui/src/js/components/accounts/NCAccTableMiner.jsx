/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';
import { Cell } from "@blueprintjs/table"

import NCEntityLabel from 'components/common/NCEntityLabel';
import NCPagination from 'components/common/NCPagination';
import NCTableReactPaginated from 'components/common/NCTableReactPaginated';

import { NCEntity } from 'lib/NCEnums';
import { nc_numFormatter } from 'lib/NCUtility';
import { PAGE_SIZE } from 'network/NCNetworkRequests'

import NCLink from 'components/common/NCLink';

export default class NCAccTableMiner extends Component 
{
  constructor(props) {
    super(props);

    this.columnDescriptor = 
    [
      {
        name: "Address",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
      },
      {
        name: "Avg Txn Per Mined Block",
        isSortable: false,
        isFilterable: false,
        width: 200,
        flex: false,
      },
      {
        name: "% Blocks Found (Last 24hr)",
        isSortable: false,
        isFilterable: false,
        width: 200,
        flex: false,
      }
    ];
  }

  generateTableContent = (entityList) => 
  {
    let tableContent = [];
    // [addr, avg_txnPerBlock, percentBlocksMined]

    entityList.forEach((entity, i) => 
    {
      tableContent[i] = [];
      tableContent[i][0] = 
        <Cell>
          <NCEntityLabel 
            entityType={NCEntity.ACCOUNT} 
            entityId={entity[0]}/> 
        </Cell>;
      tableContent[i][1] = <Cell>{ nc_numFormatter(entity[1], 2) }</Cell>;
      tableContent[i][2] = <Cell>{ nc_numFormatter(entity[2], 2)+"%" }</Cell>;        
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
        entityName={"accounts"}
        generateTableContent={this.generateTableContent}
        columnDescriptor={this.columnDescriptor}
        isLatest={isLatest}/>
    );
  }
}






























