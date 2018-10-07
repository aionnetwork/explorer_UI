/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { Tab2, Tabs2, Tooltip } from "@blueprintjs/core";


//list of sub-displays for details
import NCAccDetail from 'components/accounts/NCAccDetail';
import NCTknDetail from 'components/tokens/NCTknDetail';
import NCBlkDetail from 'components/blocks/NCBlkDetail';
import NCTxnDetail from 'components/transactions/NCTxnDetail';

import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
import NCExplorerSection from 'components/common/NCExplorerSection';
import NCNonIdealState from 'components/common/NCNonIdealState';

import { NCEntity, NCEntityInfo } from 'lib/NCEnums';

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
      entity: NCEntity.SEARCH
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

  entityView = (entity,data) => {
    switch(entity)
    {
    // Top Level 
    // ---------
      case 'block':
      {  
        return <NCBlkDetail entity={data}/>
      }
      case 'transaction':
      {
        return <NCTxnDetail entity={data}/>
      }
      case'token':
      {
        return <NCTknDetail entity={data}/>
      }
      case'account':
      {
        return <NCAccDetail entity={data}/>
      }


      default: 
      {
        return "";
      }
    }

  }

  render() {

    const store = this.props.searchRetrieve;
    console.log("page Data for retrieve: "+JSON.stringify(store));

    const isWeb3 = (store.response) ? store.response.web3 : false;

    //console.log("page Data for retrieve 2: "+JSON.stringify(this.props));

    const isLoadingTopLevel = false//this.isFirstRenderAfterMount || store.isLoadingTopLevel;
    const isTxnListFirstLoad = false//(store.response && store.response.txn) ? store.response.txn.momentUpdated : null;
    const isBlkListFirstLoad = false//(store.response && store.response.blk) ? store.response.blk.momentUpdated : null;

     const srObj = (store.response && store.response.data) ? store.response.data : null;
    const isSrValid = nc_isObjectValid(srObj);
    const isSrEmpty = nc_isObjectEmpty(srObj, isSrValid);

    const result = isSrEmpty ? {} : srObj.content[0];
    const entity = isSrEmpty ? "no result" : srObj.searchType;

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
    const detail = this.entityView(entity,result);

    
    const searchResultSection = <NCExplorerSection 
      className={""}

      isLoading={isLoadingTopLevel}
      isDataValid={isSrValid}
      isDataEmpty={isSrEmpty} 

      emptyDataTitle={"Not Found"}
      invalidDataTitle={"No Result found!"}
      
      loadingStr={"Loading Account"}
      invalidDataStr={"Account Service Unavailable. Please try again."} 
      emptyDataStr={"No Data Available for Account: "+desc}
      marginTop={20}
      marginBottom={30} 

      content={ this.entityView(entity,result) }
    />

  

    const page =
      <div> 
        <NCExplorerHead
          momentUpdated={store.momentUpdated} 
          breadcrumbs={breadcrumbs}
          title={"Result for:"}
          subtitle={desc}/>  
        { searchResultSection }
        <hr className="nc-hr"/>
        
       
      </div>;

    return (
      <NCExplorerPage
        isLoading={isLoadingTopLevel}
        isDataValid={true} 
        isDataEmpty={false}
        
        loadingStr={"Loading Account Details"}
        invalidDataStr={"Account Service Unavailable. Account data invalid."}
        emptyDataStr={"No account found for descriptor: " + desc + "."}
        
        page={page}/>
    );
  }
}

export default connect((state) => {
  return ({
    searchRetrieve: state.searchRetrieve,
  })
})(NCSearchRetrieve);













































