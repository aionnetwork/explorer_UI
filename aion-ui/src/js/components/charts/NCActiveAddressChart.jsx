/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);

//import NCEntityDetail from 'components/common/NCEntityDetail';
import {strings as MSG} from 'lib/NCTerms';//MSG.Chart_1_title

const EMPTY_STR = "Not Available";

//import {BigNumber} from 'bignumber.js';

export default class NCActiveAddressChart extends Component
{
  render() {
    let {type, data, mode} = this.props;



    const option = {
            exporting: {
                enabled:false,
            },
            chart: {
                zoomType: 'x',
                backgroundColor: mode,
            },
            time: {
                useUTC: false,
            },
            title: {
                text: MSG.Chart_1_title
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        MSG.Chart_1_subtitle_a
                         :
                        MSG.Chart_1_subtitle_b
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: { 
                //min:0,
                type: type,
                title: {
                    text: 'Address total'
                }
            },
            legend: {
                enabled: false
            },
            credits:{enabled:false},
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2,
                        
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'area',
                name: MSG.Chart_1_series_title,
                data: data,
                tuboThreshold:15000,
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
























