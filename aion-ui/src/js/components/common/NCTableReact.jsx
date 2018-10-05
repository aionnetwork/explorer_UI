/* eslint-disable */

import ContainerDimensions from 'react-container-dimensions'


import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import moment from 'moment';
import { Button, Position, Classes, Popover, Menu, MenuItem, InputGroup, Intent, PopoverInteractionKind } from "@blueprintjs/core";
import { Table, Column, Cell, ColumnHeaderCell, SelectionModes } from "@blueprintjs/table"

import NCTableBase from 'components/common/NCTableBase';

import { NCSortType, NCEntity, nc_LinkToEntity } from 'lib/NCEnums';
import NCEntityLabel from 'components/common/NCEntityLabel';

import { nc_objLookupByPath, nc_defaultSortAsc, nc_defaultSortDesc, nc_defaultFilter } from 'lib/NCUtility';

// Features:
// Assumption: Takes up full width of the Parent container
// Dynamic Resizing Based on Parent Container Width
// Client-side filtering
// Client-side sorting

// TODO
// Client-side pagination
// Server-side pagination
// Server-side pagination
// Server-side sorting 

// STRETCH
// Server-side filtering (effectively search)

export default class NCTableReact extends Component 
{
  constructor(props) {
    super(props);

    this.state = 
    {
      sortColumn: 0,
      sortType: NCSortType.DESC,
      filterState: {},
    }
    
    this.sortCallback = this.sortCallback.bind(this);
    this.runSort = this.runSort.bind(this);
    
    this.filterCallback = this.filterCallback.bind(this);
    this.runFilter = this.runFilter.bind(this);
  }
  
  sortCallback(sortType, sortColumn) 
  {
    if ((sortColumn == this.state.sortColumn) && (sortType == this.state.sortType))
      return;

    this.setState({
      sortColumn: sortColumn,
      sortType:sortType,
    });
  }

  runSort(data) 
  {
    if (data.length <= 0) return data;

    let sortColumn = this.state.sortColumn;
    let sortType = this.state.sortType;

    let rows = JSON.parse(JSON.stringify(data));
    let path = this.props.columnDescriptor[sortColumn].objPath;

    if (path == null) return data;
    
    rows.sort((a, b) => 
    {
      let objA = nc_objLookupByPath(a, path);
      let objB = nc_objLookupByPath(b, path);

      if (objA == null || objB == null) {
        return 0;
      }

      if (sortType === NCSortType.ASC) 
        return nc_defaultSortAsc(objA, objB);
      else
        return nc_defaultSortDesc(objA, objB);
    });

    return rows;
  }

  filterCallback(filterColumn, value) 
  {
    this.setState((prevState, props) => {
      prevState.filterState[filterColumn] = value;
      return (prevState);
    }, () => {
      //console.log(this.state);
    });
  }

  runFilter(data) 
  {
    if (data.length <= 0) return data;

    let filterState = this.state.filterState;
    let rows = JSON.parse(JSON.stringify(data));

    for (let col in filterState) 
    {  
      if (!filterState.hasOwnProperty(col)) continue;

      let path = this.props.columnDescriptor[col].objPath;
      let filter = filterState[col];

      if (filter == "" || path == null) continue;

      rows = rows.filter((obj) => 
      {
        let a = nc_objLookupByPath(obj, path);
        return nc_defaultFilter(a, filter);
      });
    }
    
    return rows;
  }

  render() {

    let { dialog, data, generateTableContent, columnDescriptor } = this.props;

    let filteredData = this.runFilter(data);
    let sortedData = this.runSort(filteredData);
    let tableContent = generateTableContent(sortedData);

    return (
      <div className="NCTableEnhanced">
        <ContainerDimensions>
          <NCTableBase 
            tableContent={tableContent}
            columnDescriptor={columnDescriptor}

            sortColumn={this.state.sortColumn}
            sortType={this.state.sortType}
            sortCallback={this.sortCallback}
            isSortAndFilterEnabled={false}

            filterCallback={this.filterCallback}

            containerWidth = {this.props.containerWidth}
            containerHeight = {this.props.containerHeight}/>
        </ContainerDimensions>
      </div>
    );
  }
}






























