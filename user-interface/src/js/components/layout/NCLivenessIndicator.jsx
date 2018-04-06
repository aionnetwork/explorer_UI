/* eslint-disable */
import React, { Component } from 'react';

import moment from "moment";
import { Popover, PopoverInteractionKind, Position, Spinner, Intent } from "@blueprintjs/core";

import NCEntityLabel from 'components/common/NCEntityLabel';
import { NCEntity } from 'lib/NCEnums';
import NCTimescale from 'components/common/NCTimescale';

const LIVENESS_DELTA_SECONDS = 60 * 5; // 5 min

export default class NCLivenessIndicator extends Component
{
  render() {

    let { momentEnd, latestBlockNumber, dbLag, lastUpdated } = this.props;

    let isHostBlockchainDown = false;
    
    let dbLagStr = "";
    let dbLagInt = isNaN(dbLag) ? 0 : dbLag;

    let isDataAvailable = (momentEnd != null && latestBlockNumber != null && dbLag != null && moment(momentEnd).isValid());

    if (isDataAvailable)
    {
      let lastUpdateTemporalDistanceFromNow = moment.duration(moment().diff(lastUpdated));
      //let lastBlockTemporalDistanceFromNow = moment.duration(moment().diff(momentEnd));

      isHostBlockchainDown = (
        lastUpdateTemporalDistanceFromNow.asSeconds() > LIVENESS_DELTA_SECONDS 
        //&& lastBlockTemporalDistanceFromNow.asSeconds() > LIVENESS_DELTA_SECONDS
      );
      
      if (dbLagInt > 0) {
        dbLagStr = "Lagging " + dbLagInt + " blocks from blockchain head. "
      }
      else if (dbLagInt < 0) {
        dbLagStr = "Dashboard " + Math.abs(dbLagInt) + " blocks ahead of blockchain. "
      } 
      else if (isHostBlockchainDown) {
        dbLagStr = "Dashboard webserver non-responsive. "
      } 
    }

    const popoverContent = (
      <div className="content-container">
        {
          (!isDataAvailable) &&
          <div className="no-data">
            <span className="pt-icon-standard pt-icon-warning-sign"></span>
            <span className="text">Latest Database Update Time Unknown</span> 
          </div>
        }
        {
          (isDataAvailable) &&
          <div className="liveness-indicator">
            <span className="desc">{ dbLagStr + "Latest block" }</span>    
            <NCEntityLabel
              entityType={NCEntity.BLOCK}
              entityName={latestBlockNumber} 
              entityId={latestBlockNumber}/>
            <span className="desc">observed at</span>     
            <NCTimescale dateObjArr={[momentEnd]} isMedium={true}/>
          </div>
        }
      </div>
    );

    return (

      <Popover
        content={popoverContent}
        interactionKind={PopoverInteractionKind.HOVER}
        inline={false}
        popoverClassName="NCLivenessIndicator-Popover"
        className="NCLivenessIndicator"
        position={Position.BOTTOM_RIGHT}>
        <button className="pt-button pt-minimal liveness-btn">

        {
          (!isDataAvailable) && 
          <span>
            <span className="pt-icon-standard pt-icon-warning-sign icon"></span>
            <span className="text"></span>
          </span>
        }
        {
          (isDataAvailable && isHostBlockchainDown) && 
          <span>
            <span className="fa fa-exclamation-circle icon warning"></span>
            <span className="text"></span> 
          </span>
        }
        {
          (isDataAvailable && !isHostBlockchainDown && dbLagInt >= 5) && 
          <span>
            <Spinner className="pt-small icon" intent={Intent.PRIMARY}/>
            <span className="text"></span>
          </span>
        }
        {
          (isDataAvailable && !isHostBlockchainDown && dbLagInt < 5) && 
          <span>
            <span className="fa fa-check-circle icon live"></span>
            <span className="text"></span>
          </span>
        }
        </button>
      </Popover> 
    );
  }
}
