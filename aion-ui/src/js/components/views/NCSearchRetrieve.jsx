/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRedirect, hashHistory} from 'react-router'
import moment from 'moment';

import { Tab2, Tabs2, Tooltip } from "@blueprintjs/core";

import NCTknTable from 'components/tokens/NCTknTable';

import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
import NCExplorerSection from 'components/common/NCExplorerSection';
import NCNonIdealState from 'components/common/NCNonIdealState';

import { NCEntity, NCEntityInfo } from 'lib/NCEnums';
import * as MSG from 'lib/NCTerms';

import * as StoreRetrieve from 'stores/StoreRetrieve';

import { nc_hexPrefix, nc_isListValid, nc_isListEmpty, nc_isPositiveInteger, nc_isObjectValid, nc_isObjectEmpty } from 'lib/NCUtility';
import * as network from 'network/NCNetworkRequests';

class NCSearchRetrieve extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      queryStr: '',
      entity: NCEntity.SEARCH,
      page:false,
      item:''

    }
  }

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
    if (prevProps.params.term != this.props.params.term){
      this.requestTopLevel();
    }

 }

  requestTopLevel = () => {
    network.getRetrieveTopLevel(this.props.params.term);

  }

  
  render() {

    const store = this.props.searchRetrieve;
    const isWeb3 = (store.response) ? store.response.web3 : false;

    const isLoadingTopLevel = this.isFirstRenderAfterMount || store.isLoadingTopLevel;
    const isTxnListFirstLoad = false//(store.response && store.response.txn) ? store.response.txn.momentUpdated : null;
    const isBlkListFirstLoad = false//(store.response && store.response.blk) ? store.response.blk.momentUpdated : null;

     const srObj = (store.response && store.response.data) ? store.response.data : null;
    const isSrValid = nc_isObjectValid(srObj);
    const isSrEmpty = nc_isObjectEmpty(srObj, isSrValid);

    const result = isSrEmpty ? {} : srObj.content[0];
    const entity = isSrEmpty ? null : srObj.searchType;

    const token = (store.response.data && store.response.data.searchType) ? store.response.data.searchType : false;

    const breadcrumbs = [
      {
        link: '/',
        body: 'Home',
      },
      {
        link: 'search',
        body: 'Search',
      },
      {
        link: '#',
        body: entity,
      }
    ];

    const desc = store.queryStr;
    
    const searchResultSection = <NCExplorerSection 
      className={""}

      isLoading={isLoadingTopLevel}
      isDataValid={true}
      isDataEmpty={true} 

      emptyDataTitle={MSG.Search.EMPTY_DATA_TITLE}
      invalidDataTitle={MSG.Search.INVALID_DATA}
      
      loadingStr={MSG.Search.LOADING_LIST}
      invalidDataStr={MSG.Search.INVALID_DATA} 
      emptyDataStr={MSG.Search.EMPTY_DATA+" "+desc}
      marginTop={20}
      marginBottom={30} 

      content={""}
    />



  

    const page =
      <div> 
        <NCExplorerHead
          momentUpdated={store.momentUpdated} 
          breadcrumbs={breadcrumbs}
          title={"Result for:"}
          subtitle={desc}/> 

         
          {
            token ?
          <NCTknTable 
          data={store.response.data}
          
          isLoading={store.isLoadingPaging}
          isPaginated={false}
          isLatest={true}/>
          :
          searchResultSection
          }

        <hr className="nc-hr"/>
        
       
      </div>;


    return (
          <NCExplorerPage
            isLoading={isLoadingTopLevel}
            isDataValid={true} 
            isDataEmpty={false}
            
            loadingStr={"Searching..."}
            invalidDataStr={"No Result found!"}
            emptyDataStr={"No Result found for: " + desc + "."}
            
            page={page}/>


    );
  }
}

export default connect((state) => {
  return ({
    searchRetrieve: state.searchRetrieve,
  })
})(NCSearchRetrieve);














































