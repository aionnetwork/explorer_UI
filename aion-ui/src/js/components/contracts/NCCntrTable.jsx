/* eslint-disable */

import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import NCTableReactPaginated from 'components/common/NCTableReactPaginated';

import moment from 'moment';
import { Button, Position, Classes, Popover, Menu, MenuItem, InputGroup, Intent, PopoverInteractionKind } from "@blueprintjs/core";
import { Table, Column, Cell, ColumnHeaderCell, SelectionModes } from "@blueprintjs/table"

import NCTableBase from 'components/common/NCTableBase';
import { NCSortType,NCEntityInfo, NCEntity, nc_LinkToEntity } from 'lib/NCEnums';

import NCPagination from 'components/common/NCPagination';
import NCEntityLabel, {parseClientTransaction} from 'components/common/NCEntityLabel';
import NCTokenLabel from 'components/common/NCTokenLabel';
import { PAGE_SIZE } from 'network/NCNetworkRequests'

import { nc_numFormatterAionCoin } from 'lib/NCUtility';
import * as MSG from 'lib/NCTerms';//MSG.strings.Cntr_list_col1

 const row = {
    height:"100px",
  }

export default class NCCntrTable extends Component 
{
  constructor(props) {
    super(props);

    this.columnDescriptor = 
    [
      {
        name: MSG.strings.Cntr_list_col1,
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        
      },
      
      {
        name: MSG.strings.Cntr_list_col2,
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: MSG.strings.Cntr_list_col3,
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: MSG.strings.Cntr_list_col4, // arrow
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
      }
      /*{
        name: "Holders",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: "Transfers",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: "To Address",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: "To Address",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },*/
    ];
    //console.log(JSON.stringify(this.columnDescriptor));
    this.generateTableContent = this.generateTableContent.bind(this);
  }

 

  generateTableContent(entityList) 
  {
    let tableContent = [];
    //console.log('tkn table');
    entityList.forEach((entity, i) => 
    {
      let Addr = null;
      let name = null;
      let blockNumber = null;
      let creator = null;

      let token = null;
      let symbol = null;
      
      let totalSupply = null;
      let liquidSupply= 0;
      let description = " ";
      let decimal = null;
      let transactions = 0;
      let holders = 1;

      let transaction = null;
      let contractHash = null;
      let fromAddr = null;
      let toAddr = null;
      let blockTimestamp = null;
      let value = null;

      //console.log(JSON.stringify(entity));

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
        Addr = entity.contractAddr;
        name = entity.contractName;
        blockNumber = entity.blockNumber;
        creator =  entity.contractCreatorAddr;

        token = entity.name;
        symbol = entity.symbol;
        
        totalSupply = entity.totalSupply;
        liquidSupply= entity.liquidSupply;
        decimal = entity.granularity;
        transaction = entity.contractTxHash;

        transactions = entity.totalTransactions;
        holders = entity.totalAccounts;

        fromAddr = entity.fromAddr;
        toAddr = entity.toAddr;
        blockTimestamp = entity.blockTimestamp;
        value = entity.value;
      }

      // Generate tableContent
      tableContent[i] = [];
      tableContent[i][0] = 
      <Cell copy={Addr} link={'#'+NCEntityInfo[NCEntity.CNTR].absoluteUrl+''+Addr}>
        
        
        <NCEntityLabel 
            entityType={NCEntity.CNTR} 
            entityId={Addr} /> 
        
        
       </Cell>
      ;
      //tableContent[i][1] = <Cell>{ name }</Cell>;
     
      tableContent[i][1] = 
      <Cell copy={blockNumber} link={'#'+NCEntityInfo[NCEntity.BLOCK].absoluteUrl+''+blockNumber}>
           <NCEntityLabel 
          entityType={NCEntity.BLOCK} 
          entityName={blockNumber}
          entityId={blockNumber}/> 
         
      </Cell>;
      tableContent[i][2] = 
      <Cell copy={creator} link={'#'+NCEntityInfo[NCEntity.ACCOUNT].absoluteUrl+''+creator}>
          <NCEntityLabel 
          entityType={NCEntity.ACCOUNT} 
         
          entityId={creator}/> 
        
      </Cell>;
      tableContent[i][3] = 
      <Cell copy={transaction} link={'#'+NCEntityInfo[NCEntity.TXN].absoluteUrl+''+transaction}>
          <NCEntityLabel 
          entityType={NCEntity.TXN} 
          
          entityId={transaction}/> 
        
      </Cell>;
      //tableContent[i][5] = <Cell>{ holders }</Cell>;
      //tableContent[i][6] = <Cell>{ transactions }</Cell>;
     
    });

    return tableContent; 
  }
  
  render() {
    const { data, isPaginated, isLoading, onPageCallback, isLatest=false } = this.props;
    //console.log('data'+isPaginated);
    return (
      <NCTableReactPaginated
        data={data}
        onPageCallback={onPageCallback}
        isLoading={isLoading}
        isPaginated={isPaginated}
        entityName={"Contracts"}
        generateTableContent={this.generateTableContent}
        columnDescriptor={this.columnDescriptor}
        isLatest={isLatest}/>
    );
  }
}






























