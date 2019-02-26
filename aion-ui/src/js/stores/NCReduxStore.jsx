/* eslint-disable */
import { createStore, combineReducers } from 'redux';

import { reducer_kpis } from 'stores/StoreKpis';
import { reducer_dark } from 'stores/StoreDark';

import { reducer_blkRt } from 'stores/StoreBlkRt';
import { reducer_blkList } from 'stores/StoreBlkList';
import { reducer_blkRetrieve } from 'stores/StoreBlkRetrieve';

import { reducer_txnRt } from 'stores/StoreTxnRt';
import { reducer_txnList } from 'stores/StoreTxnList';
import { reducer_txnRetrieve } from 'stores/StoreTxnRetrieve';

import { reducer_accList } from 'stores/StoreAccList';
import { reducer_accRetrieve } from 'stores/StoreAccRetrieve';

import { reducer_cntrList } from 'stores/StoreCntrList';
import { reducer_cntrRetrieve } from 'stores/StoreCntrRetrieve';

import { reducer_tknList } from 'stores/StoreTknList';
import { reducer_tknRetrieve } from 'stores/StoreTknRetrieve';

import { reducer_chartRetrieve } from 'stores/StoreChartRetrieve';
import { reducer_contactRetrieve } from 'stores/StoreContactRetrieve';

import { reducer_Retrieve } from 'stores/StoreRetrieve';
// store -----------------------------------------------------------------

export const store = createStore(combineReducers(
{
  kpi: reducer_kpis,
  dark: reducer_dark,
  feedback: reducer_contactRetrieve,

  blkRt: reducer_blkRt,
  blkList: reducer_blkList,
  blkRetrieve: reducer_blkRetrieve,

  txnRt: reducer_txnRt,
  txnList: reducer_txnList,
  txnRetrieve: reducer_txnRetrieve,  

  accList: reducer_accList,
  accRetrieve: reducer_accRetrieve,

  cntrList: reducer_cntrList,
  cntrRetrieve: reducer_cntrRetrieve,

  tknList: reducer_tknList,
  tknRetrieve: reducer_tknRetrieve,
  searchRetrieve: reducer_Retrieve,

  chartRetrieve: reducer_chartRetrieve,

}));
