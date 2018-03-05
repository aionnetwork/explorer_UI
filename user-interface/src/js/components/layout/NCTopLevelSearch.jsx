/* eslint-disable */
import React, { Component } from 'react';
import { hashHistory } from 'react-router';

import { InputGroup, Button, Intent } from "@blueprintjs/core";

import { NCEntity, NCEntityServerMapping } from 'lib/NCEnums';
import { nc_CanLinkToEntity, nc_LinkToEntity, nc_isObjectEmpty, nc_isStrEmpty, nc_trim } from 'lib/NCUtility';
import * as network from 'network/NCNetworkRequests';

export default class NCTopLevelSearch extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      queryStr: ''
    }
  }

  submitQuery = () => {
    if (!nc_isStrEmpty(this.state.queryStr)) {
      this.setState({
        isFetching: true
      }, () => {
        console.log(nc_trim(this.state.queryStr))
        network.getSearch(this.redirectToResult, nc_trim(this.state.queryStr));
      });
    }
  }
  
  setQueryStr = (str) => {
    this.setState({
      queryStr: str
    });
  }

  redirectToResult = (response) => {
    console.log(response);
    const entityType = (response && response.entityType) ? NCEntityServerMapping[response.entityType] : null;
    const isResponseValid = this.isResponseValid(response, entityType)
    const queryStr = nc_trim(this.state.queryStr);

    this.setState({
      isFetching: false,
      queryStr: ''
    }, () => {
      if (!isResponseValid) {
        let redirect = '/no-results';
        if (queryStr)
          redirect += '/' + queryStr;

        hashHistory.push(redirect);
      } 
      else {
        let entityId = null;
        let entity = response.content[0];

        switch(entityType) {
          case (NCEntity.BLOCK): {
            entityId = entity.blockHash;
            break;
          }
          case (NCEntity.TXN): {
            entityId = entity.transactionHash;
            break;
          }
          case (NCEntity.ACCOUNT): {
            entityId = entity.addr;
            break;
          }
        }
        nc_LinkToEntity(entityType, entityId)
      }
    });
  }

  isResponseValid = (response) => {
    return (
      response &&
      NCEntityServerMapping[response.entityType] && 
      !nc_isObjectEmpty(response)
    );
  }

  render() {
    return (
      <InputGroup
        className="NCTopLevelSearch"
        disabled={this.state.isFetching}
        placeholder="Search for Account / Block / Transaction"
        value={this.state.queryStr}
        onChange={(e) => this.setQueryStr(e.target.value)}
        onKeyPress={(e) => { if(e.key === 'Enter'){ this.submitQuery() }}}
        rightElement={
          <Button 
            className="pt-button pt-minimal pt-intent-primary pt-icon-search main-search-btn"
            intent={Intent.PRIMARY}
            onClick={this.submitQuery}
            loading={this.state.isFetching}/>
        }/>
    );
  }
}

 














































