/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { Tab2, Tabs2, Tooltip } from "@blueprintjs/core";

import NCBlkTable from 'components/blocks/NCBlkTable';
import NCTxnTableOwn from 'components/transactions/NCTxnTableOwn';

//list of sub-displays for details
import NCAccDetail from 'components/accounts/NCAccDetail';


import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
import NCExplorerSection from 'components/common/NCExplorerSection';
import NCNonIdealState from 'components/common/NCNonIdealState';

import * as StoreAccRetrieve from 'stores/StoreAccRetrieve';

import { nc_hexPrefix, nc_isListValid, nc_isListEmpty, nc_isPositiveInteger, nc_isObjectValid, nc_isObjectEmpty } from 'lib/NCUtility';
import * as network from 'network/NCNetworkRequests';

class NCSearchRetrieve extends Component
{
  constructor(props) {
    super(props);
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
    if (prevProps.params.accId != this.props.params.accId){
      this.requestTopLevel();
    }
  }

  requestTopLevel = () => {
    network.getRetrieveTopLevel(this.props.params.accId);
  }

  entityView = (entity) => {
    return true;
  }

  render() {

    const store = this.props;
    console.log("page Data for retrieve: "+JSON.stringify(this.props));

    const isWeb3 = (store.response) ? store.response.web3 : false;

    //console.log("page Data for retrieve: "+JSON.stringify(this.props));

    const isLoadingTopLevel = false//this.isFirstRenderAfterMount || store.isLoadingTopLevel;
    const isTxnListFirstLoad = false//(store.response && store.response.txn) ? store.response.txn.momentUpdated : null;
    const isBlkListFirstLoad = false//(store.response && store.response.blk) ? store.response.blk.momentUpdated : null;

    //const details = $this.entityView(store.response.entity)
    const isAccValid = true;//nc_isObjectValid(accObj);
    const isAccEmpty = true;//nc_isObjectEmpty(accObj, isAccValid);

    
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
        body: 'Details',
      }
    ];

    const desc = nc_hexPrefix(store.queryStr);
    
    const searchResultSection = <NCExplorerSection 
      className={""}

      isLoading={isLoadingTopLevel}
      isDataValid={isAccValid}
      isDataEmpty={isAccEmpty} 

      emptyDataTitle={"Account Not Found"}
      invalidDataTitle={"Account Service Unavailable"}
      
      loadingStr={"Loading Account"}
      invalidDataStr={"Account Service Unavailable. Please try again."} 
      emptyDataStr={"No Data Available for Account: "+desc}
      marginTop={20}
      marginBottom={30}

      content={ <NCAccDetail /> }
    />

  

    const page =
      <div> 
        <NCExplorerHead
          momentUpdated={store.momentUpdated} 
          breadcrumbs={breadcrumbs}
          title={"Account"}
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














































