/* eslint-disable */
import React, { Component } from 'react';
import moment from "moment";

const FORMAT = "MMMM Do YYYY, h:mm:ss a";

export default class NCTimescale extends Component 
{
  render() 
  {
    const { dateObjArr, timestampArr, format = FORMAT, isMedium=false, disabled } = this.props;

    //console.log(dateObjArr);

    let startDate = null;
    let endDate = null;

    if (timestampArr != null) 
    {
      if (timestampArr[0] != null)
        startDate = moment.unix(timestampArr[0]);

      if (timestampArr[1] != null)
        endDate = moment.unix(timestampArr[1]);
    }
    else if (dateObjArr != null)
    {
      if (dateObjArr[0] != null)
        startDate = moment(dateObjArr[0]);

      if (dateObjArr[1] != null)
        endDate = moment(dateObjArr[1]);
    }
    else {
      console.log("no valid date provided to NCTimescale");
      return (null);
    }    

    return (
      <div className={"NCTimescale " + (isMedium ? "medium" : "")} >
        { (moment(startDate).isValid()) ? 
            <div 
              className={"pt-tag pt-minimal "+(!this.props.disabled ? "pt-intent-primary" : "")}>
              { startDate.format(format) }
            </div> : 
            <div 
              className={"pt-tag pt-minimal "+(!this.props.disabled ? "pt-intent-primary" : "")}>
              no date
            </div> 
        }
        { (moment(endDate).isValid()) ? <span className="pt-icon-arrow-right pt-icon-large"/> : null }
        { (moment(endDate).isValid()) ? 
          <div 
            className={"pt-tag pt-minimal "+(!this.props.disabled ? "pt-intent-primary" : "")}>
            { endDate.format(format) }
          </div> : null }
      </div>
    );
  }
}










