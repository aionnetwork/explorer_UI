/* eslint-disable */

import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import NCTableReactPaginated from 'components/common/NCTableReactPaginated';

import moment from 'moment';
import {BigNumber} from 'bignumber.js';
import { Button, Position, Classes, Popover, Menu, MenuItem, InputGroup, Intent, PopoverInteractionKind } from "@blueprintjs/core";
import { Table, Column, Cell, ColumnHeaderCell, SelectionModes } from "@blueprintjs/table"

import NCTableBase from 'components/common/NCTableBase';
import { NCSortType, NCEntityInfo, NCEntity, nc_LinkToEntity } from 'lib/NCEnums';

import NCPagination from 'components/common/NCPagination';
import NCEntityLabel, {parseClientTransaction} from 'components/common/NCEntityLabel';
import NCLink from 'components/common/NCLink';
import { PAGE_SIZE } from 'network/NCNetworkRequests'
import { nc_numFormatterAionCoin, nc_decimalPrettify, nc_numFormatterACSensitive, nc_numFormatter } from 'lib/NCUtility';
//import { nc_numFormatterAionCoin } from 'lib/NCUtility';
import {strings as MSG} from 'lib/NCTerms';

export default class NCTxnTableOwnTransfer extends Component 
{
  constructor(props) {
    super(props);

    this.columnDescriptor = 
    [
      {
        name: MSG.Txn_list_own_trn_col1,
        isSortable: false,
        isFilterable: false,
        width: 100,
        flex: false,
        objPath: null,
      },
      {
        name: MSG.Txn_list_own_trn_col2,
        isSortable: false,
        isFilterable: false,
        width: 160,
        flex: false,
        objPath: null,
      },
      {
        name: MSG.Txn_list_own_trn_col3,
        isSortable: false,
        isFilterable: false,
        width: 100,
        flex: false,
        objPath: null,
      },
      /*{
        name: MSG.Txn_list_own_trn_col4,
        isSortable: false,
        isFilterable: false,
        width: 100,
        flex: false,
        objPath: null,
      },*/
      {
        name: MSG.Txn_list_own_trn_col5,
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: MSG.Txn_list_own_trn_col6,
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
        name: MSG.Txn_list_own_trn_col7,
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: MSG.Txn_list_own_trn_col8,
        isSortable: false,
        isFilterable: false,
        width: 100,
        flex: true,
        objPath: null,
      },
      {
        name: MSG.Txn_list_own_trn_col9,
        isSortable: false,
        isFilterable: false,
        width: 60,

        objPath: null,
      },
      {
        name: MSG.Txn_list_own_trn_col10,
        isSortable: false,
        isFilterable: false,
        width: 60,

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
      let rawValue = null;
      let transferTimestamp =null;
      let transferIndex =null;

      let status =null;
      let type =null;
      let nonce =null;
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
        transferTimestamp = entity.blockTimestamp;
        value = (entity.value) ? nc_decimalPrettify(entity.value) : nc_decimalPrettify(entity.valueTransferred);//BigNumber(String(entity.valueTransferred), 16).toString(10);//entity.valueTransferred;
        transactionHash = entity.transactionHash;//let bal = nc_numFormatterACSensitive(entity.balance);

        transferIndex = entity.internalTransactionIndex;
        status = entity.rejected? "Rejected" : "Successful";
        type = entity.type;
        nonce = entity.nonce;
        
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
      tableContent[i][1] = <Cell copy={ moment.unix(transferTimestamp).format('MMM D YYYY, hh:mm:ss a') }>{ moment.unix(transferTimestamp).format('MMM D YYYY, hh:mm:ss a') }</Cell>;
      tableContent[i][2] = <Cell copy={ value ? value : 0 }>{ value ? value : 0 }</Cell>;
      //tableContent[i][3] = <Cell copy={ txn ? txn : 0 }>{ txn ? txn : 0 }</Cell>;
      tableContent[i][3] = 
      <Cell copy={transactionHash} link={'#'+NCEntityInfo[NCEntity.TXN].absoluteUrl+''+transactionHash} intent={ isFrom ? Intent.PRIMARY : Intent.NONE } >
        <NCEntityLabel 
          entityType={NCEntity.TXN} 
          
          entityId={transactionHash}
          linkActive={true}/>
      </Cell>;
      tableContent[i][4] = 
      <Cell copy={fromAddr} link={'#'+NCEntityInfo[NCEntity.SEARCH].absoluteUrl+''+fromAddr} intent={ isFrom ? Intent.PRIMARY : Intent.NONE } tooltip={ isFrom ? "own account" : undefined }>
        <NCEntityLabel 
          entityType={NCEntity.ACCOUNT} 
          
          entityId={fromAddr}
          linkActive={isFrom ? false : true}/>
      </Cell>;
      tableContent[i][5] = 
      <Cell>
        <div className="arrow-cell">
          <span className="pt-icon-standard pt-icon-arrow-right"/>
        </div>
      </Cell>;
      tableContent[i][6] = 
      <Cell copy={toAddr} intent={ isTo ? Intent.PRIMARY : Intent.NONE } tooltip={ isTo ? "own account" : undefined }>
      {
        toAddr ?
        <NCEntityLabel 
          entityType={NCEntity.ACCOUNT} 
          
          entityId={toAddr}
          linkActive={isTo ? false : true}/>:
        "Contract Creation"
      }
      </Cell>;

      tableContent[i][7] =
      <Cell copy={toAddr} intent={ isTo ? Intent.PRIMARY : Intent.NONE } tooltip={ isTo ? "own account" : undefined }>
      <NCLink link={"/transaction/"+transactionHash+"/"+transferIndex} title= {"("+ status +") View details"}/>
      </Cell>;
      tableContent[i][8] =
      <Cell copy={toAddr} intent={ isTo ? Intent.PRIMARY : Intent.NONE } tooltip={ isTo ? "own account" : undefined }>
      {
        type
      }
      </Cell>;
      tableContent[i][9] =
      <Cell copy={toAddr} intent={ isTo ? Intent.PRIMARY : Intent.NONE } tooltip={ isTo ? "own account" : undefined }>
      {
        nonce
      }
      </Cell>;
    });

    return tableContent;
  }
  
  render() {
    const { ownAddr, data, isPaginated, isLoading, onPageCallback, isLatest=false } = this.props;
    
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






























