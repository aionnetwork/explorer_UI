/* eslint-disable */
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';

import { NCEntity, NCEntityInfo } from 'lib/NCEnums';
import { nc_trim, nc_GetEntityIcon, nc_LinkToEntity } from 'lib/NCUtility';

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

























