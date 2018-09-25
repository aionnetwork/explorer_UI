/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import NCEntityDetail from 'components/common/NCEntityDetail';

const EMPTY_STR = "Not Available";
import {BigNumber} from 'bignumber.js';

export default class NCActiveAddressChart extends Component
{
  render() {
    let { entity, options} = this.props;

    

    return (
       <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
    );
  }
}
























