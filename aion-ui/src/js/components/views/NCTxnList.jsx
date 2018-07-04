/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import NCTxnTable from 'components/transactions/NCTxnTable';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';

import * as StoreTxnList from 'stores/StoreTxnList';

import { nc_hexPrefix, nc_isListValid, nc_isListEmpty, nc_isPositiveInteger } from 'lib/NCUtility';

import { txnListType } from 'lib/NCEnums';
import * as network from 'network/NCNetworkRequests';

class NCTxnList extends Component
{
  componentWillMount() {
    this.isFirstRenderAfterMount = true;
  }

  componentDidMount() {
    this.requestTopLevel();
  }

  componentWillReceiveProps(nextProps) {
    this.isFirstRenderAfterMount = false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.query != this.props.location.query)
      this.requestTopLevel();
  }

  requestTopLevel = () => {
    let queryStr = "";
    let listType = txnListType.ALL;

    let query = this.props.location.query; 
    if (query && query.block) {
      listType = txnListType.BY_BLOCK;
      queryStr = query.block;
    }/*
    else if (query && query.account) {
      listType = txnListType.BY_ACCOUNT;
      queryStr = query.account;
    }*/
    
    network.getTxnListTopLevel(listType, queryStr);
  }

  requestPaging = (pageNumber) => {
    const listType = this.props.txnList.listType;
    const queryStr = this.props.txnList.queryStr;
    network.getTxnListPaging(listType, queryStr, pageNumber);
  }

  render() {
    const store = this.props.txnList;

    const listType = store.listType;
    const isLoadingTopLevel = this.isFirstRenderAfterMount || store.isLoadingTopLevel;

    const isDataValid = nc_isListValid(store.response);
    const isDataEmpty = nc_isListEmpty(store.response, isDataValid);
    
    const breadcrumbs = [
      {
        link: '/',
        body: 'Home',
      },
      {
        link: '/transactions',
        body: 'Transactions',
      }
    ];

    let subtitle = "Recent Transactions"; // txnListType.ALL
    switch(listType) 
    {
      case txnListType.BY_BLOCK: {
        subtitle = "Block: " + (nc_isPositiveInteger(store.queryStr) ? '#'+store.queryStr : nc_hexPrefix(store.queryStr));
        break;
      }
      case txnListType.BY_ACCOUNT: {
        subtitle = "Account: " + nc_hexPrefix(store.queryStr)
        break;
      }
    }

    let emptyDataStr = "No transactions found. Dashboard server loading blocks."; // txnListType.ALL
    switch(listType) 
    {
      case txnListType.BY_BLOCK: {
        emptyDataStr = "No transactions found in block: " + (nc_isPositiveInteger(store.queryStr) ? '#'+store.queryStr : store.queryStr) + "."
      }
      case txnListType.BY_ACCOUNT: {
        emptyDataStr = "No transactions found involving account "+ nc_hexPrefix(store.queryStr) + "."
      }
    }

    const page =
      <div> 
        <NCExplorerHead
          momentUpdated={store.momentUpdated} 
          breadcrumbs={breadcrumbs}
          title={"Transactions"}
          subtitle={subtitle}
        />  
        <NCTxnTable 
          data={store.response}
          onPageCallback={this.requestPaging}
          isLoading={store.isLoadingPaging}
          isPaginated={true}/>
      </div>;

    return (
      <NCExplorerPage
        isLoading={isLoadingTopLevel}
        isDataValid={isDataValid} 
        isDataEmpty={isDataEmpty}
        
        loadingStr={"Loading Transaction Data"}
        invalidDataStr={"Server provided an invalid response. Please try again."}
        emptyDataStr={emptyDataStr}
        
        page={page}
        marginTop={100}/>
    );
  }
}

export default connect((state) => {
  return ({
    txnList: state.txnList,
  })
})(NCTxnList);



















































