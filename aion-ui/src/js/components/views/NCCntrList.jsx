/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import NCCntrTable from 'components/contracts/NCCntrTable';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';

import * as StoreCntrList from 'stores/StoreCntrList';
import * as MSG from 'lib/NCTerms';

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

   
    
    network.getCntrListTopLevel(listType, queryStr);
  }

  
  requestPaging = (pageNumber, pageSize, start=0, end=0) => {
    const listType = this.props.cntrList.listType;
    const queryStr = this.props.cntrList.queryStr;
    console.log(pageNumber + " " + pageSize)
    network.getCntrListPaging(listType, queryStr, pageNumber, pageSize, start, end);
  }

  render() {
    
    const store = this.props.cntrList;
    
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
        
        loadingStr={MSG.Contract.LOADING}
        invalidDataStr={MSG.Contract.INVALID_DATA}
        emptyDataStr={MSG.Contract.EMPTY_DATA}
        
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



















































