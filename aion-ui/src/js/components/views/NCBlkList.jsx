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
   

    network.getBlkListTopLevel(listType, queryStr);
  }
  
  requestPaging = (pageNumber,pageSize, start, end) => {
    const listType = this.props.blkList.listType;
    const queryStr = this.props.blkList.queryStr;
    
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
        body: MSG.strings.bread,
      },
      {
        link: '/blocks',
        body: MSG.strings.bread_slice.blk,
      }
    ];

    const page =
      <div> 
        <NCExplorerHead
          momentUpdated={store.momentUpdated} 
          breadcrumbs={breadcrumbs}
          title={MSG.strings.Blk_list_title}
          subtitle={
            listType == blkListType.ALL ? MSG.strings.Blk_list_desc : 
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



















































