/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, hashHistory } from 'react-router';
import moment from 'moment';

import { Button, Tab2, Tabs2 } from "@blueprintjs/core";

import NCTxnTable from 'components/transactions/NCTxnTable';
import NCBlkDetail from 'components/blocks/NCBlkDetail';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
import NCExplorerSection from 'components/common/NCExplorerSection';

import * as StoreBlkRetrieve from 'stores/StoreBlkRetrieve';


import { nc_LinkToEntity, nc_hexPrefix, nc_isListValid, nc_isListEmpty, nc_isObjectValid, nc_isObjectEmpty, nc_isPositiveInteger } from 'lib/NCUtility';
import * as network from 'network/NCNetworkRequests';

class NCChartRetrieve extends Component
{
  constructor(props) {
    super(props);
  }

  submitQuery(num){
      console.log('querry!!!!');
      let entity = this.props.blkRetrieve.response.blk;

      let str = this.props.params.blkId + num;

      //console.log("query for entity: " + NCEntityInfo[entity].name + " for query string: " + queryStr);
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
    //const queryStr = this.props.blkRetrieve.queryStr;
    //network.getBlkRetrievePagingTxnList(queryStr, pageNumber);
  }

  render() {
    const store = this.props.blkRetrieve;

    const isLoadingTopLevel = this.isFirstRenderAfterMount || store.isLoadingTopLevel;
    const queryStr = store.queryStr;
    const desc = nc_isPositiveInteger(queryStr) ? '#'+queryStr : nc_hexPrefix(queryStr);

    const blkObj = (store.response) ? store.response.blk : null;
    const txnList = (store.response) ? store.response.txn : null;

    console.log(blkObj);

    let isBlkValid = nc_isObjectValid(blkObj);
    let isBlkEmpty = nc_isObjectEmpty(blkObj, isBlkValid);

    let isTxnListValid = nc_isListValid(txnList);
    let isTxnListEmpty = nc_isListEmpty(txnList, isTxnListValid);

    //console.log(JSON.stringify(this.props.params.blkId));

    let prev = parseInt(this.props.params.blkId)-1;
    let next = parseInt(this.props.params.blkId)+1;

    const blk = isBlkEmpty ? {} : blkObj.content[0]; 

    const breadcrumbs = [
      {
        link: '/',
        body: 'Home',
      },
      {
        link: '/blocks',
        body: 'Blocks',
      },
      {
        link: '#',
        body: 'Block Details',
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

    const page =
      <div> 
        <NCExplorerHead
          momentUpdated={store.momentUpdated} 
          breadcrumbs={breadcrumbs}
          title={"Block"}
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
            <Tabs2 id="NCSectionTabbed" className="NCSectionTabbed" large={true}>
              <Tab2 id="blk" title="Included Transactions" panel={txnListSection} />
            </Tabs2>
          </div>
        }
        
      </div>;

    return (
      <NCExplorerPage
        isLoading={isLoadingTopLevel}
        isDataValid={isBlkValid} 
        isDataEmpty={isBlkEmpty}
        
        loadingStr={"Loading Block Details"}
        invalidDataStr={"Server error. Block structure invalid."}
        emptyDataStr={"No block found for descriptor: " + desc + "."}
        
        page={page}/>
    );
  }
}

export default connect((state) => {
  return ({
    blkRetrieve: state.blkRetrieve,
  })
})(NCBlkRetrieve);













































