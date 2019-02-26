/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import moment from 'moment';
//import { Spinner } from "@blueprintjs/core";

import NCTxnTableRT from 'components/transactions/NCTxnTableRT';

//import NCNonIdealState from 'components/common/NCNonIdealState';
//import NCLoading from 'components/common/NCLoading';
import NCComponentLazyLoad from 'components/common/NCComponentLazyLoad';

import NCExplorerSection from 'components/common/NCExplorerSection';
import * as MSG from 'lib/NCTerms';

const RT_TRANSACTIONS_LIMIT = 10;

class NCTxnRealtime extends Component
{  
  render() {
    const store = this.props.txnRt;

    const isDataValid = store.data != null && Array.isArray(store.data);
    const isLoading = (store.momentUpdated == null);
    
    const isDataEmpty = isDataValid && store.data <= 0;
    const txnList = isDataValid ? store.data.slice(0, RT_TRANSACTIONS_LIMIT) : null;
    
    return (
      <NCComponentLazyLoad>
        <NCExplorerSection
          className="NCTxnRealtime"

          isLoading={isLoading}
          isDataValid={isDataValid}
          isDataEmpty={isDataEmpty}

          content={<NCTxnTableRT entities={txnList}/>}

          loadingStr={MSG.Transaction.LOADING}
          invalidDataStr={MSG.Transaction.INVALID_DATA}
          emptyDataStr= {MSG.Transaction.EMPTY_DATA_LIST}

          marginTop={100} 
          
          invalidDataTitle={MSG.Transaction.INVALID_DATA_LIST}
          emptyDataTitle={MSG.Transaction.EMPTY_DATA_TITLE} 
        />
      </NCComponentLazyLoad>
    );
  }
}

export default connect((state) => {
  return ({
    txnRt: state.txnRt,
  })
})(NCTxnRealtime);





















































