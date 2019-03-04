/* eslint-disable */
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router'
import { connect } from 'react-redux';

import {BigNumber} from 'bignumber.js'
import moment from "moment";
import {  FormGroup, Switch, Menu, ContextMenu, ContextMenuTarget, MenuItem, Position, Classes, InputGroup, Popover, Button, PopoverInteractionKind, Spinner, Tooltip, MenuDivider } from "@blueprintjs/core";

import { ncNetwork_pollForKpiList, ncNetwork_pollForStaticInfo } from 'network/NCNetwork';

import NCLivenessIndicator from 'components/layout/NCLivenessIndicator';
import NCTopLevelSearch from 'components/layout/NCTopLevelSearch';
import NCLoading from 'components/common/NCLoading';

import { NCNETWORK_REQUESTS_ENABLED } from 'network/NCNetwork';

import { NCEntity, NCEntityInfo } from 'lib/NCEnums';
import { ga_key } from 'lib/NCData';

import { NC_ENV, disconnectSocket, stopInterval, intervalID } from 'network/NCNetwork';
import * as network from 'network/NCNetworkRequests';

import appConfig from '../../../config.json';

import ReactGA from 'react-ga';
//ReactGA.initialize(appConfig.ga_key);
//ReactGA.pageview(window.location.pathname + window.location.search);
//console.log('2 index!');
ReactGA.initialize(NC_ENV.GA_KEY);
ReactGA.pageview(window.location.pathname + window.location.search);

class NCLayout extends Component {

  constructor(props) {
    super(props);

    
      this.state = {darkMode : false,};
    

    this.connectionMenu = 
    <Button 
      className="navbar-btn-active pt-button pt-minimal"
      text="Explorer"/>;  

    //let networkList = appConfig.network_list;
    this.networkList = NC_ENV.NETWORK_LIST;
      
    // figure out document title -----------------------------------------------

    let documentTitle = "Aion | Explorer";

    if (this.networkList && this.networkList[0] && this.networkList[0].name)
      documentTitle = "Aion | "+this.networkList[0].name;

    document.title = documentTitle; 

    // figure out the menu items -----------------------------------------------

    if (this.networkList && this.networkList[0].name) {
      this.connectionMenu = 
        <Button className="navbar-btn-active pt-button pt-minimal" text={this.networkList[0].name}/>; 
    }

    this.connectionMenuItemList = [];

            
  }

  componentWillMount() {
    
    localStorage.getItem('d_mode') && this.setState({darkMode:JSON.parse(localStorage.getItem('d_mode'))});
    network.getDashboardData();
    network.getKPIData(); 
  }

  componentDidMount() {
    
    //this.mode = (this.state.darkMode!==false) ? "darkMode" : "";
    //this.mode = (this.props.darkMode.data) ? "darkMode" : "";  
    this.d_mode_class = (this.props.darkMode.data) ? "darkMode" : "";   
  }

  componentWillUnmount() {
    disconnectSocket();
    stopInterval(intervalID);
  }


  toggleMode = () => {
    
    localStorage.setItem('d_mode', !this.state.darkMode);
    network.setDarkMode(!this.state.darkMode);

    this.setState({ darkMode: !this.state.darkMode });
    
    //console.log(this.state.darkMode);
  }

  darkModeOn = () => {
    this.darkMode = true;
  }

  darkModeOff = () => {
    this.darkMode = false;
  }

  renderMetricMenu = (mode) => {
    return (
      <Menu className={mode +" NCNavMenu"}>
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
   
  renderMobileMenu = (mode) => {

    
     return(<Popover
          content={
            <Menu className={mode+" NCNavMenu"}>
              
              <MenuItem
                className="nav-option"
                iconName={NCEntityInfo[NCEntity.BLOCK].icon}
                text="Explorer"
              >
              {this.renderExplorerMenu()} 
              </MenuItem>
              <MenuItem
                className="nav-option"
                iconName={NCEntityInfo[NCEntity.BLOCK].icon}
                text="Analytics"
              >
              {this.renderMetricMenu()} 
              </MenuItem>
              <MenuItem
                className="nav-option"
                iconName={NCEntityInfo[NCEntity.BLOCK].icon}
                text="Switch Network"
              >
              {this.connectionMenuItemList} 
              </MenuItem>
              
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

  renderExplorerMenu = (mode) => {
    return (
      <Menu className={mode+" NCNavMenu"}>
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
   

  renderConnectionMenu = (networkList,mode) => {if(Array.isArray(networkList) && networkList.length > 1) {
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
            <Menu className={mode + " NCNavMenu"}>
              <MenuDivider title="Switch Network" />
              { menuItemList }

              <MenuDivider title="Explorer Settings" />

        <MenuItem
              className="nav-option"
              iconName={NCEntityInfo[NCEntity.ACCOUNT].icon}              
              text="Language">

                <MenuItem
                  className="nav-option"
                  
                  text="Coming soon"
                />
                
                                             

          </MenuItem>
          
          <FormGroup>
            <Switch checked={this.state.darkMode} label="Dark Mode" onChange={() => {
                this.toggleMode();
            }} />
            
          </FormGroup>
          
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




    } }

  render() 
  {
    const pathname = this.props.location.pathname;

    
    ReactGA.pageview(pathname);

    

    let kpi = this.props.kpi;
    {let css = {zIndex:'999',background:"#4221cc",color:"#fff", position:'fixed',float:'right', bottom:'50px', right:'50px'};
    let feedback ={padding:'10px', margin:'10px'}
    
    
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
   
      
    let mode = (this.props.darkMode.data) ? "darkMode" : ""; 
    this.renderConnectionMenu(this.networkList,mode);
    
    let style = {fontSize:'11px'}

    return (
      <div className={mode + " NCPage"}>
        <div className="NCHeader pt-navbar">
          <div className="row">

            
            
            <div className="pt-navbar-group navbar-group-left">
              <Link to={"/dashboard"} className="logo">
                <img className="logo-img" src="img/logo/aion-icon.svg" alt="logo"/>
                <span className="title">Dashboard v2.1</span>
              </Link>
              <span className="pt-navbar-divider"></span>              
              <Popover
                className="hide"
                content={this.renderExplorerMenu(mode)}
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
                content={this.renderMetricMenu(mode)} 
                interactionKind={PopoverInteractionKind.CLICK}
                position={Position.BOTTOM}>
                <Button 
                  className="navbar-btn-active pt-button pt-minimal"
                  iconName="pt-icon-chart"
                  rightIconName="pt-icon-caret-down"
                  text="Analytics"/>          
              </Popover>
              
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
              
              {this.connectionMenu}
              {this.renderMobileMenu(mode)}

              
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
          {(false)&& <div>
            <a className="footer-container" rel="noopener" target="_blank" href="https://aion.network">
              <span className="text">Powered By</span>
              <img className="logo" src="img/logo/aion-icon.svg" alt="logo"/>
            </a>
          </div>
          } 
          {(true)&&

          <div>
            {/*<a className="footer-container" target="_blank" href="/#/terms">
              <span style={style}  className="text">Terms of use</span>          
              
            </a>*/} 
            <br/>
            
          
            <a className="footer-container" target="_blank" href="https://aionnetwork.atlassian.net/servicedesk/customer/portal/9">
              <span style={style}  className="text">Feedback</span>          
              
            </a>
            &nbsp;|&nbsp;
            <a className="footer-container" target="_blank" href="https://aion.network/community/">
              <span style={style}  className="text">Community</span>          
              
            </a>
            &nbsp;|&nbsp;
            <a className="footer-container" target="_blank" href="https://aion.network/bounty/">
              <span style={style}  className="text">Bounties & Grants</span>          
              
            </a>
            &nbsp;|&nbsp;
            <a className="footer-container" target="_blank" href="https://aion.network/developers/">
              <span style={style}  className="text">Developers</span>          
              
            </a>
               &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            <a className="footer-container" rel="noopener" target="_blank" href="https://aion.network">
              <span style={style}>Powered By</span>
              <img  height="25" src="img/logo/aion-icon.svg" alt="logo"/>
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
    darkMode: state.dark,
  })
})(NCLayout);
































