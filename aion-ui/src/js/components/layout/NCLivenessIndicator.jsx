/* eslint-disable */
import React, { Component } from 'react';

import moment from "moment";
import { Popover, PopoverInteractionKind, Position, Spinner, Intent } from "@blueprintjs/core";

import NCEntityLabel from 'components/common/NCEntityLabel';
import { NCEntity } from 'lib/NCEnums';
import NCTimescale from 'components/common/NCTimescale';
import {strings as MSG} from 'lib/NCTerms';

const LIVENESS_DELTA_SECONDS = 60 * 5; // 5 min
const LIVENESS_THRESHOLD_BLOCKS = 10; // ok to be +/- 10 blocks around chain head

export default class NCLivenessIndicator extends Component
{
  render() {

    let { momentEnd,currentBlockchainHead, latestBlockNumber, dbLag, lastUpdated, status } = this.props;
    let isHostBlockchainDown = false;
    
    let dbLagStr = "";
    let dbLagInt = isNaN(dbLag) ? 0 : dbLag;
    let isDataStatusGood = (status!=="OK")? false : true;

    let isDataAvailable = latestBlockNumber != null && dbLag != null && momentEnd != null && moment(momentEnd).isValid();

    if (isDataAvailable && isDataStatusGood)
    {
      let lastUpdateTemporalDistanceFromNow = moment.duration(moment().diff(lastUpdated));
      let lastBlockTemporalDistanceFromNow = moment.duration(moment().diff(momentEnd));

      isHostBlockchainDown = (
        lastUpdateTemporalDistanceFromNow.asSeconds() > LIVENESS_DELTA_SECONDS 
        && lastBlockTemporalDistanceFromNow.asSeconds() > LIVENESS_DELTA_SECONDS
      );
      
      if (isHostBlockchainDown) {
        dbLagStr = "Dashboard webserver non-responsive. "
      } 
      else if (dbLagInt >= LIVENESS_THRESHOLD_BLOCKS) {
        dbLagStr = "Lagging " + dbLagInt + " blocks from blockchain head. "
      }
      else if (dbLagInt < -1*LIVENESS_THRESHOLD_BLOCKS) {
        dbLagStr = "Dashboard " + Math.abs(dbLagInt) + " blocks ahead of blockchain. "
      } 
    }else{

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
            <span className="desc">{ dbLagStr + " " + MSG.Live_str_1}</span>
            <NCEntityLabel
              entityType={NCEntity.BLOCK}
              entityName={latestBlockNumber} 
              entityId={latestBlockNumber}/>
            <span className="desc">{MSG.Live_str_2}</span>
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
          (isDataAvailable && !isHostBlockchainDown && dbLagInt >= LIVENESS_THRESHOLD_BLOCKS) && 
          <span>
            <Spinner className="pt-small icon" intent={Intent.PRIMARY}/>
            <span className="text"></span>
          </span>
        }
        {
          (isDataAvailable && !isHostBlockchainDown && dbLagInt < LIVENESS_THRESHOLD_BLOCKS) && 
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
