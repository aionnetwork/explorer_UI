/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import NCEntityDetail from 'components/common/NCEntityDetail';

const EMPTY_STR = "Not Available";
import {BigNumber} from 'bignumber.js';

export default class NCTopMinersChart extends Component
{
  render() {
    let { entity, options, data} = this.props;
    //console.log('pie chart');
    const option = {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height:'50%' 
    },
    title: {
        text: 'Top Miners For The Last Week'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color:  'black'
                }
            }
        }
    },
    series: [{
        name: 'Mined Blocks',
        colorByPoint: true,
        data: [{
            name: 'a01e4f5026fa0c49364ed885aa4eb12f0cc585ffb860d55d96accee1b8f3fca3',
            y: 61.41,
            sliced: true,
            selected: true
        }, {
            name: 'a01e4f5026fa0c49364e3285aa4eb12f0cc585ffb860d55d96accee1b8f3fca3',
            y: 11.84
        }, {
            name: 'a01e4f5026fa0c49364ed885aa4eb12f0cc585ffb860d55d96accee1b8f3fcdk',
            y: 10.85
        }, {
            name: 'a01e4f5026fa0c49364ed885aa4eb12f0cc585ffb860d55d96accee1b8f3fqke',
            y: 40.67
        }, {
            name: 'a01e4f5026fa0c49364ed885aa4eb12f0cc585ffb860d55d96accee1b8f31w32',
            y: 18.2
        }, {
            name: 'a01e4f5026fa0c49364ed885aa4eb12f0cc585ffb860d55d96accee1b81w23e4',
            y: 22.61
        }]
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
























