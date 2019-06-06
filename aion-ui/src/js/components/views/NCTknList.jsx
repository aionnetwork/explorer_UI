/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import NCTknTable from 'components/tokens/NCTknTable';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
import NCTKNExplorerHead from 'components/common/NCTKNExplorerHead';

import * as StoreTknList from 'stores/StoreTknList';
import * as MSG from 'lib/NCTerms';
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
    }
    
    network.getTknListTopLevel(listType, queryStr);
  }

  
  requestPaging = (pageNumber, pageSize, start, end) => {
    const listType = this.props.tknList.listType;
    const queryStr = this.props.tknList.queryStr;
    console.log(listType+"   "+pageNumber+" "+pageSize+" "+start+" "+end);
    network.getTknListPaging(listType, queryStr, pageNumber, pageSize, start, end);
  }

  render() {
        
    const store = this.props.tknList;
    
    const listType = store.listType;
    const isLoadingTopLevel = this.isFirstRenderAfterMount || store.isLoadingTopLevel;

    const isDataValid = nc_isListValid(store.response);
    const isDataEmpty = nc_isListEmpty(store.response, isDataValid);
    
    const breadcrumbs = [
      {
        link: '/',
        body: MSG.strings.bread,
      },
      {
        link: '/tokens',
        body: MSG.strings.bread_slice.tkn,
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

    let emptyDataStr = ""; // txnListType.ALL
    switch(listType) 
    {
      case tknListType.ALL: {
        emptyDataStr = MSG.Token.EMPTY_DATA_LIST;
        break;
      }
      case tknListType.BY_ACCOUNT: {
        emptyDataStr = MSG.Token.EMPTY_DATA_BY_ACCOUNT + nc_hexPrefix(store.queryStr) + "."
        break;
      }
    }
    
    let total = null;
    
    (store.response)?
       total = (store.response.page) ? store.response.page.totalElements : 0
    :
       total = " ";


    const page =
      <div> 
        <NCExplorerHead
          momentUpdated={store.momentUpdated} 
          breadcrumbs={breadcrumbs}
          title={MSG.strings.Tkn_list_title}
          subtitle={total+ " " + MSG.strings.Tkn_list_desc}
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
        
        loadingStr={MSG.Token.LOADING}
        invalidDataStr={MSG.Token.INVALID_DATA}
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



















































