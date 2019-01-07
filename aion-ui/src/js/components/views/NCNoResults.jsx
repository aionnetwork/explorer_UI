/* eslint-disable */
import React, { Component } from 'react';
import NCNonIdealState from 'components/common/NCNonIdealState'
import * as MSG from 'lib/NCTerms';

export default class NCNoResults extends Component
{ 
  render() {  
    let msg = MSG.Search.EMPTY_DATA_LIST;
    if (this.props.params.query) 
      msg += MSG.Search.EMPTY_DATA+"  \"" + this.props.params.query + "\"."
    else
      msg += "."

    return (
      <div className="NCNoResults">
        <NCNonIdealState
          paddingTop={150}
          icon={"pt-icon-geosearch"}
          title={MSG.Search.EMPTY_DATA_TITLE}
          home={true}
          description={msg}/>
      </div>
    );
  }
}























