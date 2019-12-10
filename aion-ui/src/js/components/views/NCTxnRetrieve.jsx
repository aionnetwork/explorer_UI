/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import NCTxnDetail from 'components/transactions/NCTxnDetail';
import NCTrnDetail from 'components/transactions/NCTrnDetail';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
import NCExplorerSection from 'components/common/NCExplorerSection';

import NCNonIdealState from 'components/common/NCNonIdealState';
import NCTxnEventLogTable from 'components/transactions/NCTxnEventLogTable';
import NCTxnTableOwnTransfer from 'components/transactions/NCTxnTableOwnTransfer';

import * as StoreTxnRetrieve from 'stores/StoreTxnRetrieve';
import { Position, Popover, Tab2, Tabs2, Tooltip, Button, Menu, MenuItem, PopoverInteractionKind } from "@blueprintjs/core";
import {CopyToClipboard} from 'react-copy-to-clipboard';

//import { nc_hexPrefix, nc_isObjectValid, nc_isObjectEmpty, nc_formatLogs } from 'lib/NCUtility';
import { nc_hexPrefix, nc_isListValid, nc_isListEmpty, nc_isPositiveInteger, nc_isObjectValid, nc_isStrEmpty, nc_isObjectEmpty,nc_LinkToEntityWithParam, nc_trim } from 'lib/NCUtility';

import * as network from 'network/NCNetworkRequests';

import * as MSG from 'lib/NCTerms';

class NCTxnRetrieve extends Component
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
    if ((prevProps.params.txnId !== this.props.params.txnId) || (prevProps.params.itxnId !== this.props.params.itxnId)){
      this.requestTopLevel();
    }
  }

  requestPagingTrnList = (pageNumber,pageSize,start,end) => {
    const queryStr = this.props.accRetrieve.queryStr;

    network.getTxnRetrievePagingTrnList(queryStr, this.state.token, pageNumber,pageSize,start,end);
  }

  requestTopLevel = () => {
    network.getTxnRetrieveTopLevel(this.props.params.txnId,this.props.params.itxnId);
  }



  render() {
    const store = this.props.txnRetrieve;
    const isWeb3 = (store.response) ? store.response.web3 : false;

    const isLoadingTopLevel = this.isFirstRenderAfterMount || store.isLoadingTopLevel;
    const txnObj = (store.response) ? store.response.txn : null;
    const itxnObj = (store.response) ? store.response.itxn : null;

    const isTxnValid = nc_isObjectValid(txnObj);
    const isTxnEmpty = nc_isObjectEmpty(txnObj, isTxnValid);
    const isItxnValid = nc_isObjectValid(itxnObj);
    const isItxnEmpty = nc_isObjectEmpty(itxnObj, isItxnValid);

    const isValid = isItxnValid ? true : isTxnValid;
    const isEmpty = isItxnValid ? isItxnEmpty : isTxnEmpty;

    //const txn = isTxnEmpty ? {} : txnObj.content[0];
    const txn = isItxnEmpty ? isTxnEmpty ? {} : txnObj.content[0] : itxnObj.content[0];


    /*This section is for transfers table. This feature was added to accomodate for internal transfers made on tokens.*/

    const isTrnListFirstLoad = (store.response && store.response.trn) ? store.response.trn.momentUpdated : null;
    const trnList = (store.response && store.response.trn) ? store.response.trn.data : null;
    //console.log(JSON.stringify(store.response.trn));
    const isTrnListValid = nc_isListValid(trnList);
    const isTrnListEmpty = nc_isListEmpty(trnList, isTrnListValid);
    /*End*/

     const transferListSection = <NCExplorerSection 
      className={""}
      subtitle={
        <div className="NCPageBreakerSubtitle">
        {MSG.Transaction.DATA_POLICY}
        </div>
      }

      isLoading={isLoadingTopLevel == null}
      isDataValid={true}
      isDataEmpty={isTrnListEmpty} 
      
      loadingStr={MSG.Transaction.LOADING}
      invalidDataStr={MSG.Transaction.INVALID_DATA} 
      emptyDataStr={MSG.Transaction.EMPTY_DATA_LIST}
      marginTop={40}

      content={
                <NCTxnTableOwnTransfer 
                  data={trnList}
                  onPageCallback={this.requestPagingTrnList}
                  isLoading={store.isLoadingPagingTrnList}
                  isPaginated={true}
                  ownAddr={desc}
                  isLatest={true}/>
              }
    /> 

    const breadcrumbs = [
      {
        link: '/',
        body: MSG.strings.bread,
      },
      {
        link: '/transactions',
        body: MSG.strings.bread_slice.txn,
      },
      {
        link: '#',
        body: MSG.strings.bread_crumb.txn,
      }
    ];

    const desc = nc_hexPrefix(store.queryStr);

    const eventLog =  {};
    const eventListSection = <NCExplorerSection
      className={""}
      subtitle={
        <div className="NCPageBreakerSubtitle">Showing events for this transaction.</div>
      }

      isLoading={false}
      isDataValid={true}
      isDataEmpty={false} 
      
      loadingStr={"Loading Event Logs"}
      invalidDataStr={"Server provided an invalid response. Please try again."} 
      emptyDataStr={"No events found for this transaction"}
      isToplevelSection={false}
      
      content={
        <NCTxnEventLogTable 
          data= {eventLog}
          onPageCallback={null}
          isLoading={false}
          isPaginated={false}
          isLatest={true}/>
        }
      marginTop={40}
    />

    const page =
            <div>
            <NCExplorerHead
              momentUpdated={store.momentUpdated}
              breadcrumbs={breadcrumbs}
              title={(!isItxnValid)?"Transaction":"Internal Transaction"}
              subtitle={desc}/>
            <NCTxnDetail i = {isItxnValid} entity={txn}/>

            {
              (isTxnEmpty && !isItxnValid) &&
              <NCNonIdealState
                paddingTop={80}
                icon={"pt-icon-offline"}
                title={"Event meta are unavailable"}
                description={"Please try again later."}/>
            }
            {
              (!isTxnEmpty && !isItxnValid) &&
              <div className="NCSection">
                <hr className="nc-hr"/>
                <Tabs2 id="NCSectionTabbed" className="NCSectionTabbed" large={true} renderActiveTabPanelOnly={true}>
                  <Tab2 id="trn" title="Internal Transactions" panel={transferListSection}/>
                </Tabs2>
                <hr className="nc-hr"/>
              </div>
            }

            </div>


    return (
      <NCExplorerPage
        isLoading={isLoadingTopLevel}
        isDataValid={isValid}
        isDataEmpty={isEmpty}
        
        loadingStr={MSG.Transaction.LOADING}
        invalidDataStr={MSG.Transaction.INVALID_DATA}
        emptyDataStr={MSG.Transaction.EMPTY_DATA+" "+ desc }
        
        page={page}/>
    );
  }
}

export default connect((state) => {
  return ({
    txnRetrieve: state.txnRetrieve,
  })
})(NCTxnRetrieve);














































