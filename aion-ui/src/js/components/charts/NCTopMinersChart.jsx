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
                format: '{point.percentage:.1f} %',
                style: {
                    color:  'black'
                }
            }
        }
    },
    series: [{
        name: 'Mined Blocks',
        colorByPoint: true,
        data: data
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
























