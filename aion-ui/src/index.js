/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRedirect, hashHistory} from 'react-router'
import { Provider } from 'react-redux'

import { FocusStyleManager } from "@blueprintjs/core";

import NoMatch from 'components/common/NCNoMatch';
import Layout from 'components/layout/NCLayout';

import Dashboard from 'components/views/NCDashboard';

import BlkList from 'components/views/NCBlkList';
import BlkRetrieve from 'components/views/NCBlkRetrieve';

import TxnList from 'components/views/NCTxnList';
import TxnRetrieve from 'components/views/NCTxnRetrieve';

import TknList from 'components/views/NCTknList';
import TknRetrieve from 'components/views/NCTknRetrieve';

import AccList from 'components/views/NCAccList';
import AccRetrieve from 'components/views/NCAccRetrieve';

import CntrList from 'components/views/NCCntrList';
import CntrRetrieve from 'components/views/NCCntrRetrieve';

import ChartRetrieve from 'components/views/NCchart';
import DwnRetrieve from 'components/views/NCDwnRetrieve';

import TermsRetrieve from 'components/views/TermsRetrieve';
import ContactsRetrieve from 'components/views/NCContactsRetrieve';

//this url is to facilitate universal search for blocks/transaction/token/accounts
import SearchRetrieve from 'components/views/NCSearchRetrieve';

import NoResults from 'components/views/NCNoResults';

import { store } from 'stores/NCReduxStore';
import appConfig from './config.json';

//this section is related to Google analytics
//import ReactGA from 'react-ga';
//ReactGA.initialize(appConfig.ga_key);
//ReactGA.pageview(window.location.pathname + window.location.search);
//google analytics

// import css files
import '../node_modules/normalize.css/normalize.css';
import '../node_modules/@blueprintjs/core/dist/blueprint.css';
import '../node_modules/@blueprintjs/datetime/dist/blueprint-datetime.css';
import '../node_modules/@blueprintjs/table/dist/table.css';

import './css/app.css';
import './css/custom.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';


// disable focus border accessibility feature (blueprintjs)
FocusStyleManager.onlyShowFocusOnTabs();

//console.log('1st index!');



ReactDOM.render((
  <Provider store={ store }>
    <Router onUpdate={() => window.scrollTo(0, 0)} history={ hashHistory }>
      <Route path="/" component={ Layout }>
        
        <IndexRedirect to="dashboard"/>
        <Route path="dashboard" component={ Dashboard }/>

        <Route path="blocks" component={ BlkList }/>
        <Route path="block/:blkId" component={ BlkRetrieve }/>

        <Route path="transactions" component={ TxnList }/>
        <Route path="transaction/:txnId(/:itxnId)" component={ TxnRetrieve }/>

        <Route path="tokens" component={ TknList }/>
        <Route path="token/:tknId" component={ TknRetrieve }/>

        <Route path="accounts" component={ AccList }/>
        <Route path="account/:accId(/:tknId)" component={ AccRetrieve }/>

        <Route path="contracts" component={ CntrList }/>
        <Route path="contract/:cntrId" component={ CntrRetrieve }/>

        <Route path="charts/:chartId" component={ ChartRetrieve }/>

        <Route path="downloads/:accId" component={ DwnRetrieve }/>

        <Route path="terms" component={ TermsRetrieve }/>
        <Route path="feedback" component={ ContactsRetrieve }/>

        <Route path="no-results(/:query)" component={ NoResults }/>

        <Route path="search/" component={ SearchRetrieve }/>

        <Route path="*" component={ NoMatch }/>
      </Route>
    </Router>
  </Provider>), document.getElementById('root')
);


































