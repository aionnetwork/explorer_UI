/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import NCBlkTable from 'components/blocks/NCBlkTable';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';

import * as StoreBlkList from 'stores/StoreBlkList';
import * as MSG from 'lib/NCTerms';
import { nc_hexPrefix, nc_isListValid, nc_isListEmpty } from 'lib/NCUtility';

import { blkListType } from 'lib/NCEnums';
import * as network from 'network/NCNetworkRequests';

class NCBlkList extends Component
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
    let listType = blkListType.ALL;
    let queryStr = "";
    /*
    let query = this.props.location.query; 
    if (query && query.account) {
      listType = blkListType.BY_ACCOUNT;
      queryStr = query.account;
    }*/

    network.getBlkListTopLevel(listType, queryStr);
  }
  //requestPaging = (pageNumber, pageSize, start=0, end=0)
  requestPaging = (pageNumber,pageSize, start, end) => {
    const listType = this.props.blkList.listType;
    const queryStr = this.props.blkList.queryStr;
    console.log(start+" "+end);
    network.getBlkListPaging(listType, queryStr, pageNumber,pageSize, start, end);
  }

  render() {
    const store = this.props.blkList;

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
        link: '/blocks',
        body: 'Blocks',
      }
    ];

    const page =
      <div> 
        <NCExplorerHead
          momentUpdated={store.momentUpdated} 
          breadcrumbs={breadcrumbs}
          title={"Blocks"}
          subtitle={
            listType == blkListType.ALL ? "Recent Blocks" : 
            ("Sealed by Account: " + nc_hexPrefix(store.queryStr))
          }
        />  
        <NCBlkTable 
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
        
        loadingStr={MSG.Block.LOADING_LIST}
        invalidDataStr={MSG.Block.INVALID_DATA_LIST}
        emptyDataStr={MSG.Block.EMPTY_DATA_LIST}
        
        page={page}
        marginTop={100}/>
    );
  }
}

export default connect((state) => {
  return ({
    blkList: state.blkList,
  })
})(NCBlkList);



















































