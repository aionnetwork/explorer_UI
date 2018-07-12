/* eslint-disable */
import { createStore, combineReducers } from 'redux';

import { reducer_kpis } from 'stores/StoreKpis';

import { reducer_blkRt } from 'stores/StoreBlkRt';
import { reducer_blkList } from 'stores/StoreBlkList';
import { reducer_blkRetrieve } from 'stores/StoreBlkRetrieve';

import { reducer_txnRt } from 'stores/StoreTxnRt';
import { reducer_txnList } from 'stores/StoreTxnList';
import { reducer_txnRetrieve } from 'stores/StoreTxnRetrieve';

import { reducer_accList } from 'stores/StoreAccList';
import { reducer_accRetrieve } from 'stores/StoreAccRetrieve';

// store -----------------------------------------------------------------

export const store = createStore(combineReducers(
{
  kpi: reducer_kpis,

  blkRt: reducer_blkRt,
  blkList: reducer_blkList,
  blkRetrieve: reducer_blkRetrieve,

  txnRt: reducer_txnRt,
  txnList: reducer_txnList,
  txnRetrieve: reducer_txnRetrieve,  

  accList: reducer_accList,
  accRetrieve: reducer_accRetrieve
}));
