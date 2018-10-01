/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import NCTknTable from 'components/tokens/NCTknTable';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
import NCTKNExplorerHead from 'components/common/NCTKNExplorerHead';

import * as StoreTknList from 'stores/StoreTknList';

import { nc_hexPrefix, nc_isListValid, nc_isListEmpty, nc_isPositiveInteger } from 'lib/NCUtility';

import { tknListType } from 'lib/NCEnums';
import * as network from 'network/NCNetworkRequests';

class NCTknList extends Component
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
    let listType = tknListType.ALL;

    let query = this.props.location.query; 
    if (query && query.block) {
      listType = tknListType.BY_ACCOUNT;
      queryStr = query.block;
    }/*
    else if (query && query.account) {
      listType = txnListType.BY_ACCOUNT;
      queryStr = query.account;
    }*/
    
    network.getTknListTopLevel(listType, queryStr);
  }

  requestPaging = (pageNumber) => {
    const listType = this.props.tknList.listType;
    const queryStr = this.props.tknList.queryStr;
    network.getTknListPaging(listType, queryStr, pageNumber);
  }

  render() {
    //console.log('tkn list');
    
    const store = this.props.tknList;
    //console.log(JSON.stringify(store));

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
        link: '/tokens',
        body: 'Tokens',
      }
    ];

    let subtitle = "(ERC777)"; // txnListType.ALL
    switch(listType) 
    {
      case tknListType.ALL: {
        subtitle = " Tokens";// + (nc_isPositiveInteger(store.queryStr) ? '#'+store.queryStr : nc_hexPrefix(store.queryStr));
        break;
      }
      case tknListType.BY_ACCOUNT: {
        subtitle = "Account: " + nc_hexPrefix(store.queryStr)
        break;
      }
    }

    let emptyDataStr = "No transactions found. Dashboard server loading blocks."; // txnListType.ALL
    switch(listType) 
    {
      case tknListType.ALL: {
        emptyDataStr = "No tokens found: " + (nc_isPositiveInteger(store.queryStr) ? '#'+store.queryStr : store.queryStr) + "."
      }
      case tknListType.BY_ACCOUNT: {
        emptyDataStr = "No tokens found involving account "+ nc_hexPrefix(store.queryStr) + "."
      }
    }

    const page =
      <div> 
        <NCTKNExplorerHead
          momentUpdated={store.momentUpdated} 
          breadcrumbs={breadcrumbs}
          title={"Tokens"}
          subtitle={store.response}
        />  
        <NCTknTable 
          data={store.response}
          onPageCallback={this.requestPaging}
          isLoading={store.isLoadingPaging}
          isPaginated={true}
          isLatest={true}/>
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
    tknList: state.tknList,
  })
})(NCTknList);



















































