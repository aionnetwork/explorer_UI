/* eslint-disable */

import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import { Table, Column, Cell, ColumnHeaderCell, SelectionModes } from "@blueprintjs/table"
import { Menu, MenuItem, Intent, Popover, PopoverInteractionKind, Position, Button, InputGroup, Spinner } from "@blueprintjs/core";

import { NCSortType, NCEntity } from 'lib/NCEnums';
import NCEntityLabel from 'components/common/NCEntityLabel';

export default class NCTableBase extends Component {

  constructor(props)
  {
    super(props);

    // ACTIVE, DISPUTED, NULLIFIED, CLOSED, MEDIATED

    // bind the functions
    this.renderColumnHeader = this.renderColumnHeader.bind(this);
    this.renderCell = this.renderCell.bind(this);
    this.computeColumnWidths = this.computeColumnWidths.bind(this);
    this.onColumnWidthChanged = this.onColumnWidthChanged.bind(this);
  }

  renderCell (rowIndex, columnIndex)
  {
    return (this.props.tableContent[rowIndex][columnIndex]);
  }

  renderColumnHeader(columnIndex)
  {
    let columnHeader = this.props.columnDescriptor[columnIndex];
    return (
      <ColumnHeaderCell
        name={ columnHeader.name }
        className={"NCColumnHeader"}
        renderName={(name) => {
          return (
            <div className="bp-table-truncated-text NCColumnHeaderCell">
            {
              (this.props.sortColumn == columnIndex) &&
              <span className={"pt-icon-standard header-icon "+(this.props.sortType == NCSortType.ASC ? "pt-icon-sort-asc" : "pt-icon-sort-desc")}></span>
            }
              <span className="pt-text-overflow-ellipsis">{ name }</span>
            </div>);
          }
        }
        // renderMenu={(index) => {
        //   if (!columnHeader.isSortable)
        //     return;
        //
        //   return(
        //     <Menu>
        //       <MenuItem
        //         iconName="sort-asc"
        //         text="Sort Ascending"
        //         onClick={() => this.props.sortCallback(NCSortType.ASC, columnIndex)}/>
        //       <MenuItem
        //         iconName="sort-desc"
        //         text="Sort Descending"
        //         onClick={() => this.props.sortCallback(NCSortType.DESC, columnIndex)}/>
        //     </Menu>);
        // }}
        // menuIconName={"chevron-down"}>
        // {
        //   (!columnHeader.isFilterable) ? null :
        //   <InputGroup
        //     className={"NCColumnHeaderFilter"}
        //     leftIconName={"pt-icon-filter"}
        //     placeholder=""
        //     onChange={(e) => this.props.filterCallback(columnIndex, e.target.value)}
        //   />
        // }
        > 
      </ColumnHeaderCell>

    );
  }

  computeColumnWidths()
  {
    let containerWidth = this.props.width;
    let containerHeight = this.props.height;

    let { columnDescriptor, sortColumn } = this.props;

    let flexColumns = [];
    let flexColumnWidth = 0;
    let widthUtitlized = 0;
    let columnWidths = Array(columnDescriptor.length).fill(0);

    columnDescriptor.forEach((col, i) =>
    {
      if (col.flex) {
        flexColumns.push(i);
        return;
      }

      columnWidths[i] = col.width;
      widthUtitlized += col.width;
    });

    if (flexColumns.length > 0)
    {
      flexColumnWidth = (containerWidth - widthUtitlized - 55) / flexColumns.length;
    }

    flexColumns.forEach((col) => {
      columnWidths[col] = flexColumnWidth;
    });

    columnWidths[sortColumn] += 15;

    return columnWidths;
  }

  onColumnWidthChanged(index, width)
  {
    this.columnWidths[index] = width;
  }

  componentWillReceiveProps(nextProps)
  {
    if (this.props.width !== nextProps.width || this.props.height !== nextProps.height) {
      //this.columnWidths = this.computeColumnWidths();
    }
  }

  componentWillMount()
  {
    this.columnWidths = this.computeColumnWidths();
  }

  columnHeaderOptions = (columnIndex) => {
    let columnHeader = this.props.columnDescriptor[columnIndex];

    if (this.props.isSortAndFilterEnabled)
      return({
        renderColumnHeader: this.renderColumnHeader
      })
    else {
      return({
        name: columnHeader.name
      })
    }
  }

  render()
  {
    let { tableContent, sortColumn, sortType, columnDescriptor, isSortAndFilterEnabled } = this.props;

    // generate this array here based on resizing of the parent container
    let columns = [];

    for (let i = 0; i < columnDescriptor.length; i++) {
      columns.push(
        <Column
          key={i}
          renderCell={this.renderCell}
          renderColumnHeader={this.renderColumnHeader}/>);
    }

    return (
      <div className="NCTable">
        <Table
          useInteractionBar={false}
          numRows={tableContent.length}
          defaultRowHeight={35}
          columnWidths={this.columnWidths}
          selectionModes={SelectionModes.ROWS_AND_CELLS}
          onColumnWidthChanged={this.onColumnWidthChanged}>
          {columns}
        </Table>
      </div>
    );
  }
}
