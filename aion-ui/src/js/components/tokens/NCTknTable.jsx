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
import NCTokenLabel from 'components/common/NCTokenLabel';
import { PAGE_SIZE } from 'network/NCNetworkRequests'

import { nc_numFormatterAionCoin, nc_decimalPrettify, nc_addDecimal } from 'lib/NCUtility';
import * as MSG from 'lib/NCTerms';

 const row = {
    height:"100px",
  }

export default class NCTknTable extends Component 
{
  constructor(props) {
    super(props);

    this.columnDescriptor = 
    [
      {
        name: MSG.strings.Tkn_list_col1,
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: MSG.strings.Tkn_list_col2,
        isSortable: false,
        isFilterable: false,
        width: 100,
        flex: false,
        objPath: null,
      },
      {
        name: MSG.strings.Tkn_list_col3,
        isSortable: false,
        isFilterable: false,
        width: 150,
        flex: false,
        objPath: null,
      },
      {
        name: MSG.strings.Tkn_list_col4,
        isSortable: false,
        isFilterable: false,
        width: 150,
        flex: false,
        objPath: null,
      },
      {
        name: MSG.strings.Tkn_list_col5,
        isSortable: false,
        isFilterable: false,
        width: 200,
        flex: false,
        objPath: null,
      },
      {
        name: MSG.strings.Tkn_list_col6, // arrow
        isSortable: false,
        isFilterable: false,
        width: 200,
        flex: false,
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
      let blockNumber = null;
      let token = null;
      let symbol = null;
      let Addr = null;
      let totalSupply = 0;
      let liquidSupply= 0;
      let description = " ";
      let decimal = null;
      let transaction = 0;
      let holder = 1;

      let contractHash = null;
      let fromAddr = null;
      let toAddr = null;
      let blockTimestamp = null;
      let value = null;

      // [transactionHash, fromAddr, toAddr, value, blockTimestamp, blockNumber]
      if (Array.isArray(entity)) {
        blockNumber = entity[5];
        token = entity[0];
        symbol = entity[1];
        fromAddr = entity[1];
        toAddr = entity[2];
        blockTimestamp = entity[4];
        value = entity[3];
      } else {
        blockNumber = entity.blockNumber;

        token = entity.name;
        symbol = entity.symbol;
        Addr = entity.contractAddr;
        totalSupply = entity.totalSupply;
        liquidSupply= entity.liquidSupply;
        decimal = entity.granularity;
        transaction = entity.transactionHash;
        holder = entity.creatorAddress;

        fromAddr = entity.fromAddr;
        toAddr = entity.toAddr;
        blockTimestamp = entity.blockTimestamp;
        value = entity.value;
      }

      // Generate tableContent
      tableContent[i] = [];
      tableContent[i][0] = 
      <Cell copy={token+" ("+symbol+") "+ Addr+" "+description} link={'#'+NCEntityInfo[NCEntity.TKN].absoluteUrl+''+Addr} truncated={false}
       wrapText={true}>
        
        
        <NCEntityLabel 
          entityType={NCEntity.TKN} 
          entityName={token+" ("+symbol+")"}
          
          entityId={Addr}/>
        
        
       </Cell>
      ;
      tableContent[i][1] = <Cell copy={ decimal }>{ decimal }</Cell>;
      tableContent[i][2] = <Cell copy={ totalSupply }>

        {nc_addDecimal(totalSupply.toString(),entity.tokenDecimal,8)}
      </Cell>;
      tableContent[i][3] = 
      <Cell copy={liquidSupply}>

       {nc_addDecimal(liquidSupply.toString(),entity.tokenDecimal,8)}
         
      </Cell>;
      tableContent[i][4] = 
      <Cell copy={holder} link={'#'+NCEntityInfo[NCEntity.ACCOUNT].absoluteUrl+''+holder}>
          <NCEntityLabel 
          entityType={NCEntity.ACCOUNT} 
          
          entityId={holder}/> 
        
      </Cell>;
      tableContent[i][5] = 
      <Cell copy={transaction} link={'#'+NCEntityInfo[NCEntity.TXN].absoluteUrl+''+transaction}>
          <NCEntityLabel 
          entityType={NCEntity.TXN} 
          
          entityId={transaction}/> 
        
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
        entityName={"Tokens"}
        generateTableContent={this.generateTableContent}
        columnDescriptor={this.columnDescriptor}
        isLatest={isLatest}/>
    );
  }
}






























