import React, { Component } from 'react';
import { Link } from 'react-router'; 
import { DateRangeInput } from "@blueprintjs/datetime";
import { Button,  Classes } from "@blueprintjs/core";


export default class NCNonIdealState extends Component
{
  constructor(props) {
    super(props);
    this.state = {start:null, end:null,startDate:null, endDate:null, rangeChange:true
    };
    this.loading = false;
    //this.serchDirection = SEARCH_DIR.NONE;
  }

  handleRangeChange = (date) => {
    //console.log(date[0]);
    this.setState({
        start: date[0], end: date[1],rangeChange:false
      });
  }

  renderCalendarRange = () => {

    //let date = new Date();
    //const today = date; 
    //const launch = date.setTime(1524455999000); 

    return (  
      <div>
        <DateRangeInput
          formatDate={date => date.toLocaleString()}
          onChange={this.handleRangeChange}
          parseDate={str => new Date(str)}
          value={[this.state.start, this.state.end]}
          minDate={new Date(2018, 3, 22)}
          maxDate={new Date()}
        />  
        <Button             
            className="pt-minimal " 
            text="Filter range"
            disabled={this.state.rangeChange}            
            onClick={() => {
              this.setState({
                rangeChange:true
              });
              let start = Math.round(new Date(this.state.start).getTime()/1000);
              let end = Math.round(new Date(this.state.end).getTime()/1000);
              console.log(end);
              this.setState({
                startDate:start,
                endDate:end
              });//this.state.startDate,this.state.endDate
              //this.serchDirection = SEARCH_DIR.BACKWARD;
              this.props.onCallBack(0,25, start, end);
            }}/>  
      </div>
    );
  }

  render() {
    const { filter, onCallBack, paddingTop="140", paddingBottom="0", title, description, icon, showHomeLink=false } = this.props;
    console.log(filter);
    return (
      <div 
        className="NCNonIdealState"
        style={{
          paddingTop: `${paddingTop}px`,
          paddingBottom: `${paddingBottom}px`,
        }}>
        <div className="pt-non-ideal-state" >
          <div className="pt-non-ideal-state-visual pt-non-ideal-state-icon">
            <span className={"pt-icon " + icon}></span>
          </div>
          <h4 className="pt-non-ideal-state-title">{title}</h4>
          {
            (description != null) &&
            <div className="pt-non-ideal-state-description">
              { description }
            </div>
          }

          { (filter)&&
            
            this.renderCalendarRange()
          }

          {
            (showHomeLink) && 
            <div className="pt-non-ideal-state-btn">
              <Link to="/">
                <button type="button" className="pt-button pt-intent-primary pt-minimal nc-minimal-btn-shadow">
                  <span className="pt-icon-standard pt-icon-home"></span>
                  Navigate Home
                </button>
              </Link>
              
            </div>
          }

          
        </div>
      </div>
    );
  }
}
