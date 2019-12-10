/* eslint-disable */

import classNames from "classnames";
import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import NCTableReactPaginated from 'components/common/NCTableReactPaginated';
import NCDialog from 'components/common/NCDialog';

import moment from 'moment';
import { Tooltip, AnchorButton, Dialog,Button,Overlay, Position, Classes, Popover, Menu, MenuItem, InputGroup, Intent, PopoverInteractionKind } from "@blueprintjs/core";
import { Table, Column, Cell, ColumnHeaderCell, SelectionModes, TruncatedFormat } from "@blueprintjs/table";

import NCTableBase from 'components/common/NCTableBase';
import { NCSortType, NCEntity, nc_LinkToEntity,NCEntityInfo } from 'lib/NCEnums';

import NCPagination from 'components/common/NCPagination';
import NCEntityLabel, {parseClientTransaction} from 'components/common/NCEntityLabel';
import NCTokenLabel from 'components/common/NCTokenLabel';
import { PAGE_SIZE } from 'network/NCNetworkRequests';

import { nc_numFormatterAionCoin, nc_isStrEmpty } from 'lib/NCUtility';

import appConfig from '../../../config.json';

import ReactGA from 'react-ga';
import * as MSG from 'lib/NCTerms';//MSG.strings.Cntr_detail_tab2_col1

ReactGA.initialize(appConfig.ga_key);

 const row = {
    height:"100px",
  };

export default class NCLogTable extends Component
{
  constructor(props) {
    super(props);

    ReactGA.event({
      category: 'Contract',
      action: 'Events tab'
    });

    this.state = {
      isOpen: false,
      content: ''
    };

    this.isOpen = false;
    this.content = "";

    this.columnDescriptor =
    [
      {
        name: MSG.strings.Cntr_detail_tab3_col1,
        isSortable: false,
        isFilterable: false,
        width: 100,

        flex: false,

      },
      {
        name: MSG.strings.Cntr_detail_tab3_col2,
        isSortable: false,
        isFilterable: false,
        flex: true,
      },

      {
        name: MSG.strings.Cntr_detail_tab3_col3,
        isSortable: false,
        isFilterable: false,
        width: 200,
        flex: false,

      },
      {
        name: MSG.strings.Cntr_detail_tab3_col4, // arrow
        isSortable: false,
        isFilterable: false,
        flex: true,
      },


    ];

    this.ncRowHeight = [];

    this.generateTableContent = this.generateTableContent.bind(this);
  }




 handleOpen = (text,title) => {

    this.setState({ isOpen: true, eContent:text, eTitle:title});

  };


 handleClose = () => this.setState({ isOpen: false });

   parseParamData = (txnLog) => {
    let result = "";


    try {
      let a = txnLog;//.slice(1,-1);

      let inputstr = a.split('[').join('["').split("]").join('"]');//.replace(/\\"/g, '"');

      result = inputstr.split(",").join('","').split(',"[').join(',[').split(']"').join(']').split(']"]').join(']]');

    } catch (e) {
      console.log(e);
      return false;
    }
    return result;
  };

  generateTableContent(entityList)
  {

    let tableContent = [];

    console.log(entityList);

    entityList.forEach((entity, i) =>
    {
      let transactionHash = entity.transactionHash;
      let blockNumber = entity.blockNumber;
      let timestamp = entity.blockTimestamp;
      let index = entity.logIndex;

      // Generate tableContent
      tableContent[i] = [];
      tableContent[i][0] =
      <Cell copy={blockNumber} link={'#'+NCEntityInfo[NCEntity.BLOCK].absoluteUrl+''+blockNumber}>

       <NCEntityLabel
          entityType={NCEntity.BLOCK}
          entityName={blockNumber}
          entityId={blockNumber}/>

       </Cell>
      ;
      tableContent[i][1] =
      <Cell copy={transactionHash} link={'#'+NCEntityInfo[NCEntity.TXN].absoluteUrl+''+transactionHash}>

       <NCEntityLabel
          entityType={NCEntity.TXN}
          entityName={transactionHash}
          entityId={transactionHash}/>

       </Cell>
      ;

      tableContent[i][2] = <Cell copy={index} interactive={true} ><b>{index }
      </b>

      <Button className="pt-button pt-minimal liveness-btn pull-right" onClick={
        ()=>{
          this.handleOpen(JSON.stringify(entity, undefined, 2),'Logs');
        }
      }
      >
        View details
      </Button>

      </Cell>;

      tableContent[i][3] =

      <Cell copy={ moment.unix(timestamp).format('MMM D YYYY, hh:mm:ss a') }>{moment.unix(timestamp).format('MMM D YYYY, hh:mm:ss a')}</Cell>;


    });

    return tableContent;
  }

  render() {
    const OVERLAY_EXAMPLE_CLASS = "docs-overlay-example-transition";
    const { data, isPaginated, isLoading, onPageCallback, isLatest=false } = this.props;





    return (
      <div>
      <NCTableReactPaginated

        data={data}
        onPageCallback={onPageCallback}
        isLoading={isLoading}
        isPaginated={isPaginated}
        entityName={"Events"}
        generateTableContent={this.generateTableContent}
        columnDescriptor={this.columnDescriptor}
        isLatest={isLatest}

        />
          <Dialog

                    icon="info-sign"
                    onClose={this.handleClose}
                    title={this.state.eTitle+" event"}
                    isOpen={this.state.isOpen}

                >
                    <div className={Classes.DIALOG_BODY}>

                        <pre className={"nc-resizable"}>{this.state.eContent}</pre>

                    </div>
                    <div className={Classes.DIALOG_FOOTER}>
                        <div className={Classes.DIALOG_FOOTER_ACTIONS}>

                        </div>
                    </div>
          </Dialog>
        </div>

    );
  }
}






























