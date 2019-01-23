/* eslint-disable */

import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import NCTableReactPaginated from 'components/common/NCTableReactPaginated';

import moment from 'moment';
import { Button, Position, Classes, Popover, Menu, MenuItem, InputGroup, Intent, PopoverInteractionKind } from "@blueprintjs/core";
import { Table, Column, Cell, ColumnHeaderCell, SelectionModes } from "@blueprintjs/table";

import NCTableBase from 'components/common/NCTableBase';
import { NCSortType, NCEntityInfo, NCEntity, nc_LinkToEntity } from 'lib/NCEnums';

import NCPagination from 'components/common/NCPagination';
import NCEntityLabel, {parseClientTransaction} from 'components/common/NCEntityLabel';
import { PAGE_SIZE } from 'network/NCNetworkRequests';

import { nc_numFormatterAionCoin } from 'lib/NCUtility';

export default class NCTxnTable extends Component 
{
  constructor(props) {
    super(props);

    this.columnDescriptor = 
    [
      {
        name: "Block #",
        isSortable: false,
        isFilterable: false,
        width: 100,
        flex: false,
        objPath: null,
      },
      {
        name: "Timestamp",
        isSortable: false,
        isFilterable: false,
        width: 160,
        flex: false,
        objPath: null,
      },
      {
        name: "Value",
        isSortable: false,
        isFilterable: false,
        width: 150,
        flex: false,
        objPath: null,
      },
      {
        name: "Transaction Hash",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: "From Address",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: "Status", // arrow
        isSortable: false,
        isFilterable: false,
        width: 100,
        flex: false,
      },
      {
        name: "To Address",
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
      let contractAddr = null;
      let blockTimestamp = null;
      let timestamp = null;
      let value = null;
      let status = "";

      // [transactionHash, fromAddr, toAddr, value, blockTimestamp, blockNumber]
      if (Array.isArray(entity)) {
        blockNumber = entity[5];
        transactionHash = entity[0];
        fromAddr = entity[1];
        toAddr = entity[2];
        timestamp = entity[4];
        value = entity[3];
      } else {
        blockNumber = entity.blockNumber;
        transactionHash = entity.transactionHash;
        fromAddr = entity.fromAddr;
        toAddr = entity.toAddr;
        contractAddr = entity.contractAddr;
        blockTimestamp = entity.blockTimestamp;
        value = entity.value;
        status = entity.txError;
        
      }

      //console.log(status);
      //console.log(timestamp);
      // Generate tableContent
      tableContent[i] = [];
      tableContent[i][0] = 
      <Cell copy={blockNumber} link={'#'+NCEntityInfo[NCEntity.BLOCK].absoluteUrl+''+blockNumber}>
        <NCEntityLabel 
          entityType={NCEntity.BLOCK} 
          entityName={blockNumber}
          entityId={blockNumber}/> 
      </Cell>;
      tableContent[i][1] = <Cell copy={(timestamp!==null) ? moment.unix(timestamp).format('MMM D YYYY, hh:mm:ss a') :  moment.unix(blockTimestamp).format('MMM D YYYY, hh:mm:ss a') }>{(timestamp!==null)? moment.unix(timestamp).format('MMM D YYYY, hh:mm:ss a') : moment.unix(blockTimestamp).format('MMM D YYYY, hh:mm:ss a') }</Cell>;
      tableContent[i][2] = <Cell copy={ value ? nc_numFormatterAionCoin(value, 4, true) : 0 }>{ value ? value: 0 }</Cell>;
      tableContent[i][3] = 
      <Cell copy={transactionHash} link={'#'+NCEntityInfo[NCEntity.TXN].absoluteUrl+''+transactionHash}>
        <NCEntityLabel 
          entityType={NCEntity.TXN} 
          entityName={transactionHash}
          entityId={transactionHash}/> 
      </Cell>;
      tableContent[i][4] = 
      <Cell copy={fromAddr} link={'#'+NCEntityInfo[NCEntity.ACCOUNT].absoluteUrl+''+fromAddr}>
        <NCEntityLabel 
          entityType={NCEntity.ACCOUNT} 
          
          entityId={fromAddr}/>
      </Cell>;
      tableContent[i][5] = 
      <Cell>
        
        {
         
          (status == "") ?
          
          <Popover
            content="Transaction was successful"
            interactionKind={PopoverInteractionKind.HOVER}
            inline={false}
            popoverClassName="NCLivenessIndicator-Popover"
            className="NCLivenessIndicator"
            position={Position.BOTTOM_RIGHT}>
            <button className="pt-button pt-minimal liveness-btn">

              <div className="arrow-cell tx-status">
                <span className="pt-icon-large pt-icon-arrow-right icon success"/>
              </div>
            </button>
          </Popover>

          :
          
          <Popover
            content="Transaction Failed"
            interactionKind={PopoverInteractionKind.HOVER}
            inline={false}
            popoverClassName="NCLivenessIndicator-Popover"
            className="NCLivenessIndicator"
            position={Position.BOTTOM_RIGHT}>
            <button className="pt-button pt-minimal liveness-btn">

              <div className="arrow-cell tx-status">
                <span className="pt-icon-large pt-icon-arrow-right icon fail"/>
              </div>
            </button>
          </Popover> 
                  
        }
      </Cell>;
      tableContent[i][6] = 
      <Cell copy={toAddr ? toAddr : contractAddr ? contractAddr : "Contract Creation"}>
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
    const { data, isPaginated, isLoading, onPageCallback, isLatest=false } = this.props;
    //console.log('txn table');
    
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






























