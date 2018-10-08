/* eslint-disable */

import classNames from "classnames";
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import NCTableReactPaginated from 'components/common/NCTableReactPaginated';
import NCDialog from 'components/common/NCDialog';

import moment from 'moment';
import { Tooltip, AnchorButton, Dialog,Button,Overlay, Position, Classes, Popover, Menu, MenuItem, InputGroup, Intent, PopoverInteractionKind } from "@blueprintjs/core";
import { Table, Column, Cell, ColumnHeaderCell, SelectionModes, TruncatedFormat } from "@blueprintjs/table"

import NCTableBase from 'components/common/NCTableBase';
import { NCSortType, NCEntity, nc_LinkToEntity } from 'lib/NCEnums';

import NCPagination from 'components/common/NCPagination';
import NCEntityLabel, {parseClientTransaction} from 'components/common/NCEntityLabel';
import NCTokenLabel from 'components/common/NCTokenLabel';
import { PAGE_SIZE } from 'network/NCNetworkRequests'

import { nc_numFormatterAionCoin } from 'lib/NCUtility';

import appConfig from '../../../config.json';

import ReactGA from 'react-ga';
ReactGA.initialize(appConfig.ga_key);

 const row = {
    height:"100px",
  }

  

export default class NCEventTable extends Component
{
  constructor(props) {
    super(props);

    ReactGA.event({
      category: 'Contract',
      action: 'Events tab'
    });

    
    this.columnDescriptor = 
    [
      {
        name: "Block #",
        isSortable: false,
        isFilterable: false,
        width: null,

        flex: true,
        
      },
          
      {
        name: "Name",
        isSortable: false,
        isFilterable: false,
        width: 150,
        flex: false,
        objPath: null,
      },
      
      {
        name: "Event timestamp", // arrow
        isSortable: false,
        isFilterable: false,
        width: 250,
        flex: false,
      },
      {
        name: "Event logs", // arrow
        isSortable: false,
        isFilterable: false,
        width: 100,
        flex: false,
      },
      
    ];

    this.generateTableContent = this.generateTableContent.bind(this);
  }

  
  generateTableContent(entityList) 
  {
    let tableContent = [];
    //console.log('tkn table');
    entityList.forEach((entity, i) => 
    {
      let parsedInputData = null;//this.parseTxnLog(entity.inputList);
      let parsedParamData = null;//this.parseInputData(entity.parameterList);
      let parsedLogs = null;
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
      
      let timestamp = null;
      let id = null;

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
        name = entity.name;
        blockNumber = entity.blockNumber;
        timestamp = entity.eventTimestamp;

        id= entity.eventId;
        parsedInputData = this.parseInputData(entity.inputList);
        parsedParamData = this.parseParamData(entity.parameterList);
       


      }

      
      const estyle = {height:'200px',padding:'10px',background:'#f00',border:'#ff0 solid'};
      const fstyle = {height:'200px',padding:'10px',background:'#00f', top:'50px',};
      const OVERLAY_EXAMPLE_CLASS = "docs-overlay-example-transition"; 
      const classes = classNames(Classes.CARD, Classes.ELEVATION_4, OVERLAY_EXAMPLE_CLASS, this.props.data.themeName);
      

      // Generate tableContent
      tableContent[i] = [];
      tableContent[i][0] = 
      <Cell >
        
       <NCEntityLabel 
          entityType={NCEntity.BLOCK} 
          entityName={blockNumber}
          entityId={blockNumber}/> 
        
       </Cell>
      ;
      
     
      tableContent[i][1] = <Cell><b>{ name }</b></Cell>;
    
      tableContent[i][2] = 
      
      <Cell>{ moment.unix(timestamp).format('MMM D YYYY, hh:mm:ss a') }</Cell>;     
      
      
      tableContent[i][3] = <Cell>  
        <NCDialog 

          contract = {Addr}

          param= {parsedParamData}
         
          input= {parsedInputData}
        />  
       </Cell>;

         

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
        isLatest={isLatest}

          

        />
    );
  }
}






























