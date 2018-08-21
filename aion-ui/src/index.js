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

import NoResults from 'components/views/NCNoResults';

import { store } from 'stores/NCReduxStore';


//this section is related to Google analytics
//import ReactGA from 'react-ga';
//ReactGA.initialize('UA-121993888-1');
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

console.log('1st index!');

ReactDOM.render((
  <Provider store={ store }>
    <Router onUpdate={() => window.scrollTo(0, 0)} history={ hashHistory }>
      <Route path="/" component={ Layout }>
        
        <IndexRedirect to="/"/>
        <Route path="dashboard" component={ Dashboard }/>

        {/* 
            Support 2 kind(s) of block lists: 
              1. /blocks                => All blocks 
              2. /blocks?account={...}  => Mined by address
        */}
        <Route path="blocks" component={ BlkList }/>
        <Route path="block/:blkId" component={ BlkRetrieve }/>

        {/* 
            Support 3 kind(s) of transation lists: 
              1. /transactions          => All transactions 
              2. /transactions?block    => Transactions in block
              3. /transactions?account  => Transactions by account
        */}
        <Route path="transactions" component={ TxnList }/>
        <Route path="transaction/:txnId" component={ TxnRetrieve }/>

        {/* 
            Support 2 kind(s) of token lists: 
              1. /tokens          => All transactions 
              2. /tokens?address    => Token by address
              
        */}
        <Route path="tokens" component={ TknList }/>
        <Route path="token/:tknId" component={ TknRetrieve }/>


        
        {/* 
            Support 1 kind(s) of account lists: 
              1. /accounts  => All accounts 
            Temporarily suspended due to no support from backend service. 
            This accounts list view will be the equivalent of the "rich list" once we write the backend service to support it
        */}
        <Route path="accounts" component={ AccList }/>
        <Route path="account/:accId" component={ AccRetrieve }/>

        <Route path="no-results(/:query)" component={ NoResults }/>

        <Route path="*" component={ NoMatch }/>
      </Route>
    </Router>
  </Provider>), document.getElementById('root')
);


































