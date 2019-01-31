/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);

//import NCEntityDetail from 'components/common/NCEntityDetail';
import appConfig from '../../../config.json';
import { NC_ENV} from 'network/NCNetwork';

const EMPTY_STR = "Not Available";
//import {BigNumber} from 'bignumber.js';
import { nc_compare } from 'lib/NCUtility';



export default class NCTopMinersChart extends Component
{
  render() {
    let {data, mode} = this.props;
    //console.log('pie chart');

    let points = data.sort(nc_compare);
    //console.log(JSON.stringify(points));

    const option = {

    exporting: {
        chartOptions: { // specific options for the exported image
            plotOptions: {
                series: {

                    dataLabels: {
                        enabled: true,                        
                    }
                }
            }
        },
        sourceWidth: 2000,
        fallbackToExportServer: false,
        csv: {
            
            dateFormat: '%Y-%m-%d'
        }
    },
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height:'50%',
        backgroundColor: mode, 
    },
    title: {
        text: 'Top Miners For The Past 7 days'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    credits:{enabled:false},
    plotOptions: {

        pie: {
            allowPointSelect: true,
            cursor: 'pointer',

            dataLabels: {
                enabled: true,
                format: '{point.percentage:.1f} %',
                style: {
                    color:  'black'
                }
            },

            events: {
                    click: function({point}) {
                        location.href = 'https://'+NC_ENV.HOME_URL+'/#/account/'+point.name;
                    }
                }
        },
         bar: {
            allowPointSelect: true,
            cursor: 'pointer',

            dataLabels: {
                enabled: true,
                format: '{point.y} ',
                style: {
                    color:  'black'
                }
            },
        
            events: {
                    click: function({point}) {
                        location.href = 'https://'+appConfig.site.base_url+'/#/account/'+point.name;
                    }
                }
        }
    },
    series: [{
        name: 'Mined Blocks',
        colorByPoint: true,
        data: points
    }]
}

    return (
       <HighchartsReact
          highcharts={Highcharts}
          options={option}
        />
    );
  }
}
























