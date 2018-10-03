/* eslint-disable */

import classNames from "classnames";
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import NCTableReactPaginated from 'components/common/NCTableReactPaginated';

import moment from 'moment';
import { Button,Overlay, Position, Classes, Popover, Menu, MenuItem, InputGroup, Intent, PopoverInteractionKind } from "@blueprintjs/core";
import { Table, Column, Cell, ColumnHeaderCell, SelectionModes, TruncatedFormat } from "@blueprintjs/table"

import NCTableBase from 'components/common/NCTableBase';
import { NCSortType, NCEntity, nc_LinkToEntity } from 'lib/NCEnums';

import NCPagination from 'components/common/NCPagination';
import NCEntityLabel, {parseClientTransaction} from 'components/common/NCEntityLabel';
import NCTokenLabel from 'components/common/NCTokenLabel';
import { PAGE_SIZE } from 'network/NCNetworkRequests'

import { nc_numFormatterAionCoin } from 'lib/NCUtility';

 const row = {
    height:"100px",
  }

  

export default class NCEventTable extends Component
{
  constructor(props) {
    super(props);

    this.columnDescriptor = 
    [
      {
        name: "Event Id",
        isSortable: false,
        isFilterable: false,
        width: 100,

        flex: false,
        
      },
      {
        name: "Name",
        isSortable: false,
        isFilterable: false,
        width: 150,
        flex: false,
        
      },
     
      {
        name: "timestamp",
        isSortable: false,
        isFilterable: false,
        width: 150,
        flex: false,
        objPath: null,
      },
      
      {
        name: "Event Logs", // arrow
        isSortable: false,
        isFilterable: false,
        width: 400,
        flex: true,
      },
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

    this.generateTableContent = this.generateTableContent.bind(this);
  }

   
   button: HTMLButtonElement;
   
   refHandlers = {
        button: (ref: HTMLButtonElement) => (this.button = ref),
    };

   handleOpen = () => this.setState({ isOpen: true });

   handleClose = () => this.setState({ isOpen: false });
 
   parseTxnLog = (txnLog) => {
    if (txnLog == null) return false;
    try {
      let parsed = JSON.parse(txnLog);

      if (!parsed || parsed.length == 0)
        return false;

      return(JSON.stringify(parsed, undefined, 2))
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  parseInputData = (data) => {
    let result = "";
    try {
      // get the function header
      if (data.length > 0) {
        result += data.substring(0, 8) + '\n';
        data = data.substring(8);
      }

      while (data.length > 0) {
        result += data.substring(0, 32) + '\n';
        data = data.substring(32);
      }
    } catch (e) {
      console.log(e);
    }
    return result;
  } 

  generateTableContent(entityList) 
  {
    let tableContent = [];
    console.log('tkn table');
    entityList.forEach((entity, i) => 
    {
      let parsedTxnLog = this.parseTxnLog(entity.inputList);
      let parsedInputData = this.parseInputData(entity.parameterList);

        let str = "";
      str = entity.name+" -> ";

      let a = entity.inputList.slice(1,-1);
      let b = entity.parameterList.slice(1,-1);

      let inputstr = a.split('\"').join('');
      let input = inputstr.split(",");

      let paramstr = b.split('\"').join('');
      let param = paramstr.split(",");

      str = str + param[0]+":"+input[0]+";"+ param[1]+":"+input[1]+";"+ param[2]+":"+input[2];

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

      let id = null;

      console.log(JSON.stringify(entity));

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
        name = entity.name;
        blockNumber = entity.blockNumber;
        creator =  entity.contractCreatorAddr;

        token = entity.name;
        symbol = entity.symbol;
        
        totalSupply = entity.totalSupply;
        liquidSupply= entity.liquidSupply;
        decimal = entity.granularity;
        transaction = str;

        transactions = entity.inputList;
        holders = entity.totalAccounts;

        fromAddr = entity.fromAddr;
        toAddr = entity.toAddr;
        blockTimestamp = entity.blockTimestamp;
        value = entity.value;

        id= entity.eventId;

       


      }

      const state = {
        autoFocus: true,
        canEscapeKeyClose: true,
        canOutsideClickClose: true,
        enforceFocus: true,
        hasBackdrop: true,
        isOpen: false,
        usePortal: true,
    };

      const estyle = {height:'200px',padding:'10px',background:'#f00',border:'#ff0 solid'};
      const fstyle = {height:'200px',padding:'10px',background:'#00f', top:'50px',};
      const classes = classNames(Classes.CARD, Classes.ELEVATION_4, OVERLAY_EXAMPLE_CLASS, this.props.data.themeName);
      const OVERLAY_EXAMPLE_CLASS = "docs-overlay-example-transition"; 

      // Generate tableContent
      tableContent[i] = [];
      tableContent[i][0] = 
      <Cell >
        
        
        {id}
        
        
       </Cell>
      ;
      tableContent[i][1] = <Cell>{ name }</Cell>;
     
      tableContent[i][2] = 
      <Cell>
           
           <Button elementRef={this.refHandlers.button} onClick={this.handleOpen} text="Show overlay" />
         <Overlay onClose={this.handleClose} className={Classes.OVERLAY_SCROLL_CONTAINER} {...this.state}>
                    <div className={classes}>
                        <h3> I'm an Overlay!</h3>
                        <p>
                            This is a simple container with some inline styles to position it on the screen. Its CSS
                            transitions are customized for this example only to demonstrate how easily custom
                            transitions can be implemented.
                        </p>
                        <p>
                            Click the right button below to transfer focus to the "Show overlay" trigger button outside
                            of this overlay. If persistent focus is enabled, focus will be constrained to the overlay.
                            Use the <code>tab</code> key to move to the next focusable element to illustrate this
                            effect.
                        </p>
                        <br />
                        <Button intent={Intent.DANGER} onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button onClick={this.focusButton} style={{ float: "right" }}>
                            Focus button
                        </Button>
                    </div>
                </Overlay>
      </Cell>;
      tableContent[i][3] = 
      <Cell

      truncated={false}
      wrapText={true} 
      
      >
         {entity.inputList}
         {entity.parameterList}      
      </Cell>;
      
      //tableContent[i][5] = <Cell>{ holders }</Cell>;
      //tableContent[i][6] = <Cell>{ transactions }</Cell>;
     
    });

    return tableContent; 
  }
  
  render() {
    const OVERLAY_EXAMPLE_CLASS = "docs-overlay-example-transition";
    const { data, isPaginated, isLoading, onPageCallback, isLatest=false } = this.props;
    
    return (
      <NCTableReactPaginated
        data={data}
        onPageCallback={onPageCallback}
        isLoading={isLoading}
        isPaginated={isPaginated}
        entityName={"Events"}
        generateTableContent={this.generateTableContent}
        columnDescriptor={this.columnDescriptor}
        isLatest={isLatest}/>
    );
  }
}






























