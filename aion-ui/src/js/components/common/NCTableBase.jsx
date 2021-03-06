/* eslint-disable */

import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import { Table, Column, Cell, ColumnHeaderCell, SelectionModes, CopyCellsMenuItem,
    IMenuContext,  Utils} from "@blueprintjs/table"
import { Tooltip, Menu, MenuItem, Intent, Popover,ContextMenuTarget, PopoverInteractionKind, Position, Button, InputGroup, Spinner } from "@blueprintjs/core";

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

    this.state = { data:[]};
  }

  renderCell (rowIndex, columnIndex)
  {
    return (this.props.tableContent[rowIndex][columnIndex]);
  }

  renderColumnHeader(columnIndex)
  {
    let columnHeader = this.props.columnDescriptor[columnIndex];
    let info = columnHeader.description ?
                                            <span className="fa fa-info-circle fa-lg icon"></span>
                                       :
                                            "";
    return (
      <ColumnHeaderCell
        name={ columnHeader.description ? columnHeader.description : columnHeader.name}
        className={"NCColumnHeader"}

        renderName={(name) => {
          return (
            <div className="bp-table-truncated-text NCColumnHeaderCell">
            {
              (this.props.sortColumn == columnIndex) &&
              <span className={"pt-icon-standard header-icon "+(this.props.sortType == NCSortType.ASC ? "pt-icon-sort-asc" : "pt-icon-sort-desc")}></span>
            }
              <span className="pt-text-overflow-ellipsis">{ columnHeader.name } {" "}
                        { info}
              </span>
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

    if ((flexColumns.length > 0)&&(containerWidth>1030))
    {
      flexColumnWidth = (containerWidth - widthUtitlized - 55) / flexColumns.length;
    }
    else{
      //this is for mobile compatibility
      flexColumnWidth = 450;
    }

    flexColumns.forEach((col) => {
      columnWidths[col] = flexColumnWidth;
    });

    columnWidths[sortColumn] += 56;

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

  componentWillUpdate(){
      //this.columnWidths = this.computeColumnWidths();
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

   getCellData = (rowIndex: number, columnIndex: number) => {
       
       return this.props.tableContent[rowIndex][columnIndex].props.copy;
       
    };
    

    renderBodyContextMenu = (context: IMenuContext) => {

        //console.log( JSON.stringify(context));
        //console.log(this.props.tableContent[context.target.rows[0]][context.target.cols[0]].props.link);
        return (
            <Menu>
                <CopyCellsMenuItem context={context} getCellData={this.getCellData} text="Copy" />

                
                {(typeof this.props.tableContent[context.target.rows[0]][context.target.cols[0]].props.link !== "undefined")&&
                  <MenuItem 
                    target="_blank" 
                    
                    href={this.props.tableContent[context.target.rows[0]][context.target.cols[0]].props.link}
                    text="Open link in new tab"
                  />
                  
                }
               

            </Menu>
        );
    };

  render()
  {
    let { rowHeights=null, rowHeight = 35, tableContent, sortColumn, sortType, columnDescriptor, isSortAndFilterEnabled } = this.props;

    // generate this array here based on resizing of the parent container
    let columns = [];

    let height = rowHeight

    for (let i = 0; i < columnDescriptor.length; i++) {
      columns.push(
        <Column

          key={i}
          renderCell={this.renderCell}
          renderColumnHeader={this.renderColumnHeader}/>);
    }

    //console.log(JSON.stringify(rowHeights));
    //console.log(JSON.stringify(this.props.width + "Container Width Base: " + this.props.containerWidth));


    return (
      <div className="NCTable">
        <Table
          renderBodyContextMenu={this.renderBodyContextMenu}
          useInteractionBar={false}
          isRowHeaderShown={false}
          numRows={tableContent.length}
          defaultRowHeight={height}
          rowHeights={rowHeights}
          enableMultipleSelection={false}
          columnWidths={this.columnWidths}
          selectionModes={SelectionModes.ROWS_AND_CELLS}
          onColumnWidthChanged={this.onColumnWidthChanged}>
          {columns}
        </Table>
      </div>
    );
  }
}
