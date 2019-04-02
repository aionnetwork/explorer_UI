/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Button, Tab2, Tabs2 } from "@blueprintjs/core";
import {strings as MSG} from 'lib/NCTerms';//MSG.Chart_4_title

import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);

import NCEntityDetail from 'components/common/NCEntityDetail';

const EMPTY_STR = "Not Available";
import {BigNumber} from 'bignumber.js';

export default class NCNetworkDifficultyChart extends Component
{
  constructor(props) 
  {
    super(props);

    // entity type does not change over lifecyle in this app
    this.type = 'logarithmic';
  }

  toggle = () => {
    //Highcharts().yAxis[0].update({ type: 'linear'});
    this.type = 'linear';
    console.log('toggle!');
  }
  render() {
    let { type, entity, options, data, mode} = this.props;

    const option = {
            exporting: {
                enabled:false,
            },
            time: {
                useUTC: false,
            },
            chart: {
                zoomType: 'x',
                backgroundColor: mode,
            },
            title: {
                text: MSG.Chart_4_title
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        MSG.Chart_4_subtitle_a : MSG.Chart_4_subtitle_b
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                //min:0,
                type: type,

                title: {
                    text: MSG.Chart_4_y_title
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
                name: MSG.Chart_4_series_title,
                data: data
            }]
        }

    return (
        <div>
            
            <HighchartsReact
                highcharts={Highcharts}
                options={option}
                />

        </div>
    );
  }
}
























