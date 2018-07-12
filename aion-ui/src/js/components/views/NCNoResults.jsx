/* eslint-disable */
import React, { Component } from 'react';
import NCNonIdealState from 'components/common/NCNonIdealState'

export default class NCNoResults extends Component
{ 
  render() {  
    let msg = "No blocks, transactions or accounts found";
    if (this.props.params.query) 
      msg += " for query: \"" + this.props.params.query + "\"."
    else
      msg += "."

    return (
      <div className="NCNoResults">
        <NCNonIdealState
          paddingTop={150}
          icon={"pt-icon-geosearch"}
          title={"No Search Results Found"}
          home={true}
          description={msg}/>
      </div>
    );
  }
}























