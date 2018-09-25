/* eslint-disable */
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';

import { NCEntity, NCEntityInfo } from 'lib/NCEnums';
import { nc_trim, nc_GetEntityIcon, nc_LinkToEntity } from 'lib/NCUtility';

export function parseClientTransaction(_entityId, _entitySCName, _entityUserName)
{
  let entityId = _entityId;
  let entityType = null;
  let entityName = null;

  if (_entitySCName != null && _entityUserName == null)
  {
    entityType = NCEntity.SC;
    entityName = _entitySCName;
  }
  else if (_entitySCName == null && _entityUserName != null)
  {
    entityType = NCEntity.USER;
    entityName = _entityUserName;
  }
  else
  {
    entityType = NCEntity.ACCOUNT;
  }

  return ({
    entityType: entityType,
    entityId: entityId,
    entityName: entityName,
  });
}

export default class NCEntityLabel extends Component
{
  constructor(props) 
  {
    super(props);

    // entity type does not change over lifecyle in this app
    this.iconName = nc_GetEntityIcon(this.props.entityType);

    // bind the functions
    this.linkToEntity = this.linkToEntity.bind(this);
  }

  linkToEntity(e, linkActive) 
  {
    e.preventDefault();

    if (!linkActive)
      return;    
    console.log(JSON.stringify(this.props));

    nc_LinkToEntity(this.props.entityType, this.props.entityId);
  }

  render() {

    let { entityType, entityName, entityId, linkActive=true, className } = this.props;

    let displayName = "Undefined";

    if (entityName != null && entityName != "") 
    {
      displayName = entityName;
    }
    else if (entityId != null && nc_trim(entityId) != "")
    {
      displayName = entityId;

      // append a hex to the entityId where applicable. 
      if (
        entityType == NCEntity.USER || 
        entityType == NCEntity.SC || 
        entityType == NCEntity.TXN || 
        entityType == NCEntity.NODE || 
        entityType == NCEntity.ACCOUNT)
      {
        displayName = "0x"+displayName;
      }
    }

    return( 
        <span 
          className={"NCEntityLabel " + (className != null ? className : "") + (linkActive ? " active" : "")}
          onClick={ (e) => this.linkToEntity(e, linkActive)}>
          <span className={"icon pt-icon-standard " + this.iconName}/>
          <span className="text pt-text-overflow-ellipsis ">{ displayName }</span>
        </span>
    );
  }
}

























