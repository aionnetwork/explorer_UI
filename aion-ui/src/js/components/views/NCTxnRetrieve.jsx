/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import NCTxnDetail from 'components/transactions/NCTxnDetail';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
import NCExplorerSection from 'components/common/NCExplorerSection';

import NCNonIdealState from 'components/common/NCNonIdealState';
import NCTxnEventLogTable from 'components/transactions/NCTxnEventLogTable';

import * as StoreTxnRetrieve from 'stores/StoreTxnRetrieve';
import { Position, Popover, Tab2, Tabs2, Tooltip, Button, Menu, MenuItem, PopoverInteractionKind } from "@blueprintjs/core";
import {CopyToClipboard} from 'react-copy-to-clipboard';

import { nc_hexPrefix, nc_isObjectValid, nc_isObjectEmpty } from 'lib/NCUtility';
import * as network from 'network/NCNetworkRequests';

import * as MSG from 'lib/NCTerms';

class NCTxnRetrieve extends Component
{
  constructor(props) {
    super(props);
    
  }

  componentWillMount() {
    this.isFirstRenderAfterMount = true;
    console.log('componentWillMount');
  }

  componentDidMount() {
    console.log('componentDidMount');
    this.requestTopLevel();
  }

  componentWillReceiveProps(nextProps) {
    this.isFirstRenderAfterMount = false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.params.txnId != this.props.params.txnId)
      this.requestTopLevel();
  }

  requestTopLevel = () => {
    console.log('requestTopLevel');
    network.getTxnRetrieveTopLevel(this.props.params.txnId);
  }



  render() {
    const store = this.props.txnRetrieve;
    const isWeb3 = (store.response) ? store.response.web3 : false;

    const isLoadingTopLevel = this.isFirstRenderAfterMount || store.isLoadingTopLevel;
    const txnObj = (store.response) ? store.response.txn : null;
    
    const isTxnValid = nc_isObjectValid(txnObj);
    const isTxnEmpty = nc_isObjectEmpty(txnObj, isTxnValid);

    const txn = isTxnEmpty ? {} : txnObj.content[0];

    const breadcrumbs = [
      {
        link: '/',
        body: 'Home',
      },
      {
        link: '/transactions',
        body: 'Transactions',
      },
      {
        link: '#',
        body: 'Transaction Details',
      }
    ];

    const desc = nc_hexPrefix(store.queryStr);

    const eventLog =  {
            'content' : [ 
                  'key1' : 'input1',
                  'key2' : 'input2'
                ],
            
};

    //console.log(eventLog);

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
          title={"Transaction"}
          subtitle={desc}/>  
        <NCTxnDetail entity={txn}/>
        <hr className="nc-hr"/>

        {
          (isTxnEmpty) &&
          <NCNonIdealState
            paddingTop={80}
            icon={"pt-icon-offline"}
            title={"Event logs are unavailable"}
            description={"Please try again later."}/>
        }
        {/*
          (!isTxnEmpty) &&  
          <div className="NCSection">
            <Tabs2 id="NCSectionTabbed" className="NCSectionTabbed" large={true} renderActiveTabPanelOnly={true}>
              <Tab2 id="txn" title="Event logs" panel={eventListSection}/>
              
            </Tabs2>
          </div>
        */}


      </div>;

    return (
      <NCExplorerPage
        isLoading={isLoadingTopLevel}
        isDataValid={isTxnValid} 
        isDataEmpty={isTxnEmpty}
        
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














































