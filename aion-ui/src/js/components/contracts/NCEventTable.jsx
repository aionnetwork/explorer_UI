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

   
   
 
   parseInputData = (txnLog) => {
    let result = "";

    let arr = [];
    try {
      let a = txnLog;//.slice(1,-1);

      let inputstr = a.split('[').join('["').split("]").join('"]');//.replace(/\\"/g, '"');

      //console.log(JSON.stringify(txnLog.replace(/\\"/g, '"')));

      //first loop
      //inputstr[0] = inputstr[0].slice(0,-1).split(",");
      //arr = arr.concat(inputstr[0]);

      //body loop
      //inputstr[1] = "[" + inputstr[1].slice(0,-2) + "]";
      //arr = arr.concat(inputstr[1]);

      //last loop
      //arr = arr.concat(inputstr[2].split(']').join('[]'));


      //console.log(JSON.stringify(arr));

      result = inputstr.split(",").join('","').split(',"[').join(',[').split(']"').join(']').split(']"]').join(']]');
    } catch (e) {
      console.log(e);
      return false;
    }
    return result;
  }

  parseParamData = (data) => {
    let result = "";
    try {
      let b = data.slice(1,-1);
      let paramstr = b.split(',').join('","');
      result = paramstr.split(",");
      console.log(JSON.stringify(result));
    } catch (e) {
      console.log(e);
    }
    return result;
  } 

  

  generateTableContent(entityList) 
  {
    let tableContent = [];
    //console.log('tkn table');
    entityList.forEach((entity, i) => 
    {
      let parsedInputData = null;//this.parseTxnLog(entity.inputList);
      let parsedParamData = null;//this.parseInputData(entity.parameterList);
      
      let Addr = null;
      let name = null;
      let blockNumber = null;
      
      let timestamp = null;
      let id = null;

      //console.log(JSON.stringify(entity.inputList));
      //console.log(JSON.stringify(entity.parameterList));

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

        console.log(this.parseInputData(entity.inputList));
        
        //console.log(JSON.parse(this.parseInputData(entity.inputList)));
        parsedInputData = JSON.parse(this.parseInputData(entity.inputList));//this.parseInputData(entity.inputList);
        console.log(JSON.stringify(parsedInputData));
        parsedParamData = JSON.parse(this.parseInputData(entity.parameterList));//this.parseParamData(entity.parameterList);
       


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






























