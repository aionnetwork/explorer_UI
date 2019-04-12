/* eslint-disable */
import React, { Component } from 'react';
import { hashHistory } from 'react-router';

import { InputGroup, Button, Intent, Popover, Menu, MenuItem, Position } from "@blueprintjs/core";

import { NCEntity, NCEntityServerMapping, NCEntityInfo } from 'lib/NCEnums';
import { nc_FindEntity, nc_CanLinkToEntity, nc_LinkToEntity, nc_isObjectEmpty, nc_isStrEmpty, nc_trim } from 'lib/NCUtility';
import * as network from 'network/NCNetworkRequests';
import {strings as MSG} from 'lib/NCTerms';


export default class NCTopLevelSearch extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
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
      this.search(queryStr);

    }else if(!nc_isStrEmpty(this.state.queryStr)){


      this.setState({
        queryStr: ''
      }, () => {

        nc_LinkToEntity(entity, queryStr);

      });
    }
  }

  setQueryStr = (str) => {
    this.setState({
      queryStr: str
    });
  }
  search = (str) => {
    console.log('searching...');
    network.getRetrieveTopLevel(str);
  }

  render() {
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
      </div>
    );
  }
}
