/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';
import { Cell } from "@blueprintjs/table"

import NCEntityLabel from 'components/common/NCEntityLabel';
import NCPagination from 'components/common/NCPagination';
import NCTableReactPaginated from 'components/common/NCTableReactPaginated';

import { NCEntity,NCEntityInfo } from 'lib/NCEnums';
import { ga_key } from 'lib/NCData';
import { nc_numFormatter } from 'lib/NCUtility';
import { PAGE_SIZE } from 'network/NCNetworkRequests'

import NCLink from 'components/common/NCLink';

import ReactGA from 'react-ga';
ReactGA.initialize(ga_key);

export default class NCAccTableMiner extends Component 
{
  constructor(props) {
    super(props);

    ReactGA.event({
      category: 'Accounts',
      action: 'Viewed Miner'
    }); 

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
    
    entityList.forEach((entity, i) => 
    {
      tableContent[i] = [];
      tableContent[i][0] = 
        <Cell copy={entity[0]} link={'#'+NCEntityInfo[NCEntity.ACCOUNT].absoluteUrl+''+entity[0]>
          <NCEntityLabel 
            entityType={NCEntity.ACCOUNT} 
            entityId={entity[0]}/> 
        </Cell>;
      tableContent[i][1] = <Cell copy={ nc_numFormatter(entity[1], 2) }>{ nc_numFormatter(entity[1], 2) }</Cell>;
      tableContent[i][2] = <Cell copy={ nc_numFormatter(entity[2], 2)+"%" }>{ nc_numFormatter(entity[2], 2)+"%" }</Cell>;        
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






























