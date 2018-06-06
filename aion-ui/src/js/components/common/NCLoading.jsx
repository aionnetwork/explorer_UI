import React, { Component } from 'react';
import { Spinner, Intent } from "@blueprintjs/core";

export default class NCLoading extends Component
{
  render() {
    const { title, marginTop="140", marginBottom="0" } = this.props;

    return (
      <div
        className="NCLoading"
        style={{
          paddingTop: `${marginTop}px`,
          paddingBottom: `${marginBottom}px`,
        }}>
        <Spinner className={"pt-dinner"} style={{stroke: '#4221cc'}}/>
        <span className={"title"} style={{color: '#4221cc'}}>{ title }</span>
      </div>
    );
  }
}
