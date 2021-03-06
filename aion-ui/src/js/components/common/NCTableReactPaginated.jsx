/* eslint-disable */
import React, { Component } from 'react';

import NCPagination from 'components/common/NCPagination';
import NCPaginationFoot from 'components/common/NCPaginationFoot';
import NCTableReact from 'components/common/NCTableReact';

import { PAGE_SIZE } from 'network/NCNetworkRequests'

export default class NCTableReactPaginated extends Component 
{
  constructor(props) {
    super(props);

    this.state = {
      pageNumber: 0,
      pageSize: 20,
    }
  }

  selfPageData = (pageNumber,pageSize) => {
    this.setState({
      pageNumber: pageNumber,
      pageSize: pageSize
    });
  }

  render() {
    const { minDate= new Date(2018, 3, 22), calFilter, rowHeight, rowHeights, dialog, data, isPaginated, isLoading, onPageCallback, entityName, columnDescriptor, generateTableContent, isLatest=false } = this.props;
    const list = data.content;
    let tableList = list;
    let height = rowHeight;

    let pageSize = (this.state.pageSize > PAGE_SIZE) ? this.state.pageSize : PAGE_SIZE;

    let paginationObj = null;
    let paginationFoot = null;
    const page = data.page;

    if (isPaginated) {
      if (page === null || typeof page === 'undefined') {
        let numPages = Math.ceil(list.length / pageSize);
        let startIdx = this.state.pageNumber * pageSize;
        let endIdx = startIdx + pageSize;
        tableList = list.slice(startIdx, endIdx);

        paginationObj = 
        <NCPagination
            entityName={entityName}
            calFilter={this.props.calFilter}
            pageNumber={this.state.pageNumber}
            totalElements={list.length}
            listSize={tableList.length}
            totalPages={numPages}
            pageSize={this.state.pageNumber}
            
            minDate= {minDate}

            onPageCallback={this.selfPageData}
            isLoading={isLoading}
            isLatest={isLatest}/>;
        paginationFoot = 
        <NCPaginationFoot
            entityName={entityName}

            pageNumber={this.state.pageNumber}
            totalElements={list.length}
            listSize={tableList.length}
            totalPages={numPages}
            pageSize={this.state.pageNumber}

            minDate= {minDate}
            
            onPageCallback={this.selfPageData}
            isLoading={isLoading}
            isLatest={isLatest}/>;
      } else {

         paginationObj =
        <NCPagination
            entityName={entityName}
            calFilter={this.props.calFilter}
            pageNumber={(typeof page.number !== 'undefined')? page.number : page.page}
            totalElements={page.totalElements}
            listSize={list.length}
            totalPages={page.totalPages}
            pageSize={page.size}
            
            minDate= {minDate}
            startDate={page.start}
            endDate={page.end}

            onPageCallback={onPageCallback}
            isLoading={isLoading}
            isLatest={isLatest}/>;
      
      paginationFoot = 
        <NCPaginationFoot
            entityName={entityName}

            pageNumber={(typeof page.number !== 'undefined')? page.number : page.page}
            totalElements={page.totalElements}
            listSize={list.length}
            totalPages={page.totalPages}
            pageSize={page.size}

            minDate= {minDate}
            startDate={page.start}
            endDate={page.end}
            
            onPageCallback={onPageCallback}
            isLoading={isLoading}
            isLatest={isLatest}/>;
      }
    }

    return (
      <div className={"NCTableWrapper"}>
        { paginationObj }

        <NCTableReact
          data={tableList}
          rowHeight = {height}
          rowHeights = {rowHeights}
          generateTableContent={generateTableContent}
          columnDescriptor={columnDescriptor}
          dialog={dialog}/>

        { paginationFoot }
      </div>
    );
  }
}






























