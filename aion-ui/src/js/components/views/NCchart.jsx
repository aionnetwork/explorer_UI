/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, hashHistory } from 'react-router';
import moment from 'moment';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { Button, Tab2, Tabs2 } from "@blueprintjs/core";

//import NCTxnTable from 'components/transactions/NCTxnTable';
//import NCBlkDetail from 'components/blocks/NCBlkDetail';
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
//import NCHashPowerByNodeChart from 'components/charts/NCHashPowerByNodeChart';

import * as StoreChartRetrieve from 'stores/StoreChartRetrieve'; 


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
  }

  componentWillMount() {
    this.isFirstRenderAfterMount = true;
  }

  componentDidMount() {
    //console.log('get data');
    this.parseChart(this.props.params.chartId);
    this.request();
  }

  componentWillReceiveProps(nextProps) {
    this.isFirstRenderAfterMount = false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.params.chartId != this.props.params.chartId){
      //console.log('get data update');
      this.parseChart(this.props.params.chartId);
      this.request();
    }
  }

  parseChart(str){

    console.log('time to parse string' + str);

    switch(str){
    case 'ActiveAddressGrowth':

        this.chartData.chart = <NCActiveAddressChart />
        this.chartData.description = "Active Address";
        this.chartData.type="line";
        this.chartData.id = 0;
        break;  
    case 'TopMiner':        
        this.chartData.chart = <NCTopMinersChart   />
        this.chartData.description = "Top Miner";
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
        this.chartData.description = "Transaction Times";
        this.chartData.type="line";
        this.chartData.id = 4;
        break;  
    case 'BlockTime':
        
        this.chartData.chart = <NCBlockTimesChart  />
        this.chartData.description = "Block Time";
        this.chartData.type="line";
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

    //const data =  [[1167609600000,0.7537],[1167696000000,0.7537],[1167782400000,0.7559],[1167868800000,0.7631],[1167955200000,0.7644],[1168214400000,0.769],[1168300800000,0.7683],[1168387200000,0.77],[1168473600000,0.7703],[1168560000000,0.7757],[1168819200000,0.7728],[1168905600000,0.7721],[1168992000000,0.7748],[1169078400000,0.774],[1169164800000,0.7718],[1169424000000,0.7731],[1169510400000,0.767],[1169596800000,0.769],[1169683200000,0.7706],[1169769600000,0.7752],[1170028800000,0.774],[1170115200000,0.771],[1170201600000,0.7721],[1170288000000,0.7681],[1170374400000,0.7681],[1170633600000,0.7738],[1170720000000,0.772],[1170806400000,0.7701],[1170892800000,0.7699],[1170979200000,0.7689],[1171238400000,0.7719],[1171324800000,0.768],[1171411200000,0.7645],[1171497600000,0.7613],[1171584000000,0.7624],[1171843200000,0.7616],[1171929600000,0.7608],[1172016000000,0.7608],[1172102400000,0.7631],[1172188800000,0.7615],[1172448000000,0.76],[1172534400000,0.756],[1172620800000,0.757],[1172707200000,0.7562],[1172793600000,0.7598],[1173052800000,0.7645],[1173139200000,0.7635],[1173225600000,0.7614],[1173312000000,0.7604],[1173398400000,0.7603],[1173657600000,0.7602],[1173744000000,0.7566],[1173830400000,0.7587],[1173916800000,0.7562],[1174003200000,0.7506],[1174262400000,0.7518],[1174348800000,0.7522],[1174435200000,0.7524],[1174521600000,0.7491],[1174608000000,0.7505],[1174867200000,0.754],[1174953600000,0.7493],[1175040000000,0.7493],[1175126400000,0.7491],[1175212800000,0.751],[1175472000000,0.7483],[1175558400000,0.7487],[1175644800000,0.7491],[1175731200000,0.7479],[1175817600000,0.8479],[1176076800000,0.7479],[1176163200000,0.7449],[1176249600000,0.7454],[1176336000000,0.8427]];

    const store = this.props.chartRetrieve;

    //console.log(JSON.stringify(store));

    const data =  nc_getChartData(store.response.content,this.chartData.type);
    store.response.content =[];
    
    console.log(JSON.stringify(data));

    const isLoadingTopLevel = this.isFirstRenderAfterMount || store.isLoadingTopLevel;
    const queryStr = store.queryStr;

    const desc = this.chartData.description;

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

    

    const page =
      <div> 
        <NCExplorerHead
          momentUpdated={store.momentUpdated} 
          breadcrumbs={breadcrumbs}
          title={"Chart"}
          subtitle={desc}
        />  

        {React.cloneElement(this.chartData.chart, {data: data})}   

       

        
      </div>;

    return (
      <NCExplorerPage
        isLoading={false}
        isDataValid={true} 
        isDataEmpty={false}
        
        loadingStr={"Loading Chart Details"}
        invalidDataStr={"Server error. Invalid Chart"}
        emptyDataStr={"No chart found"}
        
        page={page}/>
    );
  }
}

export default connect((state) => {
  return ({
    chartRetrieve: state.chartRetrieve,
  })
})(NCChartRetrieve);














































