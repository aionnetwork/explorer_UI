/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import moment from 'moment';
import { Button, Position, Classes, Popover, Menu, MenuItem, InputGroup, Intent, PopoverInteractionKind } from "@blueprintjs/core";

const SEARCH_DIR = {
  NONE: 0,
  FORWARD: 1,
  BACKWARD: 2,
}

export default class NCPaginationFoot extends Component
{
  constructor(props) {
    super(props);

    this.loading = false;
    this.serchDirection = SEARCH_DIR.NONE;
  }
  
  render() {
    
    // pageNumber is zero indexed
    let { entityName, pageNumber, listSize, pageSize, totalPages, totalElements, onPageCallback, isLoading, isLatest=false } = this.props;

    let isFirstPage = (pageNumber + 1 == 1);
    let isLastPage = (pageNumber + 1 == totalPages );
    let val = pageNumber + 1;

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
    
    return (
      <div className="NCPagination">
        {(totalPages > 1) && (totalElements > 25) &&
          <div className="row-count">
          <span className="pt-text-muted">
            Page size  :
             <select id="topic-input" 
                     onChange= {(e) => {
                        this.serchDirection = SEARCH_DIR.FORWARD;

                         if((parseInt(e.target.value))<500){

                            this.props.onPageCallback(pageNumber,e.target.value);

                          }

                
                }} 
                     defaultValue="default"   className="pt-input">
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="75">75</option>
                <option value="100">100</option>
                <option value="250">250</option>              
               
              </select>
          </span>
        </div>
      }
      {
        (totalPages > 1) &&
        <div className="table-paging">
          <Button 
            
            className="pt-minimal left" 
            text="First"
            
            disabled={isFirstPage || this.loading}
            loading={(this.serchDirection == SEARCH_DIR.BACKWARD && this.loading) ? true : false}
            
            onClick={() => {
              this.serchDirection = SEARCH_DIR.BACKWARD;
              this.props.onPageCallback(0);
            }}/>
            <Button 
            iconName="pt-icon-chevron-left" 
            className="pt-minimal left" 
            text="Prev"
            
            disabled={isFirstPage || this.loading}
            loading={(this.serchDirection == SEARCH_DIR.BACKWARD && this.loading) ? true : false}
            
            onClick={() => {
              this.serchDirection = SEARCH_DIR.BACKWARD;
              this.props.onPageCallback(pageNumber - 1);
            }}/>
          
          <span className="pt-text-muted context">
            { "Page " }
          </span>
             <InputGroup 
              type="number" 
              onChange={(e) => {
                this.serchDirection = SEARCH_DIR.FORWARD;

                if((parseInt(e.target.value)-1)<totalPages){

                  this.props.onPageCallback(parseInt(e.target.value)-1);

                }

                
                }} 

               className="paging-input"
              value = {parseInt(pageNumber+1)}
               />
          <span className="pt-text-muted context">    
            { " of " + totalPages}
          </span>
          <Button 
            rightIconName="pt-icon-chevron-right" 
            className="pt-minimal right" 
            text="Next"
            
            disabled={isLastPage || this.loading}
            loading={(this.serchDirection == SEARCH_DIR.FORWARD && this.loading) ? true : false}

            onClick={() => {
              this.serchDirection = SEARCH_DIR.FORWARD;
              this.props.onPageCallback(pageNumber + 1)
            }}/>
            <Button 
            
            className="pt-minimal right" 
            text="Last"
            
            disabled={isLastPage || this.loading}
            loading={(this.serchDirection == SEARCH_DIR.FORWARD && this.loading) ? true : false}

            onClick={() => {
              this.serchDirection = SEARCH_DIR.FORWARD;
              this.props.onPageCallback(totalPages-1)
            }}/>
        </div>
      }
      </div>
    );
  }
}





















































