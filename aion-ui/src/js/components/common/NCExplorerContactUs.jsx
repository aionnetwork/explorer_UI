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
      
    const contact_container ={border:'#ccc solid 1px',padding:'10px',borderRadius:'5px',maxWidth:'500px'}
    const contact_input ={width:"100%"}
    const contact_textArea ={width:"100%",height:"200px"}
    const contact_submit ={right:'10'}
    const page =
      <div> 
        <NCExplorerHead
          
          breadcrumbs={breadcrumbs}
          title={"Contact Us"}
          subtitle={'Your opinion is valued'}
   

        />  

        <div style={contact_container}>

            <FormGroup
                
                label="Topic"
                labelFor="text-input"
                labelInfo="(required)"
                className="pt-form-group "

            >
              <select defaultValue="default"  style={contact_input} className="pt-input pt-large">
                <option value="default">Choose an item...</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
                <option value="4">Four</option>
              </select>
            </FormGroup>
             <FormGroup
               
                label="Type"
                labelFor="text-input"
                labelInfo="(required)"
            >
              <select defaultValue="default"  style={contact_input} className="pt-input pt-large" >
                <option value="default">Choose an item...</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
                <option value="4">Four</option>
              </select>
            </FormGroup>
            <FormGroup
                
                label="Message"
                labelFor="text-input"
                labelInfo="(required)"
            >
              <TextArea
                large={true}
                intent={"#000"}
                className="pt-input pt-large"
                rows="6"
                style={contact_textArea}
                
              />
            </FormGroup>

            <Button intent="success" onClick={()=>{console.log('submit')}} text="Submit" />
            
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