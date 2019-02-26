/* eslint-disable */

import React, { Component } from 'react';

import { connect } from 'react-redux';

import NCTableReactPaginated from 'components/common/NCTableReactPaginated';

import moment from 'moment';
import { Position } from "@blueprintjs/core";
import { Cell} from "@blueprintjs/table"


import { NCEntityInfo, NCEntity} from 'lib/NCEnums';

import NCEntityLabel from 'components/common/NCEntityLabel';
import NCTokenLabel from 'components/common/NCTokenLabel';

 const row = {
    height:"100px",
  }

export default class NCTknTable extends Component 
{
  constructor(props) {
    super(props);

    this.columnDescriptor = 
    [
      {
        name: "Token",
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
        objPath: null,
      },
      {
        name: "Decimal",
        isSortable: false,
        isFilterable: false,
        width: 70,
        flex: false,
        objPath: null,
      },
      {
        name: "Frozen Supply",
        isSortable: false,
        isFilterable: false,
        width: 150,
        flex: false,
        objPath: null,
      },
      {
        name: "Liquid Supply",
        isSortable: false,
        isFilterable: false,
        width: 150,
        flex: false,
        objPath: null,
      },
      {
        name: "Creator",
        isSortable: false,
        isFilterable: false,
        width: 200,
        flex: false,
        objPath: null,
      },
      {
        name: "Transaction", // arrow
        isSortable: false,
        isFilterable: false,
        width: 200,
        flex: false,
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
      let token = null;
      let symbol = null;
      let Addr = null;
      let totalSupply = null;
      let liquidSupply= 0;
      let description = " ";
      let decimal = null;
      let transaction = 0;
      let holder = 1;

      // [transactionHash, fromAddr, toAddr, value, blockTimestamp, blockNumber]
      if (Array.isArray(entity)) {

        token = entity[0];
        symbol = entity[1];

      } else {


        token = entity.name;
        symbol = entity.symbol;
        Addr = entity.contractAddr;
        totalSupply = entity.totalSupply;
        liquidSupply= entity.liquidSupply;
        decimal = entity.granularity;
        transaction = entity.transactionHash;
        holder = entity.creatorAddress;

      }

      // Generate tableContent
      tableContent[i] = [];
      tableContent[i][0] = 
      <Cell copy={token+" ("+symbol+") "+ Addr+" "+description} truncated={false}
       wrapText={true}>
        
        
        <NCTokenLabel 
          entityType={NCEntity.TKN} 
          entityName={token}
          entityDescription={description}
          entitySymbol={symbol}
          entityId={Addr}/>
        
        
       </Cell>
      ;
      tableContent[i][1] = <Cell copy={ decimal }>{ decimal }</Cell>;
      tableContent[i][2] = <Cell copy={ totalSupply }>{ totalSupply }</Cell>;
      tableContent[i][3] = 
      <Cell copy={liquidSupply}>
          {liquidSupply}
         
      </Cell>;
      tableContent[i][4] = 
      <Cell copy={holder} link={'#'+NCEntityInfo[NCEntity.ACCOUNT].absoluteUrl+''+holder}>
          <NCEntityLabel 
          entityType={NCEntity.ACCOUNT} 
          
          entityId={holder}/> 
        
      </Cell>;
      tableContent[i][5] = 
      <Cell copy={transaction} link={'#'+NCEntityInfo[NCEntity.TXN].absoluteUrl+''+transaction}>
          <NCEntityLabel 
          entityType={NCEntity.TXN} 
          
          entityId={transaction}/> 
        
      </Cell>;
     
    });

    return tableContent; 
  }
  
  render() {
    const { data, isPaginated, isLoading, onPageCallback, isLatest=false } = this.props;
    
    return (
      <NCTableReactPaginated
        data={data}
        onPageCallback={onPageCallback}
        isLoading={isLoading}
        isPaginated={isPaginated}
        entityName={"Tokens"}
        generateTableContent={this.generateTableContent}
        columnDescriptor={this.columnDescriptor}
        isLatest={isLatest}/>
    );
  }
}






























