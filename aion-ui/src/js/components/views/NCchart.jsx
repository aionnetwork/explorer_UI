///* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, hashHistory } from 'react-router';
import moment from 'moment';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { Button, Tab2, Tabs2 } from "@blueprintjs/core";

import NCExplorerPage from 'components/common/NCExplorerPage';
import NCExplorerHead from 'components/common/NCExplorerHead';
import NCExplorerSection from 'components/common/NCExplorerSection';


//list of charts
import NCActiveAddressChart from 'components/charts/NCActiveAddressChart';
import NCTransactionsChart from 'components/charts/NCTransactionsChart';
import NCNetworkDifficultyChart from 'components/charts/NCNetworkDifficultyChart';
import NCTopMinersChart from 'components/charts/NCTopMinersChart';
import NCBlockTimesChart from 'components/charts/NCBlockTimesChart';
import NCHashPowerChart from 'components/charts/NCHashPowerChart';
import * as StoreChartRetrieve from 'stores/StoreChartRetrieve'; 
import * as MSG from 'lib/NCTerms';


import { nc_getChartData, nc_LinkToEntity, nc_hexPrefix, nc_isListValid, nc_isListEmpty, nc_isObjectValid, nc_isObjectEmpty, nc_isPositiveInteger } from 'lib/NCUtility';
import * as network from 'network/NCNetworkRequests';

class NCChartRetrieve extends Component
{
  constructor(props) {
    super(props);
    this.chartData ={
      chart:<span>Loading</span>,
      description:null,
      type:null,
      id:null
    };
    this.cLoad=true;
    this.type = 'logarithmic';
    this.state={
      type: 'linear',
      darkMode:false
    };
  }

   toggle = () => {
    (this.state.type !== 'logarithmic') ? this.setState({type: 'logarithmic'}) : this.setState({type: 'linear'});

  }

  componentWillMount() {
    this.isFirstRenderAfterMount = true;
    localStorage.getItem('d_mode') && this.setState({darkMode:JSON.parse(localStorage.getItem('d_mode'))});
  }

  componentDidMount() {
    
    this.parseChart(this.props.params.chartId);
    this.request();
  }

  componentWillReceiveProps(nextProps) {
    this.isFirstRenderAfterMount = false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.params.chartId != this.props.params.chartId){
      this.cLoad=false;
      this.parseChart(this.props.params.chartId);
      this.request();
    }
  }

   /*Below parse data for each specific charts*/

  parseChart(str){

    switch(str){
    case 'ActiveAddressGrowth':

        this.chartData.chart = <NCActiveAddressChart />
        this.chartData.description = "Active Address";
        this.chartData.type="line";
        this.chartData.id = 0;
        break;  
    case 'TopMiner':        
        this.chartData.chart = <NCTopMinersChart   />
        this.chartData.description = "Top Miners";
        this.chartData.type="pie";
        this.chartData.id = 1;
        break;  
    case 'Difficulty':        
        this.chartData.chart =  <NCNetworkDifficultyChart  />
        this.chartData.description = "Network Difficulty";
        this.chartData.type="line";
        this.chartData.id = 2;
        break;                
    case 'HashingPower':
        this.chartData.chart = <NCHashPowerChart  />
        this.chartData.description = "Hashing Power";
        this.chartData.type="line";
        this.chartData.id = 3;
        break;    
    case 'TransactionsoverTime':
        this.chartData.chart = <NCTransactionsChart  />
        this.chartData.description = "Transactions per Hour";
        this.chartData.type="bar";
        this.chartData.id = 4;
        break;  
    case 'BlockTime':
        
        this.chartData.chart = <NCBlockTimesChart  />
        this.chartData.description = "Block Time";
        this.chartData.type="bar";
        this.chartData.id = 5;
        break;  
    default:
        this.chartData.chart = 'Invalid data';
        break;
    }
    //console.log(this.chartData.description);
    return;

  }

  request = () => {
    //console.log('Chart params: '+this.chartData.id);
    network.getChartRetrieve(this.chartData.id);
  }

 
  render() {

    
   const store = this.props.chartRetrieve;
   let data = []

    
    if(this.cLoad){
      data =  nc_getChartData(store.response.content,this.chartData.type);

    }else{
      store.response.content =[];
      this.cLoad = true;
      
    }

    
    const isLoadingTopLevel = this.isFirstRenderAfterMount || store.isLoading;
    const queryStr = store.queryStr;
    const desc = this.chartData.description;
    let log = this.type;

    const blkObj = (store.response) ? store.response.blk : null;
    const txnList = (store.response) ? store.response.txn : null;

    let isBlkValid = nc_isObjectValid(blkObj);
    let isBlkEmpty = nc_isObjectEmpty(blkObj, isBlkValid);

    let isTxnListValid = nc_isListValid(txnList);
    let isTxnListEmpty = nc_isListEmpty(txnList, isTxnListValid);

    const blk = isBlkEmpty ? {} : blkObj.content[0]; 

    let chart = '';    


    const breadcrumbs = [
      {
        link: '/',
        body: 'Home',
      },
      
      {
        link: '#',
        body: this.chartData.description + ' Chart',
      }
    ];

    let mode = (this.state.darkMode) ? '#000' : '#fff';
    //console.log(JSON.stringify(data));
    const page =
      <div> 
        <NCExplorerHead
          momentUpdated={store.momentUpdated} 
          breadcrumbs={breadcrumbs}
          title={"Chart"}
          subtitle={desc}
        />  

        
        {(this.chartData.description==="Network Difficulty")&&
          <Button onClick={() => {this.toggle()}} className = "pt-button pt-minimal pull-right" text="Toggle Log" />
        }


        {React.cloneElement(this.chartData.chart, {data: data, type: this.state.type, mode:mode})}   
       
      </div>;

    return (
      <NCExplorerPage
        isLoading={isLoadingTopLevel}
        isDataValid={true} 
        isDataEmpty={false}
        
        loadingStr={MSG.Chart.LOADING}
        invalidDataStr={MSG.Chart.INVALID_DATA}
        emptyDataStr={MSG.Chart.EMPTY_DATA}
        
        page={page}/>
    );
  }
}

export default connect((state) => {
  return ({
    chartRetrieve: state.chartRetrieve,
    darkMode: state.dark,
  })
})(NCChartRetrieve);














































