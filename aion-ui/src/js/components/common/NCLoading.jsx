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
        <Spinner className={""} intent={ Intent.PRIMARY } />
        <span className={"title pt-text-muted"}>{ title }</span>
      </div>
    );
  }
}























































