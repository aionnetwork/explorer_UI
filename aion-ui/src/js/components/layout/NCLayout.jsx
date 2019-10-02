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
import {strings as MSG} from 'lib/NCTerms';
import {setLanguage as changeLanguage} from 'lib/NCTerms';
import {language} from 'lib/NCTerms';

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

    localStorage.getItem('lng_mode') && changeLanguage(localStorage.getItem('lng_mode'));

    //network.getDashboardData();
    //network.getKPIData();

  }
  componentWillUpdate(){

  }

  componentDidMount() {
    /*if(this.props.location.pathname !== "/dashboard"){
       network.getHealthData();
    }else{
       //stopInterval(intervalID.health);
    }*/
    network.getHealthData();
    this.d_mode_class = (this.props.darkMode.data) ? "darkMode" : "";   
  }

  componentWillUnmount() {
    //disconnectSocket();
    stopInterval(intervalID.health);
  }

  //change the language state
  //accepts language code as a param

  changeLanguage = (language) => {
        console.log(' language '+ language);
  };

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
          text={MSG.Metric_menu_item_1}
        /></div>
        <MenuItem
          className="nav-option"
          text={MSG.Metric_menu_item_2}
        >
        <MenuItem
           className="nav-option"

           onClick={() => {
              hashHistory.push('/charts/PoSBlockTime');
           }}
           text={MSG.Metric_menu_item_2_a}
        />
        <MenuItem
           className="nav-option"

           onClick={() => {
              hashHistory.push('/charts/PoWBlockTime');
           }}
           text={MSG.Metric_menu_item_2_b}
        />
        </MenuItem>
        <MenuItem
          className="nav-option"
          
          onClick={() => {
            hashHistory.push('/charts/HashingPower');
          }}
          text={MSG.Metric_menu_item_3}
        />
        <MenuItem
                  className="nav-option"
                  text={MSG.Metric_menu_item_4}
                >
                        <MenuItem
                                  className="nav-option"

                                  onClick={() => {
                                    hashHistory.push('/charts/PoSDifficulty');
                                  }}
                                  text={MSG.Metric_menu_item_4_a}
                                />
                        <MenuItem
                                                  className="nav-option"

                                                  onClick={() => {
                                                    hashHistory.push('/charts/PoWDifficulty');
                                                  }}
                                                  text={MSG.Metric_menu_item_4_b}
                                                />
                </MenuItem>
        <MenuItem
          className="nav-option"
          
          onClick={() => {
            hashHistory.push('/charts/TopMiner');
          }}
          text={MSG.Metric_menu_item_5}
        />
        
         
        
         <MenuItem
            className="nav-option"
            onClick={() => {
              hashHistory.push('/charts/TransactionsoverTime');
            }}
            text={MSG.Metric_menu_item_6}
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
                text={MSG.Mobile_menu_item_1}
              >
              {this.renderExplorerMenu()} 
              </MenuItem>
              <MenuItem
                className="nav-option"
                iconName={NCEntityInfo[NCEntity.BLOCK].icon}
                text={MSG.Mobile_menu_item_2}
              >
              {this.renderMetricMenu()} 
              </MenuItem>
              <MenuItem
                className="nav-option"
                iconName={NCEntityInfo[NCEntity.BLOCK].icon}
                text={MSG.Mobile_menu_item_3}
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
          text={MSG.Explorer_menu_item_1}
        /></div>
        <MenuItem
          className="nav-option"
          iconName={NCEntityInfo[NCEntity.BLOCK].icon}
          onClick={() => {
            hashHistory.push('/blocks');
          }}
          text={MSG.Explorer_menu_item_2}
        />
        <MenuItem
          className="nav-option"
          iconName={NCEntityInfo[NCEntity.CNTR].icon}
          onClick={() => {
            hashHistory.push('/contracts');
          }}
          text={MSG.Explorer_menu_item_3}
        />
        <MenuItem
          className="nav-option"
          iconName={NCEntityInfo[NCEntity.TKN].icon}
          onClick={() => {
            hashHistory.push('/tokens');
          }}
          text={MSG.Explorer_menu_item_4}
        />
        <MenuItem
          className="nav-option"
          iconName={NCEntityInfo[NCEntity.TXN].icon}
          onClick={() => {
            hashHistory.push('/transactions');
          }}
          text={MSG.Explorer_menu_item_5}
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
              <MenuDivider className="" title={MSG.Connection_menu_item_1} />
              { menuItemList }

              <MenuDivider className="" title={MSG.Connection_menu_item_2} />

        {(false)&&<MenuItem
              className="nav-option"
              iconName={NCEntityInfo[NCEntity.ACCOUNT].icon}              
              text={MSG.Connection_menu_item_4}>

                <MenuItem
                  className="nav-option"
                  onClick={
                    () => {
                       changeLanguage('en');
                    }
                  }
                  text="English (En)"
                />
                <MenuItem
                  className="nav-option"
                  onClick={() => {
                     changeLanguage('zn');
                  }}
                  text="Chinese (Zn)"
                />

                <MenuItem
                  className="nav-option"
                  onClick={() => {
                     changeLanguage('es');//.then(function(language){console.log('test '+ language);});
                   }}
                  text="Spanish (Es)"
                />
                
                                             

          </MenuItem> }
          
          <FormGroup>
            <Switch checked={this.state.darkMode} label={MSG.Connection_menu_item_3} onChange={() => {
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
    
    let style = {fontSize:'11px',marginTop:'-1px'}

    return (
      <div className={mode + " NCPage"}>
        <div className="NCHeader pt-navbar">
          <div className="row">

            
            
            <div className="pt-navbar-group navbar-group-left">
              <Link to={"/dashboard"} className="logo">
                <img className="logo-img" src="img/logo/aion-icon.svg" alt="logo"/>
                <span className="title">{MSG.Header_title}</span>
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
              
              <NCTopLevelSearch dialog={false} className="hide"/>
              
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
              <NCTopLevelSearch dialog={true} />
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
            &nbsp;|&nbsp;
            <a className="footer-container" target="_blank" href="https://docs.aion.network/">
                <span style={style}  className="text">Docs</span>
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
































