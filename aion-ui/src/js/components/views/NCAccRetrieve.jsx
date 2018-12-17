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

import NCAccDetail from 'components/accounts/NCAccDetail';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
import NCExplorerSection from 'components/common/NCExplorerSection';
import NCNonIdealState from 'components/common/NCNonIdealState';

import { NCEntity, NCEntityInfo } from 'lib/NCEnums';

import * as MSG from 'lib/NCTerms';
import * as StoreAccRetrieve from 'stores/StoreAccRetrieve';

import { nc_hexPrefix, nc_isListValid, nc_isListEmpty, nc_isPositiveInteger, nc_isObjectValid, nc_isStrEmpty, nc_isObjectEmpty,nc_LinkToEntityWithParam, nc_trim } from 'lib/NCUtility';
//import { nc_FindEntity, nc_CanLinkToEntity, nc_LinkToEntity, nc_isObjectEmpty, nc_isStrEmpty, nc_trim } from 'lib/NCUtility';

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
    //console.log('retrieve'+JSON.stringify(this.props.params));
    network.getAccRetrieveTopLevel(this.props.params.accId,this.props.params.tknId);
  }

  requestPagingTxnList = (pageNumber) => {
    const queryStr = this.props.accRetrieve.queryStr;
    network.getAccRetrievePagingTxnList(queryStr, this.state.token, pageNumber);
  }

  requestDownload = (type, data) => {
    //const queryStr = this.props.accRetrieve.queryStr;
    network.RetrieveDownload(type, data);
  }

  requestPagingBlkList = (pageNumber) => {
    const queryStr = this.props.accRetrieve.queryStr;
    network.getAccRetrievePagingBlkList(queryStr, pageNumber);
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
      //console.log("changing token");
      this.setState({
        queryStr: '', token: token.hash
      }, () => {
        console.log("Changing token to: " + token);
       // nc_LinkToEntityWithParam(entity, queryStr, token);
       hashHistory.push('/account/'+this.props.params.accId+'/'+token.hash);
       network.getAccRetrieveTopLevel(this.props.params.accId,token.hash);
        //nc_FindEntity(queryStr);
      });
    } else if (!nc_isStrEmpty(queryStr)){

      let str = nc_trim(queryStr);
      let entity = this.state.entity;
      
      this.setState({
        queryStr: ''
      }, () => {
        
        hashHistory.push('/account/'+this.props.params.accId);
        network.getAccRetrieveTopLevel(this.props.params.accId);
       
      });

    }
    
  }

  

  renderTokenMenu = (tokenList) => {
   let menuItemList = [];
   if(Array.isArray(tokenList) && tokenList[0] && tokenList.length > 0) {
      //console.log('cool'+JSON.stringify(tokenList));
      menuItemList.push(
              <MenuItem
                key = "1"
                className = "nav-option"
                iconName = {NCEntityInfo[NCEntity.TKN].icon}
                onClick={()=>this.changeToken(this.props.accRetrieve.queryStr)}
                text = "Aion (Default)"
                value = {this.props.accRetrieve.queryStr}
              />
              );
      tokenList.forEach((t, i) => {
        if (i >= 0) {
          if (t.name || t.symbol) {
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
    }

    return (
      <Menu className="NCNavMenu">         
        
        {menuItemList}
      </Menu>
    );
  }

  render() {
    const store = this.props.accRetrieve;
    //console.log(JSON.stringify(this.props.params));
    const tokens = (store.response && store.response.acc.data && store.response.acc.data.content && store.response.acc.data.content[0]) ? store.response.acc.data.content[0].tokens : [];
    
    const isWeb3 = (store.response) ? store.response.web3 : false;

    console.log(store.response.txn.momentUpdated);
    console.log(JSON.stringify(store.response.txn));
     console.log(JSON.stringify(store.response));

    const isLoadingTopLevel = this.isFirstRenderAfterMount || store.isLoadingTopLevel;
    const isTxnListFirstLoad = (store.response && store.response.txn) ? store.response.txn.momentUpdated : null;
    const isBlkListFirstLoad = (store.response && store.response.blk) ? store.response.blk.momentUpdated : null;

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

    console.log('cool:'+isAccValid+' '+isAccEmpty);
    const tokenList =  <div className="token-list hide">
        <span className="title">Token balances:</span><Popover
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

      const tokenListMobile =  <div className="token-list show">
        <span className="title">Token balances:</span><Popover
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

      subtitle={tokenList}

      content={ <NCAccDetail entity={acc} tokenList={tokenListMobile} /> }
    />
    //console.log(isTxnListFirstLoad);
    const txnListSection = <NCExplorerSection 
      className={""}
      subtitle={
        <div className="NCPageBreakerSubtitle">
        {MSG.Transaction.DATA_POLICY}
        </div>
      }

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
      emptyDataStr={MSG.Block.EMPTY_DATA_LIST}
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
              <Tab2 id="blk" title="Mined Blocks" panel={blkListSection}/>
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














































