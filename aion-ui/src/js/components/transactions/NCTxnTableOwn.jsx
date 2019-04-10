/* eslint-disable */

import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import NCTableReactPaginated from 'components/common/NCTableReactPaginated';

import moment from 'moment';
import { Button, Position, Classes, Popover, Menu, MenuItem, InputGroup, Intent, PopoverInteractionKind } from "@blueprintjs/core";
import { Table, Column, Cell, ColumnHeaderCell, SelectionModes } from "@blueprintjs/table"

import NCTableBase from 'components/common/NCTableBase';
import { NCSortType, NCEntity,NCEntityInfo, nc_LinkToEntity } from 'lib/NCEnums';

import NCPagination from 'components/common/NCPagination';
import NCEntityLabel, {parseClientTransaction} from 'components/common/NCEntityLabel';
import { PAGE_SIZE } from 'network/NCNetworkRequests'

import { nc_numFormatterAionCoin } from 'lib/NCUtility';

export default class NCTxnTableOwn extends Component 
{
  constructor(props) {
    super(props);

    this.columnDescriptor = 
    [
      {
        name: MSG.Txn_list_own_col1,
        isSortable: false,
        isFilterable: false,
        width: 100,
        flex: false,
        objPath: null,
      },
      {
        name: MSG.Txn_list_own_col2,
        isSortable: false,
        isFilterable: false,
        width: 160,
        flex: false,
        objPath: null,
      },
      {
        name: MSG.Txn_list_own_col3,
        isSortable: false,
        isFilterable: false,
        width: 100,
        flex: false,
        objPath: null,
      },
      {
        name: MSG.Txn_list_own_col4,
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: MSG.Txn_list_own_col5,
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: "", // arrow
        isSortable: false,
        isFilterable: false,
        width: 40,
        flex: false,
      },
      {
        name: MSG.Txn_list_own_col6,
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
    ];

    this.generateTableContent = this.generateTableContent.bind(this);
  }

  generateTableContent(entityList) 
  {
    let tableContent = [];

    entityList.forEach((entity, i) => 
    {
      let blockNumber = null;
      let transactionHash = null;
      let fromAddr = null;
      let toAddr = null;
      let blockTimestamp = null;
      let value = null;
      let contractAddr = null;

      // [transactionHash, fromAddr, toAddr, value, blockTimestamp, blockNumber]
      if (Array.isArray(entity)) {
        blockNumber = entity[5];
        transactionHash = entity[0];
        fromAddr = entity[1];
        toAddr = entity[2];
        blockTimestamp = entity[4];
        value = entity[3];
      } else {
        blockNumber = entity.blockNumber;
        transactionHash = entity.transactionHash;
        fromAddr = entity.fromAddr;
        toAddr = entity.toAddr;
        contractAddr = entity.contractAddr;
        blockTimestamp = entity.blockTimestamp;
        value = entity.value;
      }

      let isFrom = false;
      if (this.props.ownAddr == fromAddr)
        isFrom = true;

      let isTo = false;
      if (this.props.ownAddr == toAddr)
        isTo = true;

      // Generate tableContent
      tableContent[i] = [];
      tableContent[i][0] = 
      <Cell copy={blockNumber} link={'#'+NCEntityInfo[NCEntity.BLOCK].absoluteUrl+''+blockNumber}>
        <NCEntityLabel 
          entityType={NCEntity.BLOCK} 
          entityName={blockNumber}
          entityId={blockNumber}/> 
      </Cell>;
      tableContent[i][1] = <Cell copy={ moment.unix(blockTimestamp).format('MMM D YYYY, hh:mm:ss a') }>{ moment.unix(blockTimestamp).format('MMM D YYYY, hh:mm:ss a') }</Cell>;
      tableContent[i][2] = <Cell copy={ value ? nc_numFormatterAionCoin(value, 4, true) : 0 }>{ value ? value : 0 }</Cell>;
      tableContent[i][3] = 
      <Cell copy={transactionHash} link={'#'+NCEntityInfo[NCEntity.TXN].absoluteUrl+''+transactionHash}>
        <NCEntityLabel 
          entityType={NCEntity.TXN} 
          
          entityId={transactionHash}/> 
      </Cell>;
      tableContent[i][4] = 
      <Cell copy={fromAddr} link={'#'+NCEntityInfo[NCEntity.ACCOUNT].absoluteUrl+''+fromAddr} intent={ isFrom ? Intent.PRIMARY : Intent.NONE } tooltip={ isFrom ? MSG.Txn_own : undefined }>
        <NCEntityLabel 
          entityType={NCEntity.ACCOUNT} 
          
          entityId={fromAddr}
          linkActive={isFrom ? false : true}/>
      </Cell>;
      tableContent[i][5] = 
      <Cell >
        <div className="arrow-cell">
          <span className="pt-icon-standard pt-icon-arrow-right"/>
        </div>
      </Cell>;
      tableContent[i][6] = 
      <Cell copy={toAddr} intent={ isTo ? Intent.PRIMARY : Intent.NONE } tooltip={ isTo ? MSG.Txn_own : undefined }>
       {
            toAddr ? 
                <NCEntityLabel 
                  entityType={NCEntity.ACCOUNT} 
                  entityId={toAddr}/> :
                contractAddr ?
                <NCEntityLabel 
                  entityType={NCEntity.CNTR} 
                  entityId={contractAddr}/> :
                "Contract Creation"     

      }
      </Cell>;
    });

    return tableContent;
  }
  
  render() {
    const { ownAddr, data, isPaginated, isLoading, onPageCallback, isLatest=false } = this.props;
    
    return (
      <NCTableReactPaginated
        calFilter={true}
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






























