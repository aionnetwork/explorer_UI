/* eslint-disable */
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';

import moment from 'moment';
import { Tooltip, AnchorButton, Dialog,Button,Overlay, Position, Classes, Popover, Menu, MenuItem, InputGroup, Intent, PopoverInteractionKind } from "@blueprintjs/core";
import { Table, Column, Cell, ColumnHeaderCell, SelectionModes, TruncatedFormat } from "@blueprintjs/table"

import { NCEntity, NCEntityInfo } from 'lib/NCEnums';
import { nc_trim, nc_GetEntityIcon, nc_LinkToEntity } from 'lib/NCUtility';



export default class NCDialog extends Component
{

   handleOpen = (input, param) => this.setState({ isOpen: true });

   handleClose = () => this.setState({ isOpen: false });


   render() {

    let { param=[], input=[],title="View", className="", enabled=true } = this.props;

    let isOpen = false

    const style ={width:'100%', padding:'15px', flex: 1, flexWrap: 'wrap'}
    const NCdialogcontainer = {width:'100%',padding:'5px', wordWrap: 'break-word'}

    const inputList = input;//this.format(input);
    const paramList = param;//this.format(param);

    return( 
        <span 
          className={"NCLink enabled"}         
          onClick={this.handleOpen}>
          <Dialog
                    

                   
                    icon="info-sign"
                    onClose={this.handleClose}
                    title="Event logs"
                    autoFocus= {true}
                    canEscapeKeyClose= {true}
                    canOutsideClickClose= {true}
                    enforceFocus= {true}
                    hasBackdrop= {true}
                    usePortal= {true}
                    {...this.state}
                    
                >
                <div style={NCdialogcontainer} >

                      <h5>Logs</h5>

                      {param.map(function(name, index){
                          return <p style={style} key={ index }><strong >{name}</strong>: <br/><span>{input[index]}</span></p>;
                       })}

                      <h5>Inputs</h5>
                      {inputList.map(function(name, index){
                          return <p  key={ index }><span>{name}</span></p>;
                       })}
                   
                   
                      
                  </div>
                   
          </Dialog>

          <span className="text pt-text-overflow-ellipsis">{title}</span>
        </span>
    );
  }
}

























