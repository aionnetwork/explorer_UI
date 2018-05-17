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

export default class NCPagination extends Component
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
    let isLastPage = (pageNumber + 1 == totalPages )

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
        <div className="row-count">
          <span className="pt-text-muted">
            {
              "Showing " + entityName + " " + 
              ((pageNumber * pageSize) + 1) + " - " + ((pageNumber * pageSize) + listSize) + 
              " of " + totalElements + (isLatest ? " latest" : " found")
            }
          </span>
        </div>
      {
        (totalPages > 1) &&
        <div className="table-paging">
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
            { "Page " + (pageNumber + 1) + " of " + totalPages }
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
        </div>
      }
      </div>
    );
  }
}






















































