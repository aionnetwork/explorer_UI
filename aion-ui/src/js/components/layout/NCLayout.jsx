/* eslint-disable */
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router'
import { connect } from 'react-redux';

import {BigNumber} from 'bignumber.js'
import moment from "moment";
import {  Menu, ContextMenu, ContextMenuTarget, MenuItem, Position, Classes, InputGroup, Popover, Button, PopoverInteractionKind, Spinner, Tooltip, MenuDivider } from "@blueprintjs/core";

import { ncNetwork_pollForKpiList, ncNetwork_pollForStaticInfo } from 'network/NCNetwork';

import NCLivenessIndicator from 'components/layout/NCLivenessIndicator';
import NCTopLevelSearch from 'components/layout/NCTopLevelSearch';
import NCLoading from 'components/common/NCLoading';

import { NCNETWORK_REQUESTS_ENABLED } from 'network/NCNetwork';

import { NCEntity, NCEntityInfo } from 'lib/NCEnums';
import { ga_key } from 'lib/NCData';
//import { disconnectSocket } from 'network/NCNetwork';
import { NC_ENV, disconnectSocket } from 'network/NCNetwork';
import * as network from 'network/NCNetworkRequests';

import appConfig from '../../../config.json';

import ReactGA from 'react-ga';
//ReactGA.initialize(appConfig.ga_key);
//ReactGA.pageview(window.location.pathname + window.location.search);
ReactGA.initialize(NC_ENV.GA_KEY);

class NCLayout extends Component {

  constructor(props) {
    super(props);
    this.darkMode = true;

    this.connectionMenu = 
    <Button 
      className="navbar-btn-active pt-button pt-minimal"
      text="Explorer"/>;  

    //let networkList = appConfig.network_list;
    let networkList = NC_ENV.NETWORK_LIST;
      
    // figure out document title -----------------------------------------------

    let documentTitle = "Aion | Explorer";

    if (networkList && networkList[0] && networkList[0].name)
      documentTitle = "Aion | "+networkList[0].name;

    document.title = documentTitle; 

    // figure out the menu items -----------------------------------------------

    if (networkList && networkList[0].name) {
      this.connectionMenu = 
        <Button 
          className="navbar-btn-active pt-button pt-minimal"
          text={networkList[0].name}/>; 
    }

   this.connectionMenuItemList = [];

    if(Array.isArray(networkList) && networkList.length > 1) {
      let menuItemList = [];
      networkList.forEach((v, i) => {
        if (i > 0) {
          if (v.name && v.url) {
            menuItemList.push(<MenuItem
              key={i}
              className="nav-option"
              onClick={() => window.open(v.url)}
              text={v.name}/>);
          }
        }
      });

      if (menuItemList.length > 0) {
         this.connectionMenuItemList = menuItemList;
         this.connectionMenu = 
        <Popover
          content={
            <Menu className="NCNavMenu">
              <MenuDivider title="Switch Network" />
              { menuItemList }
            </Menu>
          }
          className="hide"
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_RIGHT}>
            <Button 
              className="navbar-btn-active pt-button pt-minimal"
              rightIconName="pt-icon-caret-down"
              text={networkList[0].name ? networkList[0].name : "Explorer"}/>  
        </Popover>
      }   




    }         
  }

  componentWillMount() {
    network.getKPIData();
  }

  componentWillUnmount() {
    disconnectSocket();
  };

 showContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        //console.log('Hey!');// must prevent default to cancel parent's context menu
        e.preventDefault();
        // invoke static API, getting coordinates from mouse event
        ContextMenu.show(
            <Menu>
                <MenuItem
          className="nav-option"
          target="blank"
          onClick={() => {
            hashHistory.push('e.link');
          }}
          text="Open link in new tab"
        />
                
            </Menu>,
            { left: e.clientX, top: e.clientY },
            () => this.setState({ isContextMenuOpen: false }),
        );
        // indicate that context menu is open so we can add a CSS class to this element
        this.setState({ isContextMenuOpen: true });
    };

  renderMetricMenu = () => {
    return (
      <Menu className="NCNavMenu">
        <div onContextMenu={this.showContextMenu}><MenuItem
          className="nav-option"
          
          onClick={() => {
            hashHistory.push('/charts/ActiveAddressGrowth');
          }}
          text="Active Address"
        /></div>
        <MenuItem
          className="nav-option"
          
          onClick={() => {
            hashHistory.push('/charts/BlockTime');
          }}
          text="Block Times"
        />
        <MenuItem
          className="nav-option"
          
          onClick={() => {
            hashHistory.push('/charts/HashingPower');
          }}
          text="Hash Power"
        />
        <MenuItem
          className="nav-option"
          
          onClick={() => {
            hashHistory.push('/charts/Difficulty');
          }}
          text="Network Difficulty"
        />
        <MenuItem
          className="nav-option"
          
          onClick={() => {
            hashHistory.push('/charts/TopMiner');
          }}
          text="Top Miners"
        />
        
         
        
         <MenuItem
            className="nav-option"
            onClick={() => {
              hashHistory.push('/charts/TransactionsoverTime');
            }}
            text="Transactions per Hour"
          />
      </Menu>
    );
  }

  renderMobileMenu = () => {

    
     return(<Popover
          content={
            <Menu className="NCNavMenu">
              <MenuDivider title="Explorer" />
              {this.renderExplorerMenu()} 
              <MenuDivider title="Analytics" />
              {this.renderMetricMenu()} 
              <MenuDivider title="Switch Network" />
              {this.connectionMenuItemList} 
            </Menu>
          }
          interactionKind={PopoverInteractionKind.CLICK}
          className="show"
          position={Position.BOTTOM_RIGHT}>
            <Button 
              className="  pt-minimal"
              iconName="pt-icon-menu"
             
              />  
        </Popover>);
  }

  renderExplorerMenu = () => {
    return (
      <Menu className="NCNavMenu">
         <div onContextMenu={this.showContextMenu}><MenuItem
          className="nav-option"
          link='/accounts'
          iconName={NCEntityInfo[NCEntity.ACCOUNT].icon}
          onContextMenu={this.showContextMenu}
          onClick={() => {
            hashHistory.push('/accounts');
          }}
          text="Accounts"
        /></div>
        <MenuItem
          className="nav-option"
          iconName={NCEntityInfo[NCEntity.BLOCK].icon}
          onClick={() => {
            hashHistory.push('/blocks');
          }}
          text="Blocks"
        />
        <MenuItem
          className="nav-option"
          iconName={NCEntityInfo[NCEntity.CNTR].icon}
          onClick={() => {
            hashHistory.push('/contracts');
          }}
          text="Contracts"
        />
        <MenuItem
          className="nav-option"
          iconName={NCEntityInfo[NCEntity.TKN].icon}
          onClick={() => {
            hashHistory.push('/tokens');
          }}
          text="Tokens"
        />
        <MenuItem
          className="nav-option"
          iconName={NCEntityInfo[NCEntity.TXN].icon}
          onClick={() => {
            hashHistory.push('/transactions');
          }}
          text="Transactions"
        />
        
       
         
      </Menu>
    );
  }

  renderConnectionMenu = () => {
    return (
      <Menu className="NCNavMenu">
        <MenuDivider title="Switch Network" />
        <MenuItem
          className="nav-option"
          onClick={() => window.open("https://mainnet.aion.network")}
          text="Mainnet Kilimanjaro"/>
        <MenuItem
          className="nav-option"
          onClick={() => window.open("https://testnet2.aion.network")}
          text="Testnet Ascent"/>

      </Menu>
    );
  }

  render() 
  {
    const pathname = this.props.location.pathname;

    //ReactGA.pageview(window.location.pathname + window.location.search);
    ReactGA.pageview(pathname);

    let kpi = this.props.kpi;
    {let css = {zIndex:'999',background:"#4221cc",color:"#fff", position:'fixed',float:'right', bottom:'50px', right:'50px'};
    let feedback ={padding:'10px', margin:'10px'}
    const permissionsMenu = (
            <Popover
                content={<div style={feedback} >
                    Please leave a feedback!
                   <br/><select defaultValue={"Choose an item..."} className={'pt-input'} style={feedback}>
                    
                    <option value="Block">Block</option>
                    <option value="Transaction">Transaction</option>
                    <option value="Analytics">Analytics</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="Token">Account</option>
                    <option value="contract">Contract</option>
                    <option value="General">General</option>
                 </select>
                 
                 <br/><br/>
                 <select className={'pt-input'} style={feedback}>
                    
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                    <option value="4">Four</option>
                </select>

                
                 <InputGroup
                    disabled={false}
                    style={feedback}
                    value={"Message"}
                />
                </div>
                

                }

                position={Position.TOP_RIGHT}>
                <Button style = { css } className={" "} iconName={"envelope"}>
                    Feedback
                </Button>
            </Popover>
        );
    
    }
    // wait on the response from KPI list to load application
    if (NCNETWORK_REQUESTS_ENABLED && kpi.momentUpdated == null) { 
      return (
        <NCLoading
          title={"Connecting to Server"}
          marginTop={140}/>
      );
    }    

    // ------------------------------------------------

    let momentEnd = kpi.data.endTimestamp ? moment.unix(kpi.data.endTimestamp) : null;

    let latestBlockNumber = null;
    if (kpi.data.dbBlockTableHead) {
      latestBlockNumber = kpi.data.dbBlockTableHead;
    } else {
      latestBlockNumber = kpi.data.endBlock;
    } 

    let dbLag = (kpi.data.currentBlockchainHead && latestBlockNumber) ? 
                BigNumber(kpi.data.currentBlockchainHead).minus(BigNumber(latestBlockNumber)) : 0;
    let lastUpdated = kpi.momentUpdated;

    let style = {fontSize:'9px'}

    return (
      <div className="NCPage">
        <div className="NCHeader pt-navbar">
          <div className="row">
            
            <div className="pt-navbar-group navbar-group-left">
              <Link to={"/dashboard"} className="logo">
                <img className="logo-img" src="img/logo/aion-icon.svg" alt="logo"/>
                <span className="title">Dashboard v2.0</span>
              </Link>
              <span className="pt-navbar-divider"></span>              
              <Popover
                className="hide"
                content={this.renderExplorerMenu()}
                interactionKind={PopoverInteractionKind.CLICK}
                position={Position.BOTTOM}>
                <Button 
                  className="text navbar-btn-active pt-button pt-minimal"
                  iconName="pt-icon-dashboard"
                  rightIconName="pt-icon-caret-down"
                  text="Explorer"/>          
              </Popover>

               <Popover
                className="hide"
                content={this.renderMetricMenu()} 
                interactionKind={PopoverInteractionKind.CLICK}
                position={Position.BOTTOM}>
                <Button 
                  className="navbar-btn-active pt-button pt-minimal"
                  iconName="pt-icon-chart"
                  rightIconName="pt-icon-caret-down"
                  text="Analytics"/>          
              </Popover>
              {/*<Button 
                  className="navbar-btn-active pt-button pt-minimal"
                  iconName="timeline-bar-chart"
                  onClick={() => window.open("https://metrics0.aion.network", "Aion | Metrics")}
                  text="Metrics"/>*/}   
            </div>

            <div className="pt-navbar-group navbar-group-right">
              
              <NCTopLevelSearch className="hide"/>
              
              <span className="pt-navbar-divider"></span>
              <NCLivenessIndicator 
                momentEnd={momentEnd}
                latestBlockNumber={latestBlockNumber}
                dbLag={dbLag}
                lastUpdated={lastUpdated}
              />
              
              {this.connectionMenu }
              {this.renderMobileMenu()}
              
            </div>

          </div>
          <div className="row show" >
            <div className="pt-navbar-group navbar-group-right">
              <NCTopLevelSearch/>
            </div>
          </div>
        </div>
        
        <div className="NCPageContent">
          <div className="container">
          { this.props.children }
          </div>
          {/*permissionsMenu*/}
        </div>
        <div className="NCFooter">
          <div>
            <a className="footer-container" rel="noopener" target="_blank" href="https://aion.network">
              <span className="text">Powered By</span>
              <img className="logo" src="img/logo/aion-icon.svg" alt="logo"/>
            </a>
          </div>  
          {(true)&&
          <div>
            {/*<a className="footer-container" target="_blank" href="/#/terms">
              <span style={style}  className="text">Terms of use</span>          
              
            </a>*/}
            
          
            <a className="footer-container" target="_blank" href="/#/feedback">
              <span style={style}  className="text">Feedback</span>          
              
            </a>
            &nbsp;
            <a className="footer-container" target="_blank" href="https://aion.network/community/">
              <span style={style}  className="text">Community</span>          
              
            </a>
            &nbsp;
            <a className="footer-container" target="_blank" href="https://aion.network/bounty/">
              <span style={style}  className="text">Bounties & Grants</span>          
              
            </a>
            &nbsp;
            <a className="footer-container" target="_blank" href="https://aion.network/developers/">
              <span style={style}  className="text">Developers</span>          
              
            </a>
           
          </div>
        }
         
        </div>
      </div>
    );
  }
}

export default connect((state) => {
  return ({
    kpi: state.kpi,
  })
})(NCLayout);
































