/* eslint-disable */
import React, { Component } from 'react';

import { Position, Tooltip } from "@blueprintjs/core";

class NCKPI extends Component
{
  render() {

    let { value, units, title, hoverContent, onClick } = this.props;
    let i = -1;
    let titleArr = title.map((title) => {i++; return <span key={i} className="title">{title}</span>});

    let tooltipPosition = this.props.tooltipPosition;

    if (tooltipPosition == null)
      tooltipPosition = Position.BOTTOM;

    return (
      <Tooltip
        isDisabled={!hoverContent ? true : false}
        className="NCKPI"
        portalClassName="NCKPI-tooltip"
        position={tooltipPosition}
        content={hoverContent}>
          <div onClick={(onClick != null) ? onClick : null} className="pt-card pt-interactive pt-elevation-1 kpi-card">
            {
              (value != null) &&
              <div className="metric">
                <span className="value">{value}</span>
                <span className="units">{units}</span>
              </div>
            }
            {
              (value == null) &&
              <div className="error">
                <span className="pt-icon-large pt-icon-time icon"></span>
                <span className="message">Loading</span>
              </div>
            }
            {
              titleArr
            }
          </div>
      </Tooltip>
    );
  }
}

export class NCKPIGroup extends Component
{
  render() {

    let { kpiGroup } = this.props;

    return (
      <div className="NCKPIGroup pt-card">
        <div className="group-title">{ kpiGroup.title }</div>
        {
          kpiGroup.kpiList.map((kpi, i) => 
            <NCKPI 
              key={i}
              value={kpi.value}
              units={kpi.units} 
              title={kpi.title} 
              onClick={kpi.onClick}
              hoverContent={kpi.hoverContent} 
              tooltipPosition={kpi.tooltipPosition}/>
          )
        }
      </div>
    );
  }
}

export class NCKPIResponsive extends Component
{
  render() {

    let { kpiGroup } = this.props;

    return (
      <div className="NCKPIGroup">
        <div className="group-title">{ kpiGroup.title }</div>
        
        {
          kpiGroup.kpiList.map((kpi, i) => 
          <div key={i}>
            <p>{kpi.title}</p>

            <b>{kpi.value+" "+kpi.units}</b><br/><hr/>
          </div>
          )
        }
      </div>
    );
  }
}













































