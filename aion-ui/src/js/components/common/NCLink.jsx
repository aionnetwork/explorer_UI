/* eslint-disable */
import React, { Component } from 'react';
import {  hashHistory } from 'react-router';


export default class NCLink extends Component
{
  render() {

    let { link, title="Undefined", className="", enabled=true } = this.props;

    return( 
        <span 
          className={"NCLink " + (className != null ? className : "") + (enabled ? " enabled" : "")}
          onClick={(e) => { if (enabled) hashHistory.push(link) }}>
          <span className="text pt-text-overflow-ellipsis ">{ title }</span>
        </span>
    );
  }
}

























