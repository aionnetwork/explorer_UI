/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { Tab2, Tabs2, Tooltip } from "@blueprintjs/core";

import NCBlkTable from 'components/blocks/NCBlkTable';
import NCTxnTableOwn from 'components/transactions/NCTxnTableOwn';

import NCTknDetail from 'components/tokens/NCTknDetail';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCTExplorerHead from 'components/common/NCTExplorerHead';
import NCExplorerSection from 'components/common/NCExplorerSection';
import NCNonIdealState from 'components/common/NCNonIdealState';

import * as StoreTknRetrieve from 'stores/StoreTknRetrieve';

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
  /*
  requestPagingBlkList = (pageNumber) => {
    const queryStr = this.props.tknRetrieve.queryStr;
    network.getTknRetrievePagingBlkList(queryStr, pageNumber);
  }
  */

  render() {
    const store = this.props.tknRetrieve;
    
    const isWeb3 = (store.response) ? store.response.web3 : false;

    const isLoadingTopLevel = this.isFirstRenderAfterMount || store.isLoadingTopLevel;

    console.log("page Data for retrieve: "+JSON.stringify(this.props));

    const isTxnListFirstLoad = (store.response && store.response.txn) ? store.response.txn.momentUpdated : null;
    const isBlkListFirstLoad = (store.response && store.response.blk) ? store.response.blk.momentUpdated : null;

    //const name = this.props.tknRetrieve.response.tkn.name;
    //console.log("this is whats happening: "+JSON.stringify(isTxnListFirstLoad));
    

    const token = (store.response && store.response.tkn) ? store.response.tkn.content[0] : null;
     
    
    const txnList = (store.response && store.response.txn) ? store.response.txn : null;
    const blkList = (store.response && store.response.blk) ? store.response.blk : null;

    //console.log(JSON.stringify(txnList));//const isTknValid = nc_isObjectValid(tknObj);
    //const isTknEmpty = nc_isObjectEmpty(tknObj, isTknValid);

    const isTxnListValid = nc_isListValid(txnList);
    const isTxnListEmpty = nc_isListEmpty(txnList, isTxnListValid);

    const isBlkListValid = nc_isListValid(blkList);
    const isBlkListEmpty = nc_isListEmpty(blkList, isBlkListValid);

    //const tkn = isTknEmpty ? {} : tknObj;
    //const tkn = tknObj[0];
    
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

      emptyDataTitle={"Account Not Found"}
      invalidDataTitle={"Account Service Unavailable"}
      
      loadingStr={"Loading Account"}
      invalidDataStr={"Account Service Unavailable. Please try again."} 
      emptyDataStr={"No Data Available for Account: "+name}
      marginTop={20}
      marginBottom={30}

      content={ <NCTknDetail entity={token}/> }
    />

   const txnListSection = <NCExplorerSection 
      className={""}
      subtitle={
        <div className="NCPageBreakerSubtitle">Showing results from the latest million transactions. To retrieve older data, use our&nbsp;
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
      
      loadingStr={"Loading Transactions"}
      invalidDataStr={"Server provided an invalid response. Please try again."} 
      emptyDataStr={
        <span>No transactions found for this account in latest million transactions. <br/>To retrieve older data, use our&nbsp;
          <Tooltip
            className="pt-tooltip-indicator"
            content={<em>coming soon ...</em>}>
            historical explorer.
          </Tooltip>
        </span>}
      marginTop={40}

      content={
        <NCTxnTableOwn 
          data={txnList}
          onPageCallback={this.requestPagingTxnList}
          isLoading={store.isLoadingPagingTxnList}
          isPaginated={true}
          ownAddr={desc}
          isLatest={true}/>
        }
    />

    const blkListSection = <NCExplorerSection 
      className={""}
      subtitle={
        <div className="NCPageBreakerSubtitle">Showing results from the latest million blocks. To retrieve older data, use our&nbsp;
          <Tooltip
            className="pt-tooltip-indicator"
            content={<em>coming soon ...</em>}>
            historical explorer.
          </Tooltip>
        </div>
      }

      isLoading={isBlkListFirstLoad == null}
      isDataValid={isBlkListValid}
      isDataEmpty={isBlkListEmpty} 
      
      loadingStr={"Loading Accounts"}
      invalidDataStr={"Server provided an invalid response. Please try again."} 
      emptyDataStr={
        <span>No blocks mined by this account in latest million blocks. <br/>To retrieve older data, use our&nbsp;
          <Tooltip
            className="pt-tooltip-indicator"
            content={<em>coming soon ...</em>}>
            historical explorer.
          </Tooltip>
        </span>}
      marginTop={40}

      content={
        <NCBlkTable 
          data={blkList}
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
          subtitle={token}/>  
        { tknBalanceSection }
        <hr className="nc-hr"/>
        {
          (false) &&
          <NCNonIdealState
            paddingTop={80}
            icon={"pt-icon-offline"}
            title={"Unavailable In Lite-Mode"}
            description={"Account transactions & blocks-mined not available in lite-mode."}/>
        }
        {
          (true) &&  
          <div className="NCSection">
            <Tabs2 id="NCSectionTabbed" className="NCSectionTabbed" large={true} renderActiveTabPanelOnly={true}>
              <Tab2 id="txn" title="Transfers" panel={txnListSection}/>
              <Tab2 id="blk" title="Holders" panel={blkListSection}/>
            </Tabs2>
          </div>
        }
        
        
      </div>;

    return (
      <NCExplorerPage
        isLoading={isLoadingTopLevel}
        isDataValid={true} 
        isDataEmpty={false}
        
        loadingStr={"Loading Token Details"}
        invalidDataStr={"Token Service Unavailable. Token data invalid."}
        emptyDataStr={"No token found for descriptor: " + name + "."}
        
        page={page}/>
    );
  }
}

export default connect((state) => {
  return ({
    tknRetrieve: state.tknRetrieve,
  })
})(NCTknRetrieve);














































