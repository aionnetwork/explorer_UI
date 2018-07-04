/* eslint-disable */
import React, { Component } from 'react';

import NCPagination from 'components/common/NCPagination';
import NCTableReact from 'components/common/NCTableReact';

import { PAGE_SIZE } from 'network/NCNetworkRequests'

export default class NCTableReactPaginated extends Component 
{
  constructor(props) {
    super(props);

    this.state = {
      pageNumber: 0
    }
  }

  selfPageData = (pageNumber) => {
    this.setState({
      pageNumber: pageNumber
    });
  }

  render() {
    const { data, isPaginated, isLoading, onPageCallback, entityName, columnDescriptor, generateTableContent, isLatest=false } = this.props;
    const list = data.content;
    let tableList = list;

    let paginationObj = null;
    const page = data.page;
    if (isPaginated) {
      if (page == null) {  
        let numPages = Math.ceil(list.length / PAGE_SIZE);
        let startIdx = this.state.pageNumber * PAGE_SIZE;
        let endIdx = startIdx + PAGE_SIZE;

        tableList = list.slice(startIdx, endIdx);

        paginationObj = 
        <NCPagination
            entityName={entityName}

            pageNumber={this.state.pageNumber}
            totalElements={list.length}
            listSize={tableList.length}
            totalPages={numPages}
            pageSize={PAGE_SIZE}
            
            onPageCallback={this.selfPageData}
            isLoading={isLoading}
            isLatest={isLatest}/>;
      } else {
        paginationObj = 
        <NCPagination
            entityName={entityName}

            pageNumber={page.number}
            totalElements={page.totalElements}
            listSize={list.length}
            totalPages={page.totalPages}
            pageSize={page.size}
            
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
          generateTableContent={generateTableContent}
          columnDescriptor={columnDescriptor}/>
      </div>
    );
  }
}






























