/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';
import { Cell } from "@blueprintjs/table";

import NCEntityLabel from 'components/common/NCEntityLabel';
//import NCPagination from 'components/common/NCPagination';
import NCTableReactPaginated from 'components/common/NCTableReactPaginated';

import { NCEntity,NCEntityInfo } from 'lib/NCEnums';

import { nc_numFormatter } from 'lib/NCUtility';

import appConfig from '../../../config.json';

import ReactGA from 'react-ga';
import {strings as MSG} from 'lib/NCTerms'; //MSG.Acc_inbound_col1

ReactGA.initialize(appConfig.ga_key);


export default class NCAccTableInbound extends Component 
{
  constructor(props) {
    super(props);

    ReactGA.event({
      category: 'Accounts',
      action: 'Viewed Inbound'
    });

    this.columnDescriptor = 
    [
      {
        name: MSG.Acc_inbound_col1,
        isSortable: false,
        isFilterable: false,
        width: null,
        flex: true,
      },
      {
        name: MSG.Acc_inbound_col2,
        isSortable: false,
        isFilterable: false,
        width: 100,
        flex: false,
      },
      {
        name: MSG.Acc_inbound_col3,
        isSortable: false,
        isFilterable: false,
        width: 160,
        flex: false,
      },
      {
        name: MSG.Acc_inbound_col4,
        isSortable: false,
        isFilterable: false,
        width: 200,
        flex: false,
      }
    ];
  }

  generateTableContent = (entityList) => 
  {
    let tableContent = [];
    // [addr, txnCount]

    entityList.forEach((entity, i) => 
    {
      tableContent[i] = [];
      tableContent[i][0] = (entity[0]!=='')?
        <Cell copy={entity[0]} link={'#'+NCEntityInfo[NCEntity.ACCOUNT].absoluteUrl+''+entity[0]} >
          <NCEntityLabel 
            entityType={NCEntity.ACCOUNT} 
            entityId={entity[0]}/> 
        </Cell> : <Cell>Contract creation</Cell>;
      tableContent[i][1] = <Cell copy={ nc_numFormatter(entity[3], 2) } >{ nc_numFormatter(entity[3], 2) }</Cell>;
      tableContent[i][2] = <Cell copy={ nc_numFormatter(entity[1], 2) } >{ nc_numFormatter(entity[1], 2) }</Cell>;
      tableContent[i][3] = <Cell copy={ nc_numFormatter(entity[2], 2) }>{ nc_numFormatter(entity[2], 2) }</Cell>;        
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
        entityName={"accounts"}
        generateTableContent={this.generateTableContent}
        columnDescriptor={this.columnDescriptor}
        isLatest={isLatest}/>
    );
  }
}






























