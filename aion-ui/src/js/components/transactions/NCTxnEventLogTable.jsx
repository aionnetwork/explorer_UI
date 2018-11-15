/* eslint-disable */

import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import NCTableReactPaginated from 'components/common/NCTableReactPaginated';

import moment from 'moment';
import { Button, Position, Classes, Popover, Menu, MenuItem, InputGroup, Intent, PopoverInteractionKind } from "@blueprintjs/core";
import { Table, Column, Cell, ColumnHeaderCell, SelectionModes } from "@blueprintjs/table"

import NCTableBase from 'components/common/NCTableBase';
import { NCSortType, NCEntityInfo, NCEntity, nc_LinkToEntity } from 'lib/NCEnums';

import NCPagination from 'components/common/NCPagination';
import NCEntityLabel, {parseClientTransaction} from 'components/common/NCEntityLabel';
import { PAGE_SIZE } from 'network/NCNetworkRequests'

import { nc_numFormatterAionCoin } from 'lib/NCUtility';

export default class NCTxnEventLogTable extends Component 
{
  constructor(props) {
    super(props);

    this.columnDescriptor = 
    [
      {
        name: "Logs",
        isSortable: false,
        isFilterable: false,
        width: 400,
        flex: true,
        objPath: null,
      }
      
      
    ];

    this.generateTableContent = this.generateTableContent.bind(this);
  }

  generateTableContent(entityList) 
  {
    let tableContent = [];

    entityList.forEach((entity, i) => 
    {
     
      let transactionHash = null;
     
     if (Array.isArray(entity)) {
        
        transactionHash = entity[0];
        
      } else {
       
        transactionHash = entity.transactionHash;        
        
      }

      // Generate tableContent
      tableContent[i] = [];
      tableContent[i][0] = 
      <Cell copy={blockNumber} link={'#'+NCEntityInfo[NCEntity.BLOCK].absoluteUrl+''+blockNumber}>
        <NCEntityLabel 
          entityType={NCEntity.BLOCK} 
          entityName={blockNumber}
          entityId={blockNumber}/> 
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
        entityName={"transactions"}
        generateTableContent={this.generateTableContent}
        columnDescriptor={this.columnDescriptor}
        isLatest={isLatest}/>
    );
  }
}






























