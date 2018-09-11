/* eslint-disable */
import React, { Component } from 'react';
import { hashHistory } from 'react-router';

import { InputGroup, Button, Intent, Popover, Menu, MenuItem, Position } from "@blueprintjs/core";

import { NCEntity, NCEntityServerMapping, NCEntityInfo } from 'lib/NCEnums';
import { nc_FindEntity, nc_CanLinkToEntity, nc_LinkToEntity, nc_isObjectEmpty, nc_isStrEmpty, nc_trim } from 'lib/NCUtility';
import * as network from 'network/NCNetworkRequests';

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
    if (!nc_isStrEmpty(this.state.queryStr))
    {
      //toDo:before trim identify the required entity from the queryStr
      //nc_findEntity(this.state.queryStr);

      let queryStr = nc_trim(this.state.queryStr);
      let entity = this.state.entity;

      this.setState({
        queryStr: ''
      }, () => {
        console.log("query for entity: " + NCEntityInfo[entity].name + " for query string: " + queryStr);
        nc_LinkToEntity(entity, queryStr);
        //nc_FindEntity(queryStr);
      });
    }
  }

  setQueryStr = (str) => {
    this.setState({
      queryStr: str
    });
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
                    </Menu>
                }

                position={Position.BOTTOM_RIGHT}>
                <Button className={"pt-minimal pt-min-toplvl"} rightIconName={"caret-down"}>
                    {NCEntityInfo[this.state.entity].name}
                </Button>
            </Popover>
        );

    return (
      <div className="NCTopLevelSearch">
        <InputGroup
          className="search-bar"
          disabled={this.state.isFetching}
          placeholder="Search for Account / Block / Transaction / Token"
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
