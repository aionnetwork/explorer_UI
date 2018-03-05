/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import NCAccTable from 'components/accounts/NCAccTable';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';

import * as StoreAccList from 'stores/StoreAccList';

import { nc_hexPrefix, nc_isListValid, nc_isListEmpty } from 'lib/NCUtility';

import { accListType } from 'lib/NCEnums';
import * as network from 'network/NCNetworkRequests';

class NCAccList extends Component
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
    // empty
  }

  requestTopLevel = () => {
    network.getAccListTopLevel();
  }

  requestPaging = (pageNumber) => {
    network.getAccListPaging(pageNumber);
  }
  
  render() {
    const store = this.props.accList;

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
        link: '/accounts',
        body: 'Accounts',
      }
    ];

    const page =
      <div> 
        <NCExplorerHead
          momentUpdated={store.momentUpdated} 
          breadcrumbs={breadcrumbs}
          title={"Accounts"}
          subtitle={"All Accounts"}
        />  
        <NCAccTable 
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
        
        loadingStr={"Loading Account Data"}
        invalidDataStr={"Server provided an invalid response. Please try again."}
        emptyDataStr={"No accounts found. Blockchain server loading blocks."}
        
        page={page}
        marginTop={100}/>
    );
  }
}

export default connect((state) => {
  return ({
    accList: state.accList,
  })
})(NCAccList);



















































