/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';
import { Cell } from "@blueprintjs/table"

import NCEntityLabel from 'components/common/NCEntityLabel';

import NCTableReactPaginated from 'components/common/NCTableReactPaginated';

import { NCEntity, NCEntityInfo } from 'lib/NCEnums';

export default class NCAccTable extends Component 
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
        name: "Account",
        isSortable: false,
        isFilterable: false,
        width: 200,
        flex: false,
        objPath: 'holderAddr',
      },
      {
        name: "Contract",
        isSortable: false,
        isFilterable: false,
        width: 90,
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
      },
      
    ];
  }

  generateTableContent = (entityList) => 
  {
    let tableContent = [];

    entityList.forEach((entity, i) => 
    {
      
      let blockNumber = null;

       if (Array.isArray(entity)) {
        blockNumber = entity[1];


      } else {
        blockNumber = entity.blockNumber;

      }

      tableContent[i] = [];  
      tableContent[i][0] = 
      <Cell copy={blockNumber} link={'#'+NCEntityInfo[NCEntity.BLOCK].absoluteUrl+''+blockNumber} >
        <NCEntityLabel 
          entityType={NCEntity.BLOCK} 
          entityName={blockNumber}
          entityId={blockNumber}/> 
      </Cell>;
      tableContent[i][1] = 
      <Cell copy={holderAddr} link={'#'+NCEntityInfo[NCEntity.ACCOUNT].absoluteUrl+''+holderAddr}>
        <NCEntityLabel 
          entityType={NCEntity.ACCOUNT} 
          entityName={holderAddr}
          entityId={holderAddr}/> 
      </Cell>;
      tableContent[i][2] = 
      <Cell copy={contractAddr} link={'#'+NCEntityInfo[NCEntity.ACCOUNT].absoluteUrl+''+contractAddr}>
        <NCEntityLabel 
          entityType={NCEntity.CONTRACT} 
          entityName={contractAddr}
          entityId={contractAddr}/> 
      </Cell>;

      
      tableContent[i][3] = <Cell copy={ balance }>{ balance }</Cell>;
      
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





























