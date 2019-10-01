/* eslint-disable */
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router'
import { connect } from 'react-redux';
import moment from 'moment';
import queryString from 'query-string';

import { Tab2, Tabs2 } from "@blueprintjs/core";

import NCAccTableMiner from 'components/accounts/NCAccTableMiner';
import NCAccTableInbound from 'components/accounts/NCAccTableInbound';
import NCAccTableOutbound from 'components/accounts/NCAccTableOutbound';
import NCRichList from 'components/accounts/NCRichList';

import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
import NCExplorerSection from 'components/common/NCExplorerSection';

import * as StoreAccList from 'stores/StoreAccList';
import * as MSG from 'lib/NCTerms';
import { nc_hexPrefix, nc_isListValid, nc_isListEmpty } from 'lib/NCUtility';

import { accListType } from 'lib/NCEnums';
import * as network from 'network/NCNetworkRequests';

class NCAccList extends Component
{
  constructor(props) {
    super(props);
    //console.log(JSON.stringify(props));
    this.state = {tab : "miner-acc",};
  }
  componentWillMount() {
    this.isFirstRenderAfterMount = true;
    const values = queryString.parse(this.props.location.search);
    this.setState({ tab : values.tab });
    //console.log(values.tab); // "top"
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
  handleTabChange = (e) => {
    //set the prop
    this.setState({ tab : e });
    hashHistory.replace('/accounts?tab=' + e);
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

    const richList = (store.response) ? store.response.richList : null;
    const isRichListValid = nc_isListValid(richList);
    const isRichListEmpty = nc_isListEmpty(richList, isRichListValid);

    //(store.response.richList) ? console.log(JSON.stringify(store.response.richList)) : console.log(JSON.stringify(store.response));

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
        <div className="NCPageBreakerSubtitle">Showing miner accounts over last 10,000 blocks (~last 24 hours).</div>
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
          isPaginated={true}
          isLatest={true}/>
        }
      marginTop={40}/>

    const inboundTxListSection = <NCExplorerSection 
      className={""}
      subtitle={
        <div className="NCPageBreakerSubtitle">{MSG.Transaction.DATA_POLICY_ACC_IN}</div>
      }

      isLoading={false}
      isDataValid={isInboundTxListValid}
      isDataEmpty={isInboundTxListEmpty} 
      
      loadingStr={MSG.Account.LOADING_LIST}
      invalidDataStr={MSG.Account.INVALID_DATA} 
      emptyDataStr={MSG.Transaction.DATA_POLICY_ACC_IN_EMPTY}
      isToplevelSection={false}
      
      content={
        <NCAccTableInbound 
          data={inboundTxList}
          onPageCallback={null}
          isLoading={false}
          isPaginated={true}
          isLatest={true}/>
        }
      marginTop={40}/>
    
    const outboundTxListSection = <NCExplorerSection 
      className={""}
      subtitle={
        <div className="NCPageBreakerSubtitle">{MSG.Transaction.DATA_POLICY_ACC_OUT}</div>
      }

      isLoading={false}
      isDataValid={isOutboundTxListValid}
      isDataEmpty={isOutboundTxListEmpty} 
      
      loadingStr={MSG.Account.LOADING_LIST}
      invalidDataStr={MSG.Account.INVALID_DATA}  
      emptyDataStr={MSG.Transaction.DATA_POLICY_ACC_OUT_EMPTY}
      isToplevelSection={false}
      
      content={
        <NCAccTableOutbound 
          data={outboundTxList}
          onPageCallback={null}
          isLoading={false}
          isPaginated={true}
          isLatest={true}/>
        }
      marginTop={40}
    />

     const richListSection = <NCExplorerSection 
      className={""}
      subtitle={
        <div className="NCPageBreakerSubtitle">{}</div>
      }

      isLoading={false}
      isDataValid={isRichListValid}
      isDataEmpty={isRichListEmpty} 
      
      loadingStr={MSG.Account.LOADING_LIST}
      invalidDataStr={MSG.Account.INVALID_DATA}  
      emptyDataStr={MSG.Transaction.DATA_POLICY_ACC_OUT_EMPTY}
      isToplevelSection={false}
      
      content={
        <NCRichList 
          data={richList}
          onPageCallback={null}
          isLoading={false}
          isPaginated={true}
          isLatest={true}/>
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
          <Tabs2 id="NCSectionTabbed" selectedTabId={this.state.tab} onChange={this.handleTabChange} default className="NCSectionTabbed" large={true} renderActiveTabPanelOnly={true}>
            <Tab2 id="miner-acc" title={MSG.strings.Acc_list_tab1} panel={minerListSection}/>
            <Tab2 id="inbound-acc" title={MSG.strings.Acc_list_tab2} panel={inboundTxListSection}/>
            <Tab2 id="outbound-acc" title={MSG.strings.Acc_list_tab3} panel={outboundTxListSection}/>
            <Tab2 id="rich-list" title={MSG.strings.Acc_list_tab4} panel={richListSection}/>
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



















































