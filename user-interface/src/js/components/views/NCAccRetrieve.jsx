/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { Tab2, Tabs2 } from "@blueprintjs/core";

import NCAccTable from 'components/accounts/NCAccTable';
import NCBlkTable from 'components/blocks/NCBlkTable';
import NCTxnTable from 'components/transactions/NCTxnTable';

import NCAccDetail from 'components/accounts/NCAccDetail';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
import NCExplorerSection from 'components/common/NCExplorerSection';
import NCNonIdealState from 'components/common/NCNonIdealState';

import * as StoreAccRetrieve from 'stores/StoreAccRetrieve';

import { nc_hexPrefix, nc_isListValid, nc_isListEmpty, nc_isPositiveInteger, nc_isObjectValid, nc_isObjectEmpty } from 'lib/NCUtility';
import * as network from 'network/NCNetworkRequests';

class NCAccRetrieve extends Component
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
    if (prevProps.params.accId != this.props.params.accId)
      this.requestTopLevel();
  }

  requestTopLevel = () => {
    network.getAccRetrieveTopLevel(this.props.params.accId);
  }

  requestPagingTxnList = (pageNumber) => {
    const queryStr = this.props.accRetrieve.queryStr;
    network.getAccRetrievePagingTxnList(queryStr, pageNumber);
  }

  requestPagingBlkList = (pageNumber) => {
    const queryStr = this.props.accRetrieve.queryStr;
    network.getAccRetrievePagingBlkList(queryStr, pageNumber);
  }

  render() {
    const store = this.props.accRetrieve;
    
    const isLoadingTopLevel = this.isFirstRenderAfterMount || store.isLoadingTopLevel;
    const accObj = (store.response) ? store.response.acc : null;
    const txnList = (store.response) ? store.response.txn : null;
    const blkList = (store.response) ? store.response.blk : null;

    const isAccValid = nc_isObjectValid(accObj);
    const isAccEmpty = nc_isObjectEmpty(accObj, isAccValid);

    const isTxnListValid = nc_isListValid(txnList);
    const isTxnListEmpty = nc_isListEmpty(txnList, isTxnListValid);

    const isBlkListValid = nc_isListValid(blkList);
    const isBlkListEmpty = nc_isListEmpty(blkList, isBlkListValid);

    const acc = isAccEmpty ? {} : accObj.content[0];
    
    const breadcrumbs = [
      {
        link: '/',
        body: 'Home',
      },
      /*{
        link: '/accounts',
        body: 'Accounts',
      },*/
      {
        link: '#',
        body: 'Account Details',
      }
    ];

    const desc = nc_hexPrefix(store.queryStr);

    /*
    const accBalanceSection = <NCExplorerSection 
      className={""}

      isLoading={isLoadingTopLevel}
      isDataValid={isTxnListValid}
      isDataEmpty={isTxnListEmpty} 
      
      loadingStr={"Loading Transactions"}
      invalidDataStr={"Server provided an invalid response. Please try again."} 
      emptyDataStr={"No transactions found for this account."}
      marginTop={40}

      content={
        <NCTxnTable 
          data={txnList}
          onPageCallback={this.requestPagingTxnList}
          isLoading={store.isLoadingPagingTxnList}
          isPaginated={true}/>
        }
      
    />

    const txnListSection = <NCExplorerSection 
      className={""}

      isLoading={isLoadingTopLevel}
      isDataValid={isTxnListValid}
      isDataEmpty={isTxnListEmpty} 
      
      loadingStr={"Loading Transactions"}
      invalidDataStr={"Server provided an invalid response. Please try again."} 
      emptyDataStr={"No transactions found for this account."}
      marginTop={40}

      content={
        <NCTxnTable 
          data={txnList}
          onPageCallback={this.requestPagingTxnList}
          isLoading={store.isLoadingPagingTxnList}
          isPaginated={true}/>
        }
      
    />

    const blkListSection = <NCExplorerSection 
      className={""}

      isLoading={isLoadingTopLevel}
      isDataValid={isBlkListValid}
      isDataEmpty={isBlkListEmpty} 
      
      loadingStr={"Loading Blocks"}
      invalidDataStr={"Server provided an invalid response. Please try again."} 
      emptyDataStr={"No blocks proposed by this account."}
      marginTop={40}

      content={
        <NCBlkTable 
          data={blkList}
          onPageCallback={this.requestPagingBlkList}
          isLoading={store.isLoadingPagingBlkList}
          isPaginated={true}/>
        }
    />
    */

    const page =
      <div> 
        <NCExplorerHead
          momentUpdated={store.momentUpdated} 
          breadcrumbs={breadcrumbs}
          title={"Account"}
          subtitle={desc}/>  
        <NCAccDetail entity={acc}/>
         <hr className="nc-hr"/>
        <NCNonIdealState
          paddingTop={80}
          icon={"pt-icon-offline"}
          title={"Coming Soon"}
          description={"Account transactions & blocks-mined feature undergoing reconstruction. To be re-enabled soon."}/>
        {/*
          (!isAccEmpty) &&
          <div className="NCSection">
            <Tabs2 id="NCSectionTabbed" className="NCSectionTabbed" large={true} renderActiveTabPanelOnly={true}>
            {
              (!isTxnListEmpty) &&
              <Tab2 id="txn" title="Transactions" panel={txnListSection}/>
            }
            {
              (!isBlkListEmpty) &&
              <Tab2 id="blk" title="Mined Blocks" panel={blkListSection}/>
            }
            </Tabs2>
          </div>
        */}
      </div>;

    return (
      <NCExplorerPage
        isLoading={isLoadingTopLevel}
        isDataValid={isAccValid} 
        isDataEmpty={isAccEmpty}
        
        loadingStr={"Loading Account Details"}
        invalidDataStr={"Server error. Account data invalid."}
        emptyDataStr={"No account found for descriptor: " + desc + "."}
        
        page={page}/>
    );
  }
}

export default connect((state) => {
  return ({
    accRetrieve: state.accRetrieve,
  })
})(NCAccRetrieve);














































