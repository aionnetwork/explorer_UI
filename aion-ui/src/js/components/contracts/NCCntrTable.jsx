/* eslint-disable */

import React, { Component } from 'react';
//import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import NCTableReactPaginated from 'components/common/NCTableReactPaginated';

import moment from 'moment';
import {  Position } from "@blueprintjs/core";
import { Cell } from "@blueprintjs/table";

//import NCTableBase from 'components/common/NCTableBase';
import { NCEntityInfo, NCEntity } from 'lib/NCEnums';


import NCEntityLabel from 'components/common/NCEntityLabel';


//import { nc_numFormatterAionCoin } from 'lib/NCUtility';

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
        name: "Address",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        
      },
      
      {
        name: "Block",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: "Creator",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: "Transaction", // arrow
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

      let blockNumber = null;
      let creator = null;


      let transaction = null;

      if (Array.isArray(entity)) {
        blockNumber = entity[5];


      } else {
        Addr = entity.contractAddr;

        blockNumber = entity.blockNumber;
        creator =  entity.contractCreatorAddr;

        transaction = entity.contractTxHash;
      }

      // Generate tableContent
      tableContent[i] = [];
      tableContent[i][0] = 
      <Cell copy={Addr}>
        
        
        <NCEntityLabel 
            entityType={NCEntity.CNTR} 
            entityId={Addr}/> 
        
        
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






























