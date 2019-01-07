/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { Tab2, Tabs2, Tooltip } from "@blueprintjs/core";

import NCBlkTable from 'components/blocks/NCBlkTable';
import NCHolderTable from 'components/tokens/NCHolderTable';
import NCTxnTableOwn from 'components/transactions/NCTxnTableOwn';
import NCTxnTableOwnToken from 'components/transactions/NCTxnTableOwnToken';

import NCTknDetail from 'components/tokens/NCTknDetail';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCTExplorerHead from 'components/common/NCTExplorerHead';
import NCExplorerSection from 'components/common/NCExplorerSection';
import NCNonIdealState from 'components/common/NCNonIdealState';

import * as StoreTknRetrieve from 'stores/StoreTknRetrieve';
import * as MSG from 'lib/NCTerms';

import { nc_hexPrefix, nc_isListValid, nc_isListEmpty, nc_isPositiveInteger, nc_isObjectValid, nc_isObjectEmpty } from 'lib/NCUtility';
import * as network from 'network/NCNetworkRequests';

class NCTknRetrieve extends Component
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
    if (prevProps.params.tknId != this.props.params.tknId)
      this.requestTopLevel();
  }

  requestTopLevel = () => {
    network.getTknRetrieveTopLevel(this.props.params.tknId);
  }

  requestPagingTxnList = (pageNumber) => {
    const queryStr = this.props.tknRetrieve.queryStr;
    network.getTknRetrievePagingTxnList(queryStr, pageNumber);
  }
  
  requestPagingBlkList = (pageNumber) => {
    const queryStr = this.props.tknRetrieve.queryStr;
    network.getTknRetrievePagingBlkList(queryStr, pageNumber);
  }
  

  render() {
    const store = this.props.tknRetrieve;

    //console.log(JSON.stringify(store));
    
    const isWeb3 = (store.response) ? store.response.web3 : false;

    const isLoadingTopLevel = this.isFirstRenderAfterMount || store.isLoadingTopLevel;

    const isTxnListFirstLoad = (store.response && store.response.transfers) ? store.response.transfers.momentUpdated : null;
    const isAccListFirstLoad = (store.response && store.response.holders) ? store.response.holders.momentUpdated : null;
     
    const tknObj = (store.response && store.response.tkn) ? store.response.tkn.data : null;
    
    const txnList = (store.response && store.response.transfers) ? store.response.transfers.data : null;
    const accList = (store.response && store.response.holders) ? store.response.holders.data : null;

    const isTknValid = nc_isObjectValid(tknObj);
    const isTknEmpty = nc_isObjectEmpty(tknObj, isTknValid);

    const isTxnListValid = nc_isListValid(txnList);
    const isTxnListEmpty = nc_isListEmpty(txnList, isTxnListValid);

    const isAccListValid = nc_isListValid(accList);
    const isAccListEmpty = nc_isListEmpty(accList, isAccListValid);

    const tkn = isTknEmpty ? {} : tknObj.content[0];
   
    const breadcrumbs = [
      {
        link: '/',
        body: 'Home',
      },
      {
        link: '/tokens',
        body: 'Tokens',
      },
      {
        link: '#',
        body: 'Token Details',
      }
    ];
    
    //const name = " ";//store.response.tkn.content[0].name;//tkn.content.name;
    
    const truth = true;
    const desc = nc_hexPrefix(store.queryStr);
    
    const tknBalanceSection = <NCExplorerSection 
      className={""}

      isLoading={isLoadingTopLevel}
      isDataValid={truth}
      isDataEmpty={!truth} 

      emptyDataTitle={MSG.Token.EMPTY_DATA_TITLE}
      invalidDataTitle={MSG.Token.INVALID_DATA_TITLE}
      
      loadingStr={MSG.Token.LOADING}
      invalidDataStr={MSG.Token.INVALID_DATA} 
      emptyDataStr={MSG.Token.EMPTY_DATA_STR + name}
      marginTop={20}
      marginBottom={30}

      content={ <NCTknDetail entity={tkn}/> }
    />

   const txnListSection = <NCExplorerSection 
      className={""}
      subtitle={
        <div className="NCPageBreakerSubtitle">Showing results from the latest transactions. To retrieve older data, use our&nbsp;
          <Tooltip
            className="pt-tooltip-indicator"
            content={<em>coming soon ...</em>}>
            historical explorer.
          </Tooltip>
        </div>
      }

      isLoading={isTxnListFirstLoad == null}
      isDataValid={isTxnListValid}
      isDataEmpty={isTxnListEmpty}  
      
      loadingStr={MSG.Transaction.LOADING}
      invalidDataStr={MSG.Transaction.INVALID_DATA} 
      emptyDataStr={
        <span>No transactions found for this token. <br/>To retrieve older data, use our&nbsp;
          <Tooltip
            className="pt-tooltip-indicator"
            content={<em>coming soon ...</em>}>
            historical explorer.
          </Tooltip>
        </span>}
      marginTop={40}

      content={
        <NCTxnTableOwnToken 
          data={txnList}
          onPageCallback={this.requestPagingTxnList}
          isLoading={store.isLoadingPagingTxnList}
          isPaginated={true}
          ownAddr={desc}
          isLatest={true}/>
        }
    />

    const accListSection = <NCExplorerSection 
      className={""}
      subtitle={
        <div className="NCPageBreakerSubtitle">Showing results from the latest blocks. To retrieve older data, use our&nbsp;
          <Tooltip
            className="pt-tooltip-indicator"
            content={<em>coming soon ...</em>}>
            historical explorer.
          </Tooltip>
        </div>
      }

      isLoading={isAccListFirstLoad == null}
      isDataValid={isAccListValid}
      isDataEmpty={isAccListEmpty} 
      
      loadingStr={MSG.Account.LOADING}
      invalidDataStr={MSG.Account.INVALID_DATA} 
      emptyDataStr={
        <span>No accounts found for this token. <br/>To retrieve older data, use our&nbsp;
          <Tooltip
            className="pt-tooltip-indicator"
            content={<em>coming soon ...</em>}>
            historical explorer.
          </Tooltip>
        </span>}
      marginTop={40}

      content={
        <NCHolderTable 
          data={accList}
          onPageCallback={this.requestPagingBlkList}
          isLoading={store.isLoadingPagingBlkList}
          isPaginated={true}
          isLatest={true}/>
        }
    />

    const page =
      <div> 
        <NCTExplorerHead
          momentUpdated={store.momentUpdated} 
          breadcrumbs={breadcrumbs}
          title={"Token"}
          subtitle={tkn}/>  
        { tknBalanceSection }
        <hr className="nc-hr"/>
       
          <div className="NCSection">
            <Tabs2 id="NCSectionTabbed" className="NCSectionTabbed" large={true} renderActiveTabPanelOnly={true}>
              <Tab2 id="transfers" title="Transfers" panel={txnListSection}/>
              <Tab2 id="holders" title="Holders" panel={accListSection}/>
            </Tabs2>
          </div>
        
        
        
      </div>;

    return (
      <NCExplorerPage
        isLoading={isLoadingTopLevel}
        isDataValid={true} 
        isDataEmpty={false}
        
        loadingStr={MSG.Token.LOADING}
        invalidDataStr={MSG.Token.INVALID_DATA}
        emptyDataStr={MSG.Token.EMPTY_DATA_STR + name + "."}
        
        page={page}/>
    );
  }
}

export default connect((state) => {
  return ({
    tknRetrieve: state.tknRetrieve,
  })
})(NCTknRetrieve);














































