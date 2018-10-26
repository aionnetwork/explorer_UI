/* eslint-disable */
import React, { Component } from 'react';
import NCComponentLazyLoad from 'components/common/NCComponentLazyLoad';
import NCExplorerSection from 'components/common/NCExplorerSection';
import NCExplorerHead from 'components/common/NCExplorerHead';

import { TextArea, FormGroup, Button, Position, Classes, Popover, Menu, MenuItem, InputGroup, Intent, PopoverInteractionKind } from "@blueprintjs/core";


export default class NCExplorerContactUs extends Component
{
  render() {
    const { isLoading, isDataValid, isDataEmpty, loadingStr, invalidDataStr, emptyDataStr } = this.props;

    const breadcrumbs = [
      {
        link: '/',
        body: 'Home',
      },
      {
        link: '#',
        body: 'Contact Us',
      }

    ];
      
    const page =
      <div> 
        <NCExplorerHead
          
          breadcrumbs={breadcrumbs}
          title={"Contact Us"}
          subtitle={'Your opinion is valued'}
   

        />  

        <div>

            <FormGroup
                helperText="Helper text with details..."
                label="Topic"
                labelFor="text-input"
                labelInfo="(required)"
            >
              <select defaultValue="default">
                <option value="default">Choose an item...</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
                <option value="4">Four</option>
              </select>
            </FormGroup>
             <FormGroup
                helperText="Helper text with details..."
                label="Type"
                labelFor="text-input"
                labelInfo="(required)"
            >
              <select defaultValue="default">
                <option value="default">Choose an item...</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
                <option value="4">Four</option>
              </select>
            </FormGroup>
            <FormGroup
                helperText="Helper text with details..."
                label="Message"
                labelFor="text-input"
                labelInfo="(required)"
            >
              <TextArea
                large={true}
                intent={"#000"}
                
              />
            </FormGroup>

            <Button intent="success" text="Submit" />
            
        </div>
        
      </div>;

    return(
      <NCComponentLazyLoad>
        <NCExplorerSection
          className="NCExplorerPage"

          isLoading={isLoading}
          isDataValid={isDataValid} 
          isDataEmpty={isDataEmpty}
          
          loadingStr={loadingStr}
          invalidDataStr={invalidDataStr}
          emptyDataStr={emptyDataStr}
          isToplevelSection={true}
        
          content={page}/>
      </NCComponentLazyLoad>
    );
  }
}