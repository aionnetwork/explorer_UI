/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import NCCntrTable from 'components/contracts/NCCntrTable';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
//import NCTKNExplorerHead from 'components/common/NCExplorerHead';

import * as StoreCntrList from 'stores/StoreCntrList';

import { nc_hexPrefix, nc_isListValid, nc_isListEmpty, nc_isPositiveInteger } from 'lib/NCUtility';

import { cntrListType } from 'lib/NCEnums';
import * as network from 'network/NCNetworkRequests';

class NCCntrList extends Component
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
    let listType = cntrListType.ALL;

    /*let query = this.props.location.query; 
    if (query && query.block) {
      listType = tknListType.BY_ACCOUNT;
      queryStr = query.block;
    }
    else if (query && query.account) {
      listType = txnListType.BY_ACCOUNT;
      queryStr = query.account;
    }*/
    
    network.getCntrListTopLevel(listType, queryStr);
  }

  requestPaging = (pageNumber, pageSize) => {
    const listType = this.props.cntrList.listType;
    const queryStr = this.props.cntrList.queryStr;
    network.getCntrListPaging(listType, queryStr, pageNumber, pageSize);
  }

  render() {
    //console.log('contract list view');
    
    const store = this.props.cntrList;
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
        link: '/contracts',
        body: 'Contracts',
      }
    ];

    let subtitle = "(ERC777)"; // txnListType.ALL
    switch(listType) 
    {
      case cntrListType.ALL: {
        subtitle = "Contracts";// + (nc_isPositiveInteger(store.queryStr) ? '#'+store.queryStr : nc_hexPrefix(store.queryStr));
        break;
      }
      case cntrListType.BY_ACCOUNT: {
        subtitle = "Account: " + nc_hexPrefix(store.queryStr)
        break;
      }
    }

    let emptyDataStr = "No transactions found. Dashboard server loading blocks."; // txnListType.ALL
    switch(listType) 
    {
      case cntrListType.ALL: {
        emptyDataStr = "No contracts found: " + (nc_isPositiveInteger(store.queryStr) ? '#'+store.queryStr : store.queryStr) + "."
        break;
      }
      case cntrListType.BY_ACCOUNT: {
        emptyDataStr = "No contracts found involving account "+ nc_hexPrefix(store.queryStr) + "."
        break;
      }
    }
    //console.log('contract list view 2');
    const page =
      <div> 
        <NCExplorerHead
          momentUpdated={store.momentUpdated} 
          breadcrumbs={breadcrumbs}
          title={"Contracts"}
          subtitle={'Recent contracts'}
        />  
        <NCCntrTable 
          data={store.response}
          onPageCallback={this.requestPaging}
          isLoading={store.isLoadingPaging}
          isPaginated={true}
          isLatest={true}/>
      </div>;

    return (
      <NCExplorerPage
        isLoading={isLoadingTopLevel}
        isDataValid={true} 
        isDataEmpty={isDataEmpty}
        
        loadingStr={"Loading Contract Data"}
        invalidDataStr={"Server provided an invalid response. Please try again."}
        emptyDataStr={emptyDataStr}
        
        page={page}
        marginTop={100}/>
    );
  }
}

export default connect((state) => {
  
  return ({
    cntrList: state.cntrList,
  })
})(NCCntrList);



















































