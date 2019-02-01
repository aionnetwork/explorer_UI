/* eslint-disable */
import React, { Component } from 'react';
//import { Link, hashHistory } from 'react-router';

import moment from 'moment';
import { Dialog, Position} from "@blueprintjs/core";
//import { Table, Column, Cell, ColumnHeaderCell, SelectionModes, TruncatedFormat } from "@blueprintjs/table"


//import { nc_trim, nc_GetEntityIcon, nc_LinkToEntity } from 'lib/NCUtility';

import appConfig from '../../../config.json';

import ReactGA from 'react-ga';
ReactGA.initialize(appConfig.ga_key);



export default class NCDialog extends Component
{

   handleOpen = (input, param) => this.setState({ isOpen: true });

   handleClose = () => {

    this.setState({ isOpen: false })

    ReactGA.event({
      category: 'Contract',
      action: 'Events log Viewed',
      label: this.props.contract
    });

  };


   render() {

    let { param=[], input=[],title="View", className="", enabled=true } = this.props;

    //let isOpen = false;

    const style ={width:'90%', padding:'5px', flex: 1, flexWrap: 'wrap',marginLeft:'15px'}
    const NCdialogcontainer = {width:'100%',padding:'5px', wordWrap: 'break-word'}
    const panel ={background:'#eee',padding:'10px',margin:'15px'}
    //const inputPanel ={background:'#fff',padding:'10px',margin:'15px'}

    const inputList = input;//this.format(input);
    //const paramList = param;//this.format(param);

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
                          return <div key={ index }><p style={style} ><strong >{name}</strong>: <br/> {input[index]}</p></div>;
                       })}

                      <h5>Inputs</h5>
                      <div style={panel}>
                      {inputList.map(function(name, index){
                          return <p  key={ index }><span>{name}</span></p>;
                       })}
                      </div>
                   
                      
                  </div>
                   
          </Dialog>

          <span className="text pt-text-overflow-ellipsis">{title}</span>
        </span>
    );
  }
}

























