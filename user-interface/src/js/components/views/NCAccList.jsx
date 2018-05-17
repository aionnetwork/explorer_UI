/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { Tab2, Tabs2 } from "@blueprintjs/core";

import NCAccTableMiner from 'components/accounts/NCAccTableMiner';
import NCAccTableInbound from 'components/accounts/NCAccTableInbound';
import NCAccTableOutbound from 'components/accounts/NCAccTableOutbound';

import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
import NCExplorerSection from 'components/common/NCExplorerSection';

import * as StoreAccList from 'stores/StoreAccList';

import { nc_hexPrefix, nc_isListValid, nc_isListEmpty } from 'lib/NCUtility';

import { accListType } from 'lib/NCEnums';
import * as network from 'network/NCNetworkRequests';

class NCAccList extends Component
{
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
    // empty
  }

  requestTopLevel = () => {
    network.getAccListTopLevel();
  }
  
  render() {
    const store = this.props.accList;

    const isLoadingTopLevel = this.isFirstRenderAfterMount || store.isLoadingTopLevel;

    const minerList = (store.response) ? store.response.miners : null;
    const isMinerListValid = nc_isListValid(minerList);
    const isMinerListEmpty = nc_isListEmpty(minerList, isMinerListValid);
    
    const inboundTxList = (store.response) ? store.response.txnInbound : null;
    const isInboundTxListValid = nc_isListValid(inboundTxList);
    const isInboundTxListEmpty = nc_isListEmpty(inboundTxList, isInboundTxListValid);

    const outboundTxList = (store.response) ? store.response.txnOutbound : null;
    const isOutboundTxListValid = nc_isListValid(outboundTxList);
    const isOutboundTxListEmpty = nc_isListEmpty(outboundTxList, isOutboundTxListValid);

    const breadcrumbs = [
      {
        link: '/',
        body: 'Home',
      },
      {
        link: '/accounts',
        body: 'Accounts',
      }
    ];    

    const minerListSection = <NCExplorerSection 
      className={""}
      subtitle={
        <div className="NCPageBreakerSubtitle">Showing results from last 10,000 blocks (~last 24 hours).</div>
      }

      isLoading={false}
      isDataValid={isMinerListValid}
      isDataEmpty={isMinerListEmpty} 
      
      loadingStr={"Loading Miner List"}
      invalidDataStr={"Server provided an invalid response. Please try again."} 
      emptyDataStr={"Miner list not available."}
      isToplevelSection={false}
      
      content={
        <NCAccTableMiner 
          data={minerList}
          onPageCallback={null}
          isLoading={false}
          isPaginated={true}/>
        }
      marginTop={40}/>

    const inboundTxListSection = <NCExplorerSection 
      className={""}
      subtitle={
        <div className="NCPageBreakerSubtitle">Showing results from last 10,000 transactions.</div>
      }

      isLoading={false}
      isDataValid={isInboundTxListValid}
      isDataEmpty={isInboundTxListEmpty} 
      
      loadingStr={"Loading Accounts List"}
      invalidDataStr={"Server provided an invalid response. Please try again."} 
      emptyDataStr={"No inbound account activity in last 24 hours"}
      isToplevelSection={false}
      
      content={
        <NCAccTableInbound 
          data={inboundTxList}
          onPageCallback={null}
          isLoading={false}
          isPaginated={true}/>
        }
      marginTop={40}/>
    
    const outboundTxListSection = <NCExplorerSection 
      className={""}
      subtitle={
        <div className="NCPageBreakerSubtitle">Showing results from last 10,000 transactions.</div>
      }

      isLoading={false}
      isDataValid={isOutboundTxListValid}
      isDataEmpty={isOutboundTxListEmpty} 
      
      loadingStr={"Loading Accounts List"}
      invalidDataStr={"Server provided an invalid response. Please try again."} 
      emptyDataStr={"No outbound account activity in last 24 hours"}
      isToplevelSection={false}
      
      content={
        <NCAccTableOutbound 
          data={outboundTxList}
          onPageCallback={null}
          isLoading={false}
          isPaginated={true}/>
        }
      marginTop={40}
    />

    const page =
      <div> 
        <NCExplorerHead
          momentUpdated={store.momentUpdated} 
          breadcrumbs={breadcrumbs}
          title={"Account Lists"}
          subtitle={"Recent Accounts Statistics"}/>    
        <div className="NCSection">
          <Tabs2 id="NCSectionTabbed" className="NCSectionTabbed" large={true} renderActiveTabPanelOnly={true}>
            <Tab2 id="miner-acc" title="Miners" panel={minerListSection}/>
            <Tab2 id="inbound-acc" title="Accounts Inbound" panel={inboundTxListSection}/>
            <Tab2 id="outbound-acc" title="Accounts Outbound" panel={outboundTxListSection}/>
          </Tabs2>
        </div>
      </div>;

    return (
      <NCExplorerPage
        isLoading={isLoadingTopLevel}
        isDataValid={true} 
        isDataEmpty={false}
        
        loadingStr={"Loading Account Lists"}
        invalidDataStr={"Server provided an invalid response. Please try again."}
        emptyDataStr={"No accounts found. Blockchain server loading blocks."}
        
        page={page}
        marginTop={100}/>
    );
  }
}

export default connect((state) => {
  return ({
    accList: state.accList,
  })
})(NCAccList);



















































