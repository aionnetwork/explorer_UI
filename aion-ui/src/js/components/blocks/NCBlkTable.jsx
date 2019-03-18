/* eslint-disable */
import React, { Component } from 'react'; 
import moment from 'moment';
import { Cell } from "@blueprintjs/table"

import NCEntityLabel from 'components/common/NCEntityLabel';
//import NCPagination from 'components/common/NCPagination';
import NCTableReactPaginated from 'components/common/NCTableReactPaginated';
import NCLink from 'components/common/NCLink';

import { NCEntity, NCEntityInfo  } from 'lib/NCEnums';
import { nc_numPrettify, nc_numFormatter, nc_numFormatterBytes } from 'lib/NCUtility';

//import { PAGE_SIZE } from 'network/NCNetworkRequests'
import * as MSG from 'lib/NCTerms';
import {BigNumber} from 'bignumber.js';

export default class NCBlkTable extends Component 
{
  constructor(props) {
    super(props);

    this.columnDescriptor = 
    [
      {
        name: MSG.strings.Blk_list_col1,
        isSortable: false,
        isFilterable: false,
        width: 120,
        flex: true,
        objPath: 'blockNumber',
      },
      {
        name: MSG.strings.Blk_list_col2,
        isSortable: false,
        isFilterable: false,
        width: 200,
        flex: false,
        objPath: 'blockTimestamp',
      },
      {
        name: MSG.strings.Blk_list_col3,
        isSortable: false,
        isFilterable: false,
        width: 90,
        flex: false,
        objPath: 'numTransactions',
      },
      {
        name: MSG.strings.Blk_list_col4,
        isSortable: false,
        isFilterable: false,
        width: 110,
        flex: false,
        objPath: 'nrgConsumed',
      },
      {
        name: MSG.strings.Blk_list_col5,
        isSortable: false,
        isFilterable: false,
        width: 110,
        flex: false,
        objPath: 'difficulty',
      },
      {
        name: MSG.strings.Blk_list_col6,
        isSortable: false,
        isFilterable: false,
        width: 110,
        flex: false,
        objPath: 'size',
      },
    ];
  }

  generateTableContent = (entityList) => 
  {
    let tableContent = [];

    entityList.forEach((entity, i) => 
    {
      
      let blockNumber = null;
      let nrgConsumed = null;
      let difficulty = null;
      let size = null;
      let numTransactions = null;
      let blockTimestamp = null;

      // [blockHash, blockNumber, difficulty, nrgConsumed, nrgLimit, size, blockTimestamp, totalDifficulty, numTransactions]
      if (Array.isArray(entity)) {
        blockNumber = entity[1];
        nrgConsumed = entity[3];
        difficulty = entity[2];
        size = entity[5];
        numTransactions = entity[8];
        blockTimestamp = entity[6];
      } else {
        blockNumber = entity.blockNumber;
        nrgConsumed = entity.nrgConsumed;
        difficulty = entity.difficulty;
        size = entity.size;
        numTransactions = entity.numTransactions;
        blockTimestamp = entity.blockTimestamp;
      }

      tableContent[i] = [];  
      tableContent[i][0] = 
      <Cell copy={blockNumber} link={'#'+NCEntityInfo[NCEntity.BLOCK].absoluteUrl+''+blockNumber} >
        <NCEntityLabel 
          entityType={NCEntity.BLOCK} 
          entityName={blockNumber}
          entityId={blockNumber}/> 
      </Cell>;
      tableContent[i][1] = <Cell copy={ moment.unix(blockTimestamp).format('MMM D YYYY, hh:mm:ss a') } >{ moment.unix(blockTimestamp).format('MMM D YYYY, hh:mm:ss a') }</Cell>;
      tableContent[i][2] = 
      <Cell copy={numTransactions} link={"/#/transactions?block=" + blockNumber} >
        <NCLink 
          link={"/transactions?block=" + blockNumber} 
          title={numTransactions} 
          enabled={ numTransactions > 0 }/>
      </Cell>;
      tableContent[i][3] = <Cell copy={ nc_numFormatter(nrgConsumed, 2) } >{ nc_numFormatter(nrgConsumed, 2) }</Cell>;
      tableContent[i][4] = <Cell copy={difficulty}>{difficulty}</Cell>;
      tableContent[i][5] = <Cell copy={ nc_numFormatterBytes(size, 2) }>{ nc_numFormatterBytes(size, 2) }</Cell>;
    });

    return tableContent;
  }

  render() {
    const { data, isPaginated, isLoading, onPageCallback, isLatest=false } = this.props;
    
    return (
      <NCTableReactPaginated
        data={data}
        minDate={new Date(Date.now() - 7 * 24 * 3600 * 1000)}
        calFilter={true}
        onPageCallback={onPageCallback}
        isLoading={isLoading}
        isPaginated={isPaginated}
        entityName={"blocks"}
        generateTableContent={this.generateTableContent}
        columnDescriptor={this.columnDescriptor}
        isLatest={isLatest}/>
    );
  }
}





























