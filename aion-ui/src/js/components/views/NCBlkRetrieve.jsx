/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, hashHistory } from 'react-router';
import moment from 'moment';

import { Button, Tab2, Tabs2 } from "@blueprintjs/core";

//import NCTxnTable from 'components/transactions/NCTxnTable';
import NCTxnTable from 'components/transactions/NCV2TxnTable';
import NCBlkDetail from 'components/blocks/NCBlkDetail';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
import NCExplorerSection from 'components/common/NCExplorerSection';

import NCTxnTableOwnTransfer from 'components/transactions/NCTxnTableOwnTransfer';

import * as StoreBlkRetrieve from 'stores/StoreBlkRetrieve';

import * as MSG from 'lib/NCTerms';
import { nc_LinkToEntity, nc_hexPrefix, nc_isListValid, nc_isListEmpty, nc_isObjectValid, nc_isObjectEmpty, nc_isPositiveInteger } from 'lib/NCUtility';
import * as network from 'network/NCNetworkRequests';

class NCBlkRetrieve extends Component
{
  constructor(props) {
    super(props);
  }

  submitQuery(num){
      let entity = this.props.blkRetrieve.response.blk;

      let str = this.props.params.blkId + num;
      nc_LinkToEntity(this.props.blkRetrieve.response.blk, this.props.params.blkId);
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
    if (prevProps.params.blkId != this.props.params.blkId)
      this.requestTopLevel();
  }

  requestTopLevel = () => {
    network.getBlkRetrieveTopLevel(this.props.params.blkId);
  }

  requestPagingTxnList = (pageNumber) => {
     //network.getBlkRetrievePagingTxnList(queryStr, pageNumber);
  }

  render() {
    const store = this.props.blkRetrieve;

    const isLoadingTopLevel = this.isFirstRenderAfterMount || store.isLoadingTopLevel;
    const queryStr = store.queryStr;
    const desc = nc_isPositiveInteger(queryStr) ? '#'+queryStr : nc_hexPrefix(queryStr);

    const blkObj = (store.response) ? store.response.blk : null;
    const txnList = (store.response) ? store.response.txn : null;
    //console.log(JSON.stringify(txnList));
    const trnList = (store.response) ? store.response.itxn : null;

    let isBlkValid = nc_isObjectValid(blkObj);
    let isBlkEmpty = nc_isObjectEmpty(blkObj, isBlkValid);

    let isTxnListValid = nc_isListValid(txnList);
    let isTxnListEmpty = nc_isListEmpty(txnList, isTxnListValid);

    let isTrnListValid = nc_isListValid(trnList);
    let isTrnListEmpty = nc_isListEmpty(trnList, isTrnListValid);

    let prev = null;
    let next = null;

    if(!isBlkEmpty){
        
        let block = blkObj.content[0]['blockNumber'];
        prev = parseInt(block)-1;
        next = parseInt(block)+1;
    }

    const blk = isBlkEmpty ? {} : blkObj.content[0]; 

    const breadcrumbs = [
      {
        link: '/',
        body: MSG.strings.bread,
      },
      {
        link: '/blocks',
        body: MSG.strings.bread_slice.blk,
      },
      {
        link: '#',
        body: MSG.strings.bread_crumb.blk,
      }
    ];

    const txnListSection = <NCExplorerSection 
      className={""}

      isLoading={isLoadingTopLevel}
      isDataValid={isTxnListValid}
      isDataEmpty={isTxnListEmpty} 
      
      loadingStr={"Loading Transactions"}
      invalidDataStr={"Server provided an invalid response. Please try again."} 
      emptyDataStr={"No transactions found for this block."}
      isToplevelSection={false}
      
      content={
        <NCTxnTable 
          data={txnList}
          onPageCallback={this.requestPagingTxnList}
          isLoading={store.isLoadingPagingTxnList}
          isPaginated={true}/>
        }
      marginTop={40}
    />

    const transferListSection = <NCExplorerSection
          className={""}
          subtitle={
            <div className="NCPageBreakerSubtitle">
            {MSG.Transaction.DATA_POLICY}
            </div>
          }

          isLoading={isLoadingTopLevel}
          isDataValid={isTxnListValid}
          isDataEmpty={isTxnListEmpty}

          loadingStr={MSG.Transaction.LOADING}
          invalidDataStr={MSG.Transaction.INVALID_DATA}
          emptyDataStr={MSG.Transaction.EMPTY_DATA_LIST}
          marginTop={40}

          content={
                    <NCTxnTableOwnTransfer
                      data={trnList}
                      onPageCallback={this.requestPagingTrnList}
                      isLoading={false}
                      isPaginated={true}
                      ownAddr={desc}
                      isLatest={true}/>
                  }
        />
    

    const page =
      <div> 
        <NCExplorerHead
          momentUpdated={store.momentUpdated} 
          breadcrumbs={breadcrumbs}
          title={MSG.strings.Blk_detail_title}
          subtitle={desc}


        />  

        <Button onClick={() => {hashHistory.push('/block/' + prev);}} className = "pt-button pt-minimal" iconName="arrow-left" text="Previous block" />
        <Button onClick={() => {hashHistory.push('/block/' + next);}} className = "pt-button pt-minimal pull-right" rightIconName="arrow-right"  text="Next block" />
        
        <br/><br/>

        <NCBlkDetail entity={blk}/>
        <hr className="nc-hr"/>
        {
          (!isBlkEmpty && !isTxnListEmpty) &&
          <div className="NCSection">
            <Tabs2 id="NCSectionTabbed" className="NCSectionTabbed" large={true} renderActiveTabPanelOnly={true}>
              <Tab2 id="txn" title="Included Transactions" panel={txnListSection} />
              {(!isTrnListEmpty) &&
                <Tab2 id="itxn" title="Internal Transactions" panel={transferListSection} />
              }
            </Tabs2>
          </div>
        }
        
      </div>;

      

    return (
      <NCExplorerPage
        isLoading={isLoadingTopLevel}
        isDataValid={isBlkValid} 
        isDataEmpty={isBlkEmpty}
        
        loadingStr={MSG.Block.LOADING}
        invalidDataStr={MSG.Block.INVALID_DATA}
        emptyDataStr={MSG.Block.EMPTY_DATA + desc + "."}
        
        page={page}/>
    );
  }
}

export default connect((state) => {
  return ({
    blkRetrieve: state.blkRetrieve,
  })
})(NCBlkRetrieve);














































