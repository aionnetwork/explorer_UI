/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageVisibility from 'react-page-visibility';

import { nc_getRandomInt } from 'lib/NCUtility';

import spring, { toString } from 'css-spring';
import FlipMove from 'react-flip-move';

import NCPageVisibility from 'components/common/NCPageVisibility';

import NCComponentLazyLoad from 'components/common/NCComponentLazyLoad';
import NCLoading from 'components/common/NCLoading';
import NCNonIdealState from 'components/common/NCNonIdealState';
import NCCardBlock from 'components/dashboard/NCCardBlock';

import { nc_LinkToEntity, NCEntity } from 'lib/NCEnums';
import NCEntityLabel from 'components/common/NCEntityLabel';

import moment from "moment";

const BLOCK_STREAM_ELEMENT_SIZE = 4;
const DEFAULT_TARGET_BLOCK_TIME = 10;

import { NCNETWORK_REQUESTS_ENABLED } from 'network/NCNetwork';

class NCRecentBlocks extends Component
{
  constructor(props) {

    super(props);

    this.clippedList = null;

    this.customEnterAnimation = {
      from: { transform: 'translate3d(0px, -145px, 0px)', opacity: 0 },
      to:   { transform: 'translate3d(0px, 0, 0px)', opacity: 1 }
    };

    this.customLeaveAnimation = {
      from: { transform: 'translate3d(0px, 0px, 0px)', opacity: 1 },
      to:   { transform: 'translate3d(0px, 145px, 0px)', opacity: 0 }
    };


    this.currentBlockNumber = -1;
    this.targetBlockTime = DEFAULT_TARGET_BLOCK_TIME; // in seconds

    this.currentBlockNumber = (this.props.blkRt.data != null &&
                               Array.isArray(this.props.blkRt.data) &&
                               this.props.blkRt.data.length > 0)
                              ? this.props.blkRt.data[0] : -1;

    this.state = {
      nextBlockTimeRemaining: DEFAULT_TARGET_BLOCK_TIME, // in seconds
      documentHidden: false
    }
  }

  componentDidMount()
  {
    // update the counter
    this.t_nextBlockTime = setInterval(() => {
      this.setState((prevState, props) => ({
        nextBlockTimeRemaining: prevState.nextBlockTimeRemaining - 1,
      }));
    }, 1000);

    // pull the latest block info from rtBlks store
    this.t_refreshBlockList = setInterval(() => {

      let rtBlockList = this.props.blkRt.data;

      if (rtBlockList == null || !Array.isArray(rtBlockList) || rtBlockList.length < 1 || rtBlockList[0] == null) return;

      let latestBlock = rtBlockList[0];
      let latestBlockNumber = latestBlock.blockNumber;

      if (latestBlockNumber == null) return;

      if (this.currentBlockNumber != latestBlockNumber)
      {
        // update the clipped list
        // update the block number
        // reset the counter -> cause a render call
        this.clippedList = rtBlockList.slice(0, BLOCK_STREAM_ELEMENT_SIZE);

        this.currentBlockNumber = latestBlockNumber;

        this.setState((prevState, props) => ({
          nextBlockTimeRemaining: this.targetBlockTime,
        }));
      }
    }, 250);
  }

  componentWillUnmount()
  {
    clearInterval(this.t_nextBlockTime);
    clearInterval(this.t_refreshBlockList);
  }

  handleVisibilityChange = (visibilityState, documentHidden) => {
    //console.log('visibilityState: ', visibilityState);
    //console.log('documentHidden: ', documentHidden);
    this.setState({ documentHidden: documentHidden });
  }

  render() {
    this.targetBlockTime = this.props.kpi.data.targetBlockTime != null ? this.props.kpi.data.targetBlockTime : DEFAULT_TARGET_BLOCK_TIME;
    const momentUpdated = this.props.blkRt.momentUpdated;
    //console.log(JSON.stringify(this.props))
    if (momentUpdated == null || this.clippedList == null) {
      return (
        <NCLoading title={"Loading Block Stream"} marginTop={100} marginBottom={0}/>
      );
    }

    if (this.clippedList.length < 1) {
      return (
        <NCNonIdealState
              paddingTop={120}
              icon={"pt-icon-offline"}
              title={"No Blocks Available"}
              description={"No blocks appear to have been mined."}/>
      );
    }

    const cards = this.clippedList.map((block, i) => (
      <NCCardBlock key={block.blockNumber} block={block}/>
    ));

    const nextTimeRemaining = this.state.nextBlockTimeRemaining;

    let nextBlockNumber = (this.clippedList[0] != null && this.clippedList[0].blockNumber != null) ?
                          this.clippedList[0].blockNumber + 1 : "Undefined";

    return (
      <PageVisibility onChange={this.handleVisibilityChange}>
        <div className="list-container NCRecentBlocks">
          <span className="block-bridge"/>
          <span className="block-bridged-dotted"/>
          <div className="NCCardBlock next-block-container">
            <img  className="block-parent" src={(this.props.darkMode.data) ? "img/block/dark-block-indigo.svg" : "img/block/block-indigo.svg"}/>
            <div className="block-card">
              <div className="block-number">
                <span className="subtitle pt-text-muted">Block #</span>
                <span className="title pt-text-muted">{ nextBlockNumber }</span>
              </div>
              <div className="block-pending">
                <span className="subtitle pt-text-muted">{
                  "To be proposed "+((nextTimeRemaining > 0) ? "in " : "")
                }</span>
                <span className="remaining">{
                  (nextTimeRemaining > 0) ?
                  (nextTimeRemaining + "s") :
                  ("momentarily ...")
                }</span>
              </div>
            </div>
          </div>
          <div className="cards-column">
            <FlipMove
              disableAllAnimations={this.state.documentHidden}
              duration={600}
              easing="ease-in-out"
              appearAnimation={this.customEnterAnimation}
              enterAnimation={this.customEnterAnimation}
              leaveAnimation={this.customLeaveAnimation}>
              {cards}
            </FlipMove>
          </div>
        </div>
      </PageVisibility>
    );
  }
}

export default connect((state) => {
  return ({
    blkRt: state.blkRt,
    kpi: state.kpi,
    darkMode: state.dark,
  })
})(NCRecentBlocks);
