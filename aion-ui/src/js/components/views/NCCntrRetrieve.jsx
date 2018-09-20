/* eslint-disable */
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import moment from 'moment';

import { Position, Popover, Tab2, Tabs2, Tooltip, Button, Menu, MenuItem, PopoverInteractionKind } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";

import NCBlkTable from 'components/blocks/NCBlkTable';
import NCTxnTableOwn from 'components/transactions/NCTxnTableOwn';

import NCAccDetail from 'components/accounts/NCAccDetail';
import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
import NCExplorerSection from 'components/common/NCExplorerSection';
import NCNonIdealState from 'components/common/NCNonIdealState';

import { NCEntity, NCEntityInfo } from 'lib/NCEnums';

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
    console.log('contract:'+this.props.params.accId);

    network.getCntrRetrieveTopLevel(this.props.params.accId);
  }

  requestPagingTxnList = (pageNumber) => {
    const queryStr = this.props.accRetrieve.queryStr;
    network.getAccRetrievePagingTxnList(queryStr, pageNumber);
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
      token.name = "token";
      token.value = tkn;
      //console.log("changing token");
      this.setState({
        queryStr: ''
      }, () => {
        console.log("Changing token to: " + token);
        nc_LinkToEntityWithParam(entity, queryStr, token);
        //nc_FindEntity(queryStr);
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
    const store = this.props.accRetrieve;
    const tokens=[{name:'Token',symbol:'test'},{name:'Token1',symbol:'test1'}]
    const isWeb3 = (store.response) ? store.response.web3 : false;

    //console.log("page Data for retrieve: "+JSON.stringify(this.props));

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

      emptyDataTitle={"Account Not Found"}
      invalidDataTitle={"Account Service Unavailable"}
      
      loadingStr={"Loading Account"}
      invalidDataStr={"Account Service Unavailable. Please try again."} 
      emptyDataStr={"No Data Available for Account: "+desc}
      marginTop={20}
      marginBottom={30}
      /*subtitle={<div className="token-list">
        <span className="title">Token balances:</span><Popover
                content={this.renderTokenMenu(tokens)}
                interactionKind={PopoverInteractionKind.CLICK}
                position={Position.BOTTOM}>
                <Button 
                  className="navbar-btn-active pt-button pt-minimal"
                  iconName="pt-icon-application"
                  rightIconName="pt-icon-caret-down"
                  text="Aion (Default)"/>          
        </Popover>
      </div>}*/
      content={ <NCAccDetail entity={acc}/> }
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
    accRetrieve: state.accRetrieve,
  })
})(NCAccRetrieve);














































