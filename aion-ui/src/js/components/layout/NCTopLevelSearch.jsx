/* eslint-disable */
import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';

import { Dialog, Classes, InputGroup, Button, Intent, Popover, Menu, MenuItem, Position } from "@blueprintjs/core";
import NCLink from 'components/common/NCLink';
import { NCEntity, NCEntityServerMapping, NCEntityInfo } from 'lib/NCEnums';
import { nc_FindEntity, nc_CanLinkToEntity, nc_LinkToEntity, nc_isObjectEmpty, nc_isStrEmpty, nc_trim } from 'lib/NCUtility';
import * as network from 'network/NCNetworkRequests';
import {strings as MSG} from 'lib/NCTerms';


export class NCTopLevelSearch extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      isOpen: false,
      queryStr: '',
      entity: NCEntity.SEARCH
    }

  }

  submitQuery = () => {
    let queryStr = nc_trim(this.state.queryStr);
    let entity = this.state.entity;

    if (!nc_isStrEmpty(this.state.queryStr) && this.state.entity==5)
    {
      //global search
      this.setState({
              queryStr: ''

            });
      this.search(queryStr);

    }else if(!nc_isStrEmpty(this.state.queryStr)){


      this.setState({
        queryStr: '',
        content: ''
      }, () => {

        nc_LinkToEntity(entity, queryStr);

      });
    }
  }
  handleOpen = () => {
      this.setState({ isOpen: true});
  };

  handleClose = () => this.setState({ isOpen: false });

  setQueryStr = (str) => {
    this.setState({
      queryStr: str
    });
  }
  search = (str) => {
    network.globalSearch(str);
  }

  componentWillUpdate(nextProps, nextState){

      //check if list is present and display
      //console.log(JSON.stringify(nextProps.result));
      if(!this.state.isOpen && nextProps.result.response!=null && nextProps.result.response != this.props.result.response ){
            //console.log(JSON.stringify(nextProps.result.response));
            this.handleOpen();
            //console.log("open!!")
      }else if(!this.state.isOpen && nextProps.result.response != this.props.result.response ){
            this.handleOpen();
            console.log("open!!");
      }

  }

  render() {

    const searchResult = this.props.result.response;
    const searchResultCount = this.props.result.response != null? this.props.result.response.length : 0;
    //console.log(JSON.stringify(searchResult));
    const searchDisplay = (
        <div className={Classes.DIALOG_BODY}>
              {(searchResult==null)?
                ""
                :
                (searchResult.length < 1) ?   "No results found!"
                      :
                       searchResult.map((item,i)=>{
                        return (<div key={i}>{item.type +": "}
                                       <span
                                         className={"NCLink enabled"}
                                         onClick={(e) => {
                                            this.handleClose();
                                            hashHistory.push("/"+item.type+"/"+item.key);
                                           }}>
                                         <span className="text">{ item.key }</span>
                                       </span>
                            </div>)
                })}
        </div>
   )
    const permissionsMenu = (
            <Popover
                content={
                    <Menu>
                        <MenuItem
                          text={ NCEntityInfo[NCEntity.SEARCH].name }
                          onClick={() => {
                            this.setState({
                              entity: NCEntity.SEARCH
                            });
                          }}/>
                        <MenuItem
                          text={ NCEntityInfo[NCEntity.BLOCK].name }
                          onClick={() => {
                            this.setState({
                              entity: NCEntity.BLOCK
                            });
                          }}/>
                        <MenuItem
                          text={ NCEntityInfo[NCEntity.TXN].name }
                          onClick={() => {
                            this.setState({
                              entity: NCEntity.TXN
                            });
                          }}/>
                        <MenuItem
                          text={ NCEntityInfo[NCEntity.ACCOUNT].name }
                          onClick={() => {
                            this.setState({
                              entity: NCEntity.ACCOUNT
                            });
                          }}/>
                        <MenuItem
                          text={ NCEntityInfo[NCEntity.TKN].name }
                          onClick={() => {
                            this.setState({
                              entity: NCEntity.TKN
                            });
                          }}/>
                          <MenuItem
                          text={ NCEntityInfo[NCEntity.CNTR].name }
                          onClick={() => {
                            this.setState({
                              entity: NCEntity.CNTR
                            });
                          }}/>
                    </Menu>
                }

                position={Position.BOTTOM_RIGHT}>
                <Button className={"pt-minimal pt-min-toplvl"} rightIconName={"caret-down"}>
                    {MSG.Search_filter + " " + NCEntityInfo[this.state.entity].name}
                </Button>
            </Popover>
        );

    return (
      <div className={"NCTopLevelSearch "+this.props.className}>
        <InputGroup
          name="search"
          className="search-bar"
          disabled={this.state.isFetching}
          placeholder={MSG.Search_placeholder}
          value={this.state.queryStr}
          onChange={(e) => this.setQueryStr(e.target.value)}
          onKeyPress={(e) => { if(e.key === 'Enter'){ this.submitQuery() }}}
          leftIconName="search"
          rightElement={permissionsMenu}/>
          <Button
              className="pt-button pt-minimal pt-intent-primary pt-icon-arrow-right main-search-btn"
              intent={Intent.PRIMARY}
              leftIconName="filter"
              onClick={this.submitQuery}
              loading={this.state.isFetching}/>
           {(this.props.dialog)&&
           <Dialog
            icon="info-sign"
            onClose={this.handleClose}
            title={searchResultCount + " results found for: " + this.props.result.queryStr}
            isOpen={this.state.isOpen}
           >
                              {searchDisplay}

           </Dialog>
           }
      </div>
    );
  }
}
export default connect((state) => {
  return ({
    result: state.searchRetrieve,
  })
})(NCTopLevelSearch);