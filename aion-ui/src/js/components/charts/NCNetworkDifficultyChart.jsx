/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Button, Tab2, Tabs2 } from "@blueprintjs/core";

import Exporting from 'highcharts/modules/exporting';
Exporting(Highcharts);

import NCEntityDetail from 'components/common/NCEntityDetail';

const EMPTY_STR = "Not Available";
import {BigNumber} from 'bignumber.js';

export default class NCActiveAddressChart extends Component
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
    let { entity, options, data} = this.props;

    const option = {
            exporting: {
                enabled:false,
            },
            time: {
                useUTC: false,
            },
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'Network Difficulty Chart'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                //min:0,
                type: this.type,

                title: {
                    text: 'Difficulty'
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
                name: 'Network Difficulty',
                data: data
            }]
        }

    return (
        <div>
            <Button onClick={() => {this.toggle()}} className = "pt-button pt-minimal pull-right" text="Toggle Logarithimic" />
        
            <HighchartsReact
                highcharts={Highcharts}
                options={option}
                />

        </div>
    );
  }
}
























