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

import { nc_decimalPrettify,nc_rawFormat, nc_numFormatterAionCoin,nc_numFormatterACSensitive } from 'lib/NCUtility';
import {strings as MSG} from 'lib/NCTerms';

export default class NCTxnTable extends Component
{
  constructor(props) {
    super(props);

    this.columnDescriptor =
    [

      {
        name: MSG.Txn_list_col2,
        isSortable: false,
        isFilterable: false,
        width: 160,
        flex: false,
        objPath: null,
      },
      {
        name: MSG.Txn_list_col3,
        isSortable: false,
        isFilterable: false,
        width: 150,
        flex: false,
        objPath: null,
      },
      /*{
         name: "Type",//MSG.Txn_list_col3,
         isSortable: false,
         isFilterable: false,
         width: 75,
         flex: false,
         objPath: null,
      },*/
      {
        name: MSG.Txn_list_col4,
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: MSG.Txn_list_col5,
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: MSG.Txn_list_col6, // arrow
        isSortable: false,
        isFilterable: false,
        width: 75,
        flex: false,
      },
      {
        name: MSG.Txn_list_col7,
        isSortable: false,
        isFilterable: false,
        width: null,
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
      let blockNumber = null;
      let transactionHash = null;
      let fromAddr = null;
      let toAddr = null;
      let contractAddr = null;
      let blockTimestamp = null;
      let timestamp = null;
      let value = null;
      let status = null;
      let type = "";

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
        value = nc_decimalPrettify(nc_numFormatterACSensitive(entity.value)); //let nc_decimalPrettify(nc_rawFormat(entity.value)) : nc_decimalPrettify(nc_addDecimal(entity.value));
        status = entity.txError;
        type = entity.type;
      }

      //console.log(status);
      //console.log(timestamp);
      // Generate tableContent
      tableContent[i] = [];

      tableContent[i][0] = <Cell copy={(timestamp!==null) ? moment.unix(timestamp).format('MMM D YYYY, hh:mm:ss a') :  moment.unix(blockTimestamp).format('MMM D YYYY, hh:mm:ss a') }>{(timestamp!==null)? moment.unix(timestamp).format('MMM D YYYY, hh:mm:ss a') : moment.unix(blockTimestamp).format('MMM D YYYY, hh:mm:ss a') }</Cell>;
      tableContent[i][1] = <Cell copy={ value ? value : 0 }>{ value ? value: 0 }</Cell>;
      //tableContent[i][3] = <Cell copy={ type }>{ type }</Cell>;
      tableContent[i][2] =
      <Cell copy={transactionHash} link={'#'+NCEntityInfo[NCEntity.TXN].absoluteUrl+''+transactionHash}>
        <NCEntityLabel
          entityType={NCEntity.TXN}
          entityId={transactionHash}/>
      </Cell>;
      tableContent[i][3] =
      <Cell copy={fromAddr} link={'#'+NCEntityInfo[NCEntity.ACCOUNT].absoluteUrl+''+fromAddr}>
        <NCEntityLabel
          entityType={NCEntity.ACCOUNT}

          entityId={fromAddr}/>
      </Cell>;
      tableContent[i][4] =
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
           (status == null) ?

                    <Popover
                      content="See Transaction Detail page"
                      interactionKind={PopoverInteractionKind.HOVER}
                      inline={false}
                      popoverClassName="NCLivenessIndicator-Popover"
                      className="NCLivenessIndicator"
                      position={Position.BOTTOM_RIGHT}>
                      <button className="pt-button pt-minimal liveness-btn">

                        <div className="arrow-cell tx-status">
                          <span className="pt-icon-large pt-icon-arrow-right icon "/>
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
      tableContent[i][5] =
      <Cell copy={toAddr ? toAddr : contractAddr ? contractAddr : "Contract Creation"}  link={toAddr ? '#'+NCEntityInfo[NCEntity.ACCOUNT].absoluteUrl+''+toAddr :'#'+NCEntityInfo[NCEntity.ACCOUNT].absoluteUrl+''+contractAddr}>
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
    const { data, isPaginated, isLoading, onPageCallback, isLatest=false,calFilter=true } = this.props;
    //console.log('txn table');

    return (
      <NCTableReactPaginated
        calFilter={calFilter}
        data={data}
        onPageCallback={onPageCallback}
        minDate={new Date(Date.now() - 7 * 24 * 3600 * 1000)}
        isLoading={isLoading}
        isPaginated={false}
        entityName={"transactions"}
        generateTableContent={this.generateTableContent}
        columnDescriptor={this.columnDescriptor}
        isLatest={isLatest}/>
    );
  }
}






























