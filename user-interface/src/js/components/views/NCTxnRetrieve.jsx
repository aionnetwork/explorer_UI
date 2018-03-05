/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import NCTxnDetail from 'components/transactions/NCTxnDetail';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';

import * as StoreTxnRetrieve from 'stores/StoreTxnRetrieve';

import { nc_hexPrefix, nc_isObjectValid, nc_isObjectEmpty } from 'lib/NCUtility';
import * as network from 'network/NCNetworkRequests';

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
    if (prevProps.params.txnId != this.props.params.txnId)
      this.requestTopLevel();
  }

  requestTopLevel = () => {
    network.getTxnRetrieveTopLevel(this.props.params.txnId);
  }

  render() {
    const store = this.props.txnRetrieve;

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

    const page =
      <div> 
        <NCExplorerHead
          momentUpdated={store.momentUpdated} 
          breadcrumbs={breadcrumbs}
          title={"Transaction"}
          subtitle={desc}/>  
        <NCTxnDetail entity={txn}/>
        <hr className="nc-hr"/>
      </div>;

    return (
      <NCExplorerPage
        isLoading={isLoadingTopLevel}
        isDataValid={isTxnValid} 
        isDataEmpty={isTxnEmpty}
        
        loadingStr={"Loading Block Details"}
        invalidDataStr={"Server error. Block structure invalid."}
        emptyDataStr={"No transaction found for descriptor: " + desc + "."}
        
        page={page}/>
    );
  }
}

export default connect((state) => {
  return ({
    txnRetrieve: state.txnRetrieve,
  })
})(NCTxnRetrieve);














































