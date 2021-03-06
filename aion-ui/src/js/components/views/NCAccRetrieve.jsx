/* eslint-disable */
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';

import { Position, Popover, Tab2, Tabs2, Tooltip, Button, Menu, MenuItem, PopoverInteractionKind } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";

import NCBlkTable from 'components/blocks/NCBlkTable';
import NCTxnTable from 'components/transactions/NCTxnTable';
import NCTxnTableOwn from 'components/transactions/NCTxnTableOwn';
import NCTxnTableOwnToken from 'components/transactions/NCTxnTableOwnToken';
import NCTxnTableOwnTransfer from 'components/transactions/NCTxnTableOwnTransfer';

import NCAccDetail from 'components/accounts/NCAccDetail';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
import NCExplorerSection from 'components/common/NCExplorerSection';
import NCNonIdealState from 'components/common/NCNonIdealState';

import { NCEntity, NCEntityInfo } from 'lib/NCEnums';

import * as MSG from 'lib/NCTerms';
import * as StoreAccRetrieve from 'stores/StoreAccRetrieve';

import { nc_hexPrefix, nc_isListValid, nc_isListEmpty, nc_isPositiveInteger, nc_isObjectValid, nc_isStrEmpty, nc_isObjectEmpty,nc_LinkToEntityWithParam, nc_trim } from 'lib/NCUtility';

import * as network from 'network/NCNetworkRequests';

class NCAccRetrieve extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      queryStr: '',
      token:null,
      entity: NCEntity.ACCOUNT
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
    if (prevProps.params.accId != this.props.params.accId)
      this.requestTopLevel();
  }

  requestTopLevel = () => {
    
    network.getAccRetrieveTopLevel(this.props.params.accId,this.props.params.tknId);
  }

  requestPagingTxnList = (pageNumber,pageSize,start,end) => {
    const queryStr = this.props.accRetrieve.queryStr;
    let token = (this.props.params.tknId) ? this.props.params.tknId : this.state.token;
    network.getAccRetrievePagingTxnList(queryStr, token, pageNumber,pageSize,start,end);
  }

  requestPagingTrnList = (pageNumber,pageSize,start,end) => {
    const queryStr = this.props.accRetrieve.queryStr;

    network.getAccRetrievePagingTrnList(queryStr, pageNumber,pageSize);
  }

  requestDownload = (type, data) => {
    
    network.RetrieveDownload(type, data);
  }

  requestPagingBlkList = (pageNumber, pageSize, start, end) => {
    const queryStr = this.props.accRetrieve.queryStr;
    //console.log(pageSize);
    network.getAccRetrievePagingBlkList(queryStr, pageNumber, pageSize, start, end);
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
      token.hash = tkn;
      token.value = "token";//tkn;
      
      this.setState({
        queryStr: '', token: token.hash
      }, () => {
       
       hashHistory.push('/account/'+this.props.params.accId+'/'+token.hash);
       network.getAccRetrieveTopLevel(this.props.params.accId,token.hash);
       
      });
    } else if (!nc_isStrEmpty(queryStr)){

      let str = nc_trim(queryStr);
      let entity = this.state.entity;
      
      this.setState({
        queryStr: '',
        token: null
      }, () => {
        
        hashHistory.push('/account/'+this.props.params.accId);
        network.getAccRetrieveTopLevel(this.props.params.accId);
       
      });

    }
    
  }

  

  renderTokenMenu = (tokenList) => {
   let menuItemList = [];
   if(Array.isArray(tokenList) && tokenList[0] && tokenList.length > 0) {
      
      menuItemList.push(
              <MenuItem
                key = {tokenList.length}
                className = "nav-option"
                iconName = {NCEntityInfo[NCEntity.TKN].icon}
                onClick={()=>this.changeToken(this.props.accRetrieve.queryStr,null)}
                text = "Aion (Default)"
                value = {this.props.accRetrieve.queryStr}
              />
              );
      //console.log(tokenList.length+1);
      tokenList.forEach((t, i) => {
        if (i >= 0) {
          if (t.name || t.symbol) {
            //console.log(i+" "+t.name);
            menuItemList.push(
              <MenuItem
                key= {i}
                className="nav-option"
                iconName={NCEntityInfo[NCEntity.TKN].icon}
                onClick={()=>this.changeToken(this.props.accRetrieve.queryStr,t.contractAddr)}
                text={t.name+"("+t.symbol+")"}
                value={t.contractAddr}
              />
              );
          }
        }
      });
    }else{
      menuItemList.push(
              <MenuItem
                key = "0"
                className = "nav-option"
                iconName = {NCEntityInfo[NCEntity.TKN].icon}
               
                text = "Aion (Default)"
                value = {this.props.accRetrieve.queryStr}
              />
              );
    }

    return (
      <Menu className="NCNavMenu">         
        
        {menuItemList}
      </Menu>
    );
  }

  render() {

    
    const store = this.props.accRetrieve;
    
    const tokens = (store.response && store.response.acc.data && store.response.acc.data.content && store.response.acc.data.content[0]) ? store.response.acc.data.content[0].tokens : [];
    
    const isWeb3 = (store.response) ? store.response.web3 : false;

    const isLoadingTopLevel = this.isFirstRenderAfterMount || store.isLoadingTopLevel;
    const isTxnListFirstLoad = (store.response && store.response.txn) ? store.response.txn.momentUpdated : null;
    const isBlkListFirstLoad = (store.response && store.response.blk) ? store.response.blk.momentUpdated : null;

    /*This section is for transfers table. This feature was added to accomodate for internal transfers made on tokens.*/
    const isTrnListFirstLoad = (store.response && store.response.trn) ? store.response.trn.momentUpdated : null;
    const trnList = (store.response && store.response.trn) ? store.response.trn.data : null;
    const isTrnListValid = nc_isListValid(trnList);
    const isTrnListEmpty = nc_isListEmpty(trnList, isTrnListValid);
    /*End*/

    const accObj = (store.response && store.response.acc) ? store.response.acc.data : null;
    const txnList = (store.response && store.response.txn) ? store.response.txn.data : null;
    const blkList = (store.response && store.response.blk) ? store.response.blk.data : null;
    
    const isAccValid = nc_isObjectValid(accObj);
    const isAccEmpty = nc_isObjectEmpty(accObj, isAccValid);

    const isTxnListValid = nc_isListValid(txnList);
    const isTxnListEmpty = nc_isListEmpty(txnList, isTxnListValid);

    const isBlkListValid = nc_isListValid(blkList);
    const isBlkListEmpty = nc_isListEmpty(blkList, isBlkListValid);

    const acc = isAccEmpty ? {} : accObj.content[0];
    
    const breadcrumbs = [
      {
        link: '/',
        body: 'Home',
      },
      {
        link: '/accounts',
        body: 'Accounts',
      },
      {
        link: '#',
        body: 'Account Details',
      }
    ];

    const desc = nc_hexPrefix(store.queryStr);

    
    const tokenList =  <div className="">

        <Popover
                content={this.renderTokenMenu(tokens)}
                interactionKind={PopoverInteractionKind.CLICK}
                position={Position.BOTTOM}>
                <Button 
                  className="navbar-btn-active pt-button pt-minimal"
                  iconName="pt-icon-application"
                  rightIconName="pt-icon-caret-down"
                  text= {acc.tokenName  ? acc.tokenName  : "Aion (Default)"}

                />          
        </Popover>
      </div>;

      const tokenListMobile =  <div className="token-list show">
        <span className="title">Token:</span><Popover
                content={this.renderTokenMenu(tokens)}
                interactionKind={PopoverInteractionKind.CLICK}
                position={Position.BOTTOM}>
                <Button 
                  className="navbar-btn-active pt-button pt-minimal"
                  iconName="pt-icon-application"
                  rightIconName="pt-icon-caret-down"
                  text= {acc.tokenName  ? acc.tokenName  : "Aion (Default)"}

                />          
        </Popover>
      </div>

    const accBalanceSection = <NCExplorerSection 
      className={""}

      isLoading={isLoadingTopLevel}
      isDataValid={isAccValid}
      isDataEmpty={isAccEmpty} 


      emptyDataTitle={MSG.Account.EMPTY_DATA_TITLE}
      invalidDataTitle={MSG.Account.INVALID_DATA}
      
      loadingStr={MSG.Account.LOADING}
      invalidDataStr={MSG.Account.INVALID_DATA} 
      emptyDataStr={MSG.Account.EMPTY_DATA+desc}
      marginTop={20}
      marginBottom={30}

      content={ <NCAccDetail entity={acc} tokenList={tokenList} /> }
    />
    
     const transferListSection = <NCExplorerSection 
      className={""}
      subtitle={
        <div className="NCPageBreakerSubtitle">
        {MSG.Transaction.DATA_POLICY_TRN}
        </div>
      }

      isLoading={isTxnListFirstLoad == null}
      isDataValid={true}
      isDataEmpty={isTrnListEmpty} 
      
      loadingStr={MSG.Transaction.LOADING}
      invalidDataStr={MSG.Transaction.INVALID_DATA} 
      emptyDataStr={MSG.Transaction.EMPTY_DATA_LIST_TRN}
      marginTop={40}

      content={
                <NCTxnTableOwnTransfer 
                  data={trnList}
                  onPageCallback={this.requestPagingTrnList}
                  isLoading={store.isLoadingPagingTrnList}
                  isPaginated={true}
                  ownAddr={desc}
                  isLatest={true}/>
              }
    />  
    const txnListSection = <NCExplorerSection 
      className={""}
      subtitle={
        <div className="NCPageBreakerSubtitle">
        {MSG.Transaction.DATA_POLICY}
        </div>
      }

      filter={true}
      onCallBack={this.requestPagingTxnList}

      isLoading={isTxnListFirstLoad == null}
      isDataValid={true}
      isDataEmpty={isTxnListEmpty} 
      
      loadingStr={MSG.Transaction.LOADING}
      invalidDataStr={MSG.Transaction.INVALID_DATA} 
      emptyDataStr={MSG.Transaction.EMPTY_DATA_LIST}
      marginTop={40}

      content={
        !acc.tokenName ?
        <NCTxnTableOwn 
          data={txnList}
          onPageCallback={this.requestPagingTxnList}
          isLoading={store.isLoadingPagingTxnList}
          isPaginated={true}
          ownAddr={acc.address}
          isLatest={true}/>
        
        :

        <NCTxnTableOwnToken 
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
        <div className="NCPageBreakerSubtitle">{MSG.Block.DATA_POLICY}
        </div>
      }

      isLoading={isBlkListFirstLoad == null}
      isDataValid={true}
      isDataEmpty={isBlkListEmpty} 
      
      loadingStr={MSG.Block.LOADING}
      invalidDataStr={MSG.Block.INVALID_DATA} 
      emptyDataStr={MSG.Block.EMPTY_DATA_LIST_MINER}
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
        <NCExplorerHead
          momentUpdated={store.momentUpdated} 
          breadcrumbs={breadcrumbs}
          title={"Account"}
          subtitle={desc}
          token={store.momentUpdated}/>  
        { accBalanceSection }
        <hr className="nc-hr"/>
        
        {
          (isWeb3 && !isAccEmpty) &&
          <NCNonIdealState
            filter={true}

            paddingTop={80}
            icon={"pt-icon-offline"}
            title={"Unavailable In Lite-Mode"}
            description={"Account transactions & blocks-mined not available in lite-mode."}/>
        }
        {
          (!isWeb3 && !isAccEmpty) &&  
          <div className="NCSection">
            <Tabs2 id="NCSectionTabbed" className="NCSectionTabbed" large={true} renderActiveTabPanelOnly={true}>
              <Tab2 id="txn" title="Transactions" panel={txnListSection}/>
              <Tab2 id="blk" title="Validated Blocks" panel={blkListSection}/>
              <Tab2 id="trn" title="Internal Transactions" panel={transferListSection}/>
            </Tabs2>
          </div>
        }
        <hr className="nc-hr"/>
        <Button onClick={() => {hashHistory.push('/downloads/'+acc.address);}} className = "pt-button pt-minimal pull-right" rightIconName="Download" text="Download this Account" />
        
      </div>;

    return (
      <NCExplorerPage
        isLoading={isLoadingTopLevel}
        isDataValid={true} 
        isDataEmpty={false}
        
        loadingStr={MSG.Page.LOADING}
        invalidDataStr={MSG.Page.INVALID_DATA}
        emptyDataStr={MSG.Page.EMPTY_DATA + desc + "."}
        
        page={page}

        />
    );
  }
}

export default connect((state) => {
  return ({
    accRetrieve: state.accRetrieve,
  })
})(NCAccRetrieve);














































