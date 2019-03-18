/* eslint-disable */

import classNames from "classnames";
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import NCTableReactPaginated from 'components/common/NCTableReactPaginated';
import NCDialog from 'components/common/NCDialog';

import moment from 'moment';
import { Tooltip, AnchorButton, Dialog,Button,Overlay, Position, Classes, Popover, Menu, MenuItem, InputGroup, Intent, PopoverInteractionKind } from "@blueprintjs/core";
import { Table, Column, Cell, ColumnHeaderCell, SelectionModes, TruncatedFormat } from "@blueprintjs/table";

import NCTableBase from 'components/common/NCTableBase';
import { NCSortType, NCEntity, nc_LinkToEntity,NCEntityInfo } from 'lib/NCEnums';

import NCPagination from 'components/common/NCPagination';
import NCEntityLabel, {parseClientTransaction} from 'components/common/NCEntityLabel';
import NCTokenLabel from 'components/common/NCTokenLabel';
import { PAGE_SIZE } from 'network/NCNetworkRequests';

import { nc_numFormatterAionCoin, nc_isStrEmpty } from 'lib/NCUtility';

import appConfig from '../../../config.json';

import ReactGA from 'react-ga';
import * as MSG from 'lib/NCTerms';//MSG.strings.Cntr_detail_tab2_col1

ReactGA.initialize(appConfig.ga_key);

 const row = {
    height:"100px",
  };  

export default class NCEventTable extends Component
{
  constructor(props) {
    super(props);

    ReactGA.event({
      category: 'Contract',
      action: 'Events tab'
    });

    this.state = {
      isOpen: false,
      content: ''
    };

    this.isOpen = false;
    this.content = "";

    this.columnDescriptor = 
    [
      {
        name: MSG.strings.Cntr_detail_tab2_col1,
        isSortable: false,
        isFilterable: false,
        width: 150,

        flex: false,
        
      },
          
      {
        name: MSG.strings.Cntr_detail_tab2_col2,
        isSortable: false,
        isFilterable: false,
        
        flex: true,
        objPath: null,
      },
      
      {
        name: MSG.strings.Cntr_detail_tab2_col3, // arrow
        isSortable: false,
        isFilterable: false,
        width: 200,
        flex: false,
      },
      
      
    ];

    this.ncRowHeight = [];

    this.generateTableContent = this.generateTableContent.bind(this);
  }


   
   
 handleOpen = (text,title) => {
  
    this.setState({ isOpen: true, eContent:text, eTitle:title});
    
  };


 handleClose = () => this.setState({ isOpen: false });

   parseParamData = (txnLog) => {
    let result = "";

    let arr = [];
    try {
      let a = txnLog;//.slice(1,-1);

      let inputstr = a.split('[').join('["').split("]").join('"]');//.replace(/\\"/g, '"');

      result = inputstr.split(",").join('","').split(',"[').join(',[').split(']"').join(']').split(']"]').join(']]');
    
    } catch (e) {
      console.log(e);
      return false;
    }
    return result;
  };

   parseInputData = (txnLog) => {
    let result = "";

    let arr = [];
    try {
      let a = txnLog;//.slice(1,-1);

      let input = a.split(',['); 

      input[0]  = input[0].split('[').join('["').split(',').join('","') +'"';
      let input2 =input.join(',"[').split('],').join(']",').split(']]').join(']"]').slice(2,-2).split('","');

      result = input2;//inputstr.split(",").join('","').split(',"[').join(',[').split(']"').join(']').split(']"]').join(']]');
    
    } catch (e) {
      console.log(e);
      return false;
    }
    return result;
  };

  parameters = (a) => {
      let list = '';

      let data = JSON.parse(a);

      for (var i in data) {
          list = list + data[i] + ", " ;
      }

      return list.slice(0,-2); 
  };
  inputs = (a,b) =>{
      let list = [];

      let data = JSON.parse(a);
      let param = JSON.parse(b);

      for (var i in data) {
          if(nc_isStrEmpty(data[i])){list.push( param[i] +' = []' );}else{list.push( param[i] +' = '+data[i] );}
      }

      return list;
  };

  

  generateTableContent(entityList)
  {
    
    let tableContent = [];
    
    entityList.forEach((entity, i) => 
    {
      let parsedInputData = null;//this.parseTxnLog(entity.inputList);
      let parsedParamData = null;//this.parseInputData(entity.parameterList);
      
      let Addr = null;
      let name = null;
      let blockNumber = null;
      
      let timestamp = null;
      let id = null;
      let params = null;
      let inputs = null;
      let eTitle = null;

      
      if (Array.isArray(entity)) {
        blockNumber = entity[5];
        token = entity[0];
        symbol = entity[1];
        fromAddr = entity[1];
        toAddr = entity[2];
        blockTimestamp = entity[4];
        value = entity[3];
        console.log('Array: '+JSON.stringify(entity));
      } else {
        Addr = entity.contractAddr;
        name = entity.name;
        blockNumber = entity.blockNumber;
        timestamp = entity.eventTimestamp;
        params = this.parameters(entity.parameterList);
        inputs = this.inputs(entity.inputList, entity.parameterList );
        
        id= entity.eventId;

        
      }

      
      const estyle = {height:'200px',padding:'10px',background:'#f00',border:'#ff0 solid'};
      const fstyle = {height:'200px',padding:'10px',background:'#00f', top:'50px',};
      const OVERLAY_EXAMPLE_CLASS = "docs-overlay-example-transition"; 
      const classes = classNames(Classes.CARD, Classes.ELEVATION_4, OVERLAY_EXAMPLE_CLASS, this.props.data.themeName);
      
      

      // Generate tableContent
      tableContent[i] = [];
      tableContent[i][0] = 
      <Cell copy={blockNumber} link={'#'+NCEntityInfo[NCEntity.BLOCK].absoluteUrl+''+blockNumber}>
        
       <NCEntityLabel 
          entityType={NCEntity.BLOCK} 
          entityName={blockNumber}
          entityId={blockNumber}/> 
        
       </Cell>
      ;
      
     
      tableContent[i][1] = <Cell copy={inputs.map((a,i)=>{return ({a})})} interactive={true} ><b>{ name + '('+params+')' }
      </b>
      
      <Button className="pt-button pt-minimal liveness-btn pull-right" onClick={
        ()=>{
          let _e = inputs.map((a,i)=>{return (<span key={i}>{a}<br/></span>)});
          
          this.handleOpen(_e,name);
        }
      }
      >
        View
      </Button>
      
      </Cell>;
    
      tableContent[i][2] = 
      
      <Cell copy={ moment.unix(timestamp).format('MMM D YYYY, hh:mm:ss a') }>{ moment.unix(timestamp).format('MMM D YYYY, hh:mm:ss a') }</Cell>;     
      
      this.ncRowHeight.push(60+25*inputs.length);
           
    });

    return tableContent; 
  }
  
  render() {
    const OVERLAY_EXAMPLE_CLASS = "docs-overlay-example-transition";
    const { data, isPaginated, isLoading, onPageCallback, isLatest=false } = this.props;
     
    

                
    
    return (
      <div>
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
          <Dialog
                    
                    icon="info-sign"
                    onClose={this.handleClose}
                    title={this.state.eTitle+" event"}
                    isOpen={this.state.isOpen}
                    
                >
                    <div className={Classes.DIALOG_BODY}>
                        
                        <pre className={"nc-resizable"}>{this.state.eContent}</pre>

                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                                                        
                        </div>
                    </div>
          </Dialog>
        </div>
        
    );
  }
}






























