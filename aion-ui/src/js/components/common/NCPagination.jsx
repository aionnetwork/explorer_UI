/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DateRangePicker, DateRangeInput } from "@blueprintjs/datetime";
import {strings as MSG} from 'lib/NCTerms';

import moment from 'moment';
import { Button, Position, Classes, Popover, Menu, MenuItem, InputGroup, Intent, PopoverInteractionKind } from "@blueprintjs/core";

const SEARCH_DIR = {
  NONE: 0,
  FORWARD: 1,
  BACKWARD: 2,
}

export default class NCPagination extends Component
{
  constructor(props) {
    super(props);
    this.state = {start:null, end:null,startDate:null, endDate:null,newMaxDate:new Date(), rangeChange:true,minDate:new Date(2018, 3, 22)
    };
    this.loading = false;
    this.serchDirection = SEARCH_DIR.NONE;
  }

  componentDidMount() {
    
    //localStorage.getItem('p_size') && this.setState({'page_size':JSON.parse(localStorage.getItem('p_size'))});//this.state.page_size
   
  }

  handleRangeChange = (date) => {
    
    let newDate = new Date(this.state.start);
    if(date[0]!=null){
      newDate.setDate(newDate.getDate() + 7);
    }

    this.setState({
        start: date[0], end: date[1],rangeChange:false,minDate:date[0],newMaxDate:newDate
      });
  }
  renderCalendarRange = (t) => {

    
    //console.log(this.state.start);
    if(this.state.start!=null){
      var newDate = new Date(this.state.start);

      newDate.setDate(newDate.getDate() + 7);
      //console.log(newDate);
      //console.log(this.state.start.getDate());
    }

    return (  
      <div className="NCDateFilter">
        <DateRangeInput
          formatDate={date => date.toLocaleString()}
          onChange={this.handleRangeChange}
          parseDate={str => new Date(str)}
          value={[this.state.start, this.state.end]}
          minDate={(this.state.start!=null) ? this.state.minDate : new Date(2018, 3, 22)}
          maxDate={(this.state.start!=null) ? new Date() : new Date()}
          shortcuts={false}
        />  
        <Popover
        content={MSG.date_filter_policy}
        interactionKind={PopoverInteractionKind.HOVER}
        inline={false}
        popoverClassName="NCLivenessIndicator-Popover"
        className="NCLivenessIndicator dateFilter"
        position={Position.BOTTOM_RIGHT}>
        <Button             
            className="pt-minimal " 
            text="Filter"
            disabled={this.state.rangeChange}            
            onClick={() => {
              this.setState({
                rangeChange:true
              });
              let start = Math.round(new Date(this.state.start).getTime()/1000);
              let end = Math.round(new Date(this.state.end).getTime()/1000);
              //console.log(end);
              this.setState({
                startDate:start,
                endDate:end
              });
              //this.state.startDate,this.state.endDate
              this.serchDirection = SEARCH_DIR.BACKWARD;
              this.props.onPageCallback(0,25, start, end);
            }}/> 
        </Popover> 
      </div>
    );
  }

  renderCalendarMenu = () => {
    return (
      <Menu className={"NCNavMenu"}>

        <MenuItem
          className="nav-option"
         
          text="Year"
        />
        <MenuItem
          className="nav-option"
          
          text="Month"
        />
        <MenuItem
          className="nav-option"
          
          text="Day"
        />
        <Button 
            
            className="pt-minimal right" 
            text="Submit"
            
            disabled={true}
            
            onClick={() => {
              this.serchDirection = SEARCH_DIR.FORWARD;
              this.props.onPageCallback(totalPages-1)
            }}/>
         
      </Menu>
    );
  }
   
  
  render() {
    
    // pageNumber is zero indexed
    let { minDate, calFilter=false, startDate, endDate, entityName, pageNumber, listSize, pageSize, totalPages, totalElements, onPageCallback, isLoading, isLatest=false } = this.props;
    //console.log(startDate+" "+endDate);
    let isFirstPage = (pageNumber + 1 == 1);
    let isLastPage = (pageNumber + 1 == totalPages );
    let val = pageNumber + 1;

    

    //console.log(calFilter);

    if (isLoading != this.loading) 
    {
      if (isLoading == true) {
        this.loading = true;
      } 
      if (isLoading == false) {
        this.loading = false;
        this.serchDirection = SEARCH_DIR.NONE;
      } 
    }

    //console.log(entityName);
    
    return (
      <div className="NCPagination">
        <div className="row-count">
          <span className="pt-text-muted hide">
            {
              MSG.pag_str_1 + " " + entityName + " " +
              ((pageNumber * pageSize) + 1) + " - " + ((pageNumber * pageSize) + listSize) + 
              " " + MSG.pag_str_2 + " " + totalElements + (isLatest ? ((entityName!=="Contracts")&&(entityName!=="Tokens"))? " " + MSG.pag_str_3  : " " +  MSG.pag_str_4 :  MSG.pag_str_5)
            }
          {/*con*/}
          </span>
        </div>
      {
        (totalPages > 0) &&
        <div className="table-paging">
          {
            (calFilter!==false) &&
            <Popover
                
                content={this.renderCalendarRange(minDate)}
                interactionKind={PopoverInteractionKind.CLICK}
                position={Position.RIGHT}>
                <Button 

                  className="text navbar-btn-active pt-button pt-minimal"
                  
                  iconName="pt-icon-calendar"            
                  className="pt-minimal" 
            
                  loading={(this.serchDirection == SEARCH_DIR.FORWARD && this.loading) ? true : false}

                 />
            </Popover>
          }
          <Button 
            
            className="pt-minimal left hide" 
            text={MSG.pag_str_6}
            
            disabled={isFirstPage || this.loading}
            loading={(this.serchDirection == SEARCH_DIR.BACKWARD && this.loading) ? true : false}
            
            onClick={() => {
              this.serchDirection = SEARCH_DIR.BACKWARD;
              this.props.onPageCallback(0,pageSize,startDate,endDate);
            }}/>
            <Button 
            iconName="pt-icon-chevron-left" 
            className="pt-minimal left" 
            text={MSG.pag_str_7}
            
            disabled={isFirstPage || this.loading}
            loading={(this.serchDirection == SEARCH_DIR.BACKWARD && this.loading) ? true : false}
            
            onClick={() => {
              this.serchDirection = SEARCH_DIR.BACKWARD;
              this.props.onPageCallback(pageNumber - 1,pageSize,startDate,endDate);
            }}/>
          
          <span className="pt-text-muted context">
            { MSG.pag_str_8 + " " }
          </span>
             <InputGroup 
              type="number"
              onKeyPress={(e) => { if(e.key === 'Enter'){

                this.serchDirection = SEARCH_DIR.FORWARD;

                                  if((parseInt(e.target.value)-1)<totalPages){
                                    this.props.onPageCallback(parseInt(e.target.value)-1,pageSize,startDate,endDate);
                                    e.target.placeholder = e.target.value;
                                    e.target.min = e.target.placeholder
                                    e.target.value = null;
                                  }

              }}}
              onChange={(e) => {
                    e.target.min = 1;
                  }
              } 

               className="paging-input pt-wide-input"
               min = {Math.max(1,parseInt(pageNumber+1))}
               placeholder = {parseInt(pageNumber+1)}
               />
          <span className="pt-text-muted context hide">    
            { " of " + totalPages}
          </span>
          <Button 
            rightIconName="pt-icon-chevron-right" 
            className="pt-minimal right" 
            text={MSG.pag_str_9}
            
            disabled={isLastPage || this.loading}
            loading={(this.serchDirection == SEARCH_DIR.FORWARD && this.loading) ? true : false}

            onClick={() => {
              this.serchDirection = SEARCH_DIR.FORWARD;
              //console.log(pageNumber);
              this.props.onPageCallback(pageNumber + 1,pageSize,startDate,endDate)
            }}/>
            <Button 
            
            className="pt-minimal right hide" 
            text={MSG.pag_str_10}
            
            disabled={isLastPage || this.loading}
            loading={(this.serchDirection == SEARCH_DIR.FORWARD && this.loading) ? true : false}

            onClick={() => {
              this.serchDirection = SEARCH_DIR.FORWARD;
              this.props.onPageCallback(totalPages-1,pageSize,startDate,endDate)
            }}/>
            
            
        </div>
      }
      </div>
    );
  }
}






















































