/* eslint-disable */
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';

import {AnchorButton, Classes, Intent, Dialog, Position, Popover, Tab2, Tabs2, Tooltip, Button, Menu, MenuItem, PopoverInteractionKind } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";

import NCEventTable from 'components/contracts/NCEventTable';
import NCBlkTable from 'components/blocks/NCBlkTable';
import NCTxnTable from 'components/transactions/NCTxnTable';

import NCAccDetail from 'components/accounts/NCAccDetail';
import NCCntrDetail from 'components/contracts/NCCntrDetail';

import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
import NCExplorerSection from 'components/common/NCExplorerSection';
import NCNonIdealState from 'components/common/NCNonIdealState';

import { NCEntity, NCEntityInfo } from 'lib/NCEnums';

import * as MSG from 'lib/NCTerms';
import * as StoreCntrRetrieve from 'stores/StoreCntrRetrieve';

import { nc_hexPrefix, nc_isListValid, nc_isListEmpty, nc_isPositiveInteger, nc_isObjectValid, nc_isStrEmpty, nc_isObjectEmpty,nc_LinkToEntityWithParam, nc_trim } from 'lib/NCUtility';
import * as network from 'network/NCNetworkRequests';

class NCCntrRetrieve extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      queryStr: '',
      entity: NCEntity.CNTR
    } 
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
    if (prevProps.params.cntrId != this.props.params.cntrId)
      this.requestTopLevel();
  }

  requestTopLevel = () => {
    network.getCntrRetrieveTopLevel(this.props.params.cntrId);
  }

  requestPagingTxnList = (pageNumber,pageSize,start,end) => {
    const queryStr = this.props.cntrRetrieve.queryStr;
    //console.log(pageNumber+"  "+pageSize);
    network.getCntrRetrieveTopLevel(queryStr,pageNumber,pageSize);
    //(this.props.params.cntrId);
    //network.getAccRetrievePagingTxnList(queryStr, this.state.token, pageNumber,pageSize,start,end);
  }

  requestPagingBlkList = (pageNumber) => {
    const queryStr = this.props.cntrRetrieve.queryStr;
    network.getAccRetrievePagingBlkList(queryStr, pageNumber);
  }
  requestPagingEventList = (pageNumber) => {
    const queryStr = this.props.cntrRetrieve.queryStr;
    network.getCntrRetrievePagingEventList(queryStr, pageNumber);
  }

  getTokenList = () => {
    const list = this.props.accRetrieve.tokens;
    return list;
  }

  changeToken = (queryStr, tkn) => {
    if (!nc_isStrEmpty(queryStr)&&!nc_isStrEmpty(tkn))
    {
      
      let str = nc_trim(queryStr);
      let entity = this.state.entity;
      let token = [];
      token.name = "token";
      token.value = tkn;
      
      this.setState({
        queryStr: ''
      }, () => {
        nc_LinkToEntityWithParam(entity, queryStr, token);
        
      });
    }
    
  }

  

  renderTokenMenu = (tokenList) => {
   let menuItemList = [];
   if(Array.isArray(tokenList) && tokenList.length > 1) {
      
      tokenList.forEach((t, i) => {
        if (i >= 0) {
          if (t.name || t.symbol) {
            menuItemList.push(
              <MenuItem
                key= {i}
                className="nav-option"
                iconName={NCEntityInfo[NCEntity.TKN].icon}
                onClick={()=>this.changeToken(this.props.accRetrieve.queryStr,t.name)}
                text={t.name+"("+t.symbol+")"}
                value={t.name}
              />
              );
          }
        }
      });
    }

    return (
      <Menu className="NCNavMenu">
              
        
        {menuItemList}
      </Menu>
    );
  }

  render() {
    const store = this.props.cntrRetrieve;
    const tokens=[{name:'Token',symbol:'test'},{name:'Token1',symbol:'test1'}]
    const isWeb3 = (store.response) ? store.response.web3 : false;

    //console.log("page Data for retrieve: "+JSON.stringify(store.response));
    //console.log(JSON.stringify(store));
    const isLoadingTopLevel = this.isFirstRenderAfterMount || store.isLoadingTopLevel;
    const isTxnListFirstLoad = (store.response && store.response.txn) ? store.response.txn.momentUpdated : null;
    const isBlkListFirstLoad = (store.response && store.response.blk) ? store.response.blk.momentUpdated : null;
    const isEventListFirstLoad = (store.response && store.response.event) ? store.response.event.momentUpdated : null;

    const accObj = (store.response && store.response.acc) ? store.response.acc.data : null;

    //const txnList = (store.response && store.response.transactions) ? store.response.transactions.data : null;
    const txnList = (store.response && store.response.txn && store.response.txn.data.content) ? store.response.txn.data.content : null;
    //console.log(JSON.stringify(txnList));

    const blkList = (store.response && store.response.blk) ? store.response.blk.data : null;
    const eventList = (store.response && store.response.event && store.response.event.data.content) ? store.response.event.data.content : null;

    const isAccValid = nc_isObjectValid(accObj);
    const isAccEmpty = nc_isObjectEmpty(accObj, isAccValid);

    const isTxnListValid = nc_isListValid(txnList);
    const isTxnListEmpty = nc_isListEmpty(txnList, isTxnListValid);
    
    const isBlkListValid = nc_isListValid(blkList);
    const isBlkListEmpty = nc_isListEmpty(blkList, isBlkListValid);

    const isEventListValid = nc_isListValid(eventList);
    const isEventListEmpty = nc_isListEmpty(eventList, isEventListValid);
    
    const acc = isAccEmpty ? {} : accObj.content[0];
    
    const breadcrumbs = [
      {
        link: '/',
        body: 'Home',
      },
      {
        link: '/contracts',
        body: 'Contracts',
      },
      {
        link: '#',
        body: 'Contract Details',
      }
    ];

    const desc = nc_hexPrefix(store.queryStr);
    
    const accBalanceSection = <NCExplorerSection 
      className={""}

      isLoading={isLoadingTopLevel}
      isDataValid={isAccValid}
      isDataEmpty={isAccEmpty} 

      emptyDataTitle={MSG.Contract.EMPTY_DATA_TITLE}
      invalidDataTitle={MSG.Contract.INVALID_DATA}
      
      loadingStr={MSG.Contract.LOADING}
      invalidDataStr={MSG.Contract.INVALID_DATA} 
      emptyDataStr={MSG.Contract.EMPTY_DATA +" "+desc}
      marginTop={20}
      marginBottom={30}
      
      content={ <NCCntrDetail entity={acc}/> }
    />

    const txnListSection = <NCExplorerSection 
      className={""}
      subtitle={
        <div className="NCPageBreakerSubtitle">
        {MSG.Transaction.DATA_POLICY_CNTR}
        </div>
      }

      isLoading={isTxnListFirstLoad == null}
      isDataValid={isTxnListValid}
      isDataEmpty={isTxnListEmpty} 
      
      loadingStr={MSG.Transaction.LOADING_LIST}
      invalidDataStr={MSG.Transaction.INVALID_DATA_LIST} 
      emptyDataStr={MSG.Transaction.EMPTY_DATA_LIST_CNTR}
      marginTop={40}

      content={
        <NCTxnTable 
          calFilter={false}
          data={txnList}
          onPageCallback={this.requestPagingTxnList}
          isLoading={store.isLoadingPagingTxnList}
          isPaginated={true}
          ownAddr={acc.address}
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
      
      loadingStr={"Loading Blocks"}
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
    const tknListSection = <NCExplorerSection 
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
      
      loadingStr={"Loading Blocks"}
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
    const eventListSection = <NCExplorerSection 
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

      isLoading={isEventListFirstLoad == null}
      isDataValid={true}
      isDataEmpty={isEventListEmpty} 
      
      loadingStr={"Loading Blocks"}
      invalidDataStr={"Server provided an invalid response. Please try again."} 
      emptyDataStr={
        <span>No events found in this contract. 
          
        </span>}
      marginTop={40}

      content={
        <NCEventTable 
          data={eventList}
          onPageCallback={this.requestPagingEventList}
          isLoading={store.isLoadingPagingEventList}
          isPaginated={false}
          isLatest={true}/>
        }
    />

    const page =
      <div> 
        <NCExplorerHead
          momentUpdated={store.momentUpdated} 
          breadcrumbs={breadcrumbs}
          title={"Contract"}
          subtitle={desc}
          token={store.momentUpdated}/>  
        { accBalanceSection }
        <hr className="nc-hr"/>
        
        {
          (isWeb3 && !isAccEmpty) &&
          <NCNonIdealState
            paddingTop={80}
            icon={"pt-icon-offline"}
            title={"Unavailable In Lite-Mode"}
            description={"Account transactions & blocks-mined not available in lite-mode."}/>
        }
        {
          (!isWeb3 && !isAccEmpty) &&  
          <div className="NCSection">
             
            <Tabs2 id="NCSectionTabbed" className="NCSectionTabbed" large={true} renderActiveTabPanelOnly={true}>
              {
                (isTxnListValid) &&
                <Tab2 id="txn" title="Transactions" panel={txnListSection}/>
              }
              
              {
                (isBlkListValid) &&
                <Tab2 id="blk" title="Mined Blocks" panel={blkListSection}/>
              }
              
              <Tab2 id="event" title="Events" panel={eventListSection}/>
            </Tabs2>
          </div>
        }
      </div>;

    return (
      <NCExplorerPage
        isLoading={isLoadingTopLevel}
        isDataValid={true} 
        isDataEmpty={false}
        
        loadingStr={"Loading Account Details"}
        invalidDataStr={"Account Service Unavailable. Account data invalid."}
        emptyDataStr={"No account found for descriptor: " + desc + "."}
        
        page={page}/>
    );
  }
}

export default connect((state) => {
  return ({
    cntrRetrieve: state.cntrRetrieve,
  })
})(NCCntrRetrieve);














































