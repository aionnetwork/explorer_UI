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
        width: null,
        flex: true,
        objPath: null,
      }
      
      
    ];

    this.ncRowHeight = [];

    this.generateTableContent = this.generateTableContent.bind(this);
  }

  generateTableContent(entityList) 
  {
    let tableContent = [];
    console.log(JSON.stringify(entityList));

    entityList.forEach((entity, i) => 
    {
     
      let transactionHash = null;
     
     if (Array.isArray(entity)) {
        
        transactionHash = entity[0];
        
      } else {
       
        transactionHash = entity.transactionHash;        
        
      }
      const cell = {'height':'300px'}
      // Generate tableContent
      tableContent[i] = [];
      tableContent[i][0] = 
      <Cell truncated={false} wrapText={true} copy={'something coppied'}> 
      name Transfer (index_topic_1 address _from, index_topic_2 address _to, uint256 _value)<br/>
      Topics  [0] 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef<br/>
              [1] 0x000000000000000000000000d2842acffff364b7653a10761e58640d9a3d6201<br/>
              [2] 0x00000000000000000000000000000000000000000000eb50ed425cc0dce13dbc<br/>
      data    000000000000000000000000000000000000000000000000002386f26fc10000<br/>

        
      </Cell>;
     
      this.ncRowHeight.push(60+30*4);//this will calculate the height of the row based on the input size
      
    });

    return tableContent;
  }
  
  render() {
    const { data, isPaginated, isLoading, onPageCallback, isLatest=false } = this.props;
       // console.log(data);
    return (
      <NCTableReactPaginated
        data={data}
        rowHeights= {this.ncRowHeight}
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






























