/* eslint-disable */
import React, { Component } from 'react';

export default class NCEntityDetail extends Component
{
  render() {

    let { desc } = this.props;

    return (
      <div className="NCEntityDetail">
      {
        desc.map(function(row, i){
          return (
            <div key={i} className="row">
              <div className="field">
                {row.field}
              </div>
              <div className="value">
                {row.value}
              </div>
            </div>
          );
        })
      }
      </div>
    );
  }
}
























