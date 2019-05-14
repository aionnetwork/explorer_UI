/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';

import { NCEntity } from 'lib/NCEnums';
import NCEntityLabel, { parseClientTransaction } from 'components/common/NCEntityLabel';
import NCEntityDetail from 'components/common/NCEntityDetail';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import { nc_addDecimal,nc_decimalPrettify, nc_numFormatter, nc_numFormatterAmp } from 'lib/NCUtility';
import {BigNumber} from 'bignumber.js';
const EMPTY_STR = "Not Available";

import * as MSG from 'lib/NCTerms';

export default class NCTxnDetail extends Component
{
  constructor(props) {
    super(props);
    this.cpmessage = "";
  }

  parseTxnLog = (txnLog) => {
    if (txnLog == null) return false;
    try {
      let parsed = JSON.parse(txnLog);

      if (!parsed || parsed.length == 0)
        return false;

      return(JSON.stringify(parsed, undefined, 2))
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  parseInputData = (data) => {
    let result = "";
    try {
      // get the function header
      if (data.length > 0) {
        result += data.substring(0, 8) + '\n';
        data = data.substring(8);
      }

      while (data.length > 0) {
        result += data.substring(0, 32) + '\n';
        data = data.substring(32);
      }
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  copyNotice = () => {
    this.cpmessage = "copied";
    setTimeout(function(){ this.cpmessage = ""; }, 3000);
  }

  render() {
    let { entity } = this.props;

    let parsedTxnLog = this.parseTxnLog(entity.transactionLog);
    let parsedInputData = this.parseInputData(entity.data);
    
    let value = entity.tokenSymbol == null ? nc_decimalPrettify(entity.value) : nc_decimalPrettify(nc_addDecimal(entity.value));

    let unit = entity.tokenSymbol == null? "Aion" : entity.tokenSymbol;

    let desc = 
    [
      {
        field: MSG.strings.Txn_detail_row1,
        value: moment.unix(entity.blockTimestamp).format('LLLL'),
      },
      {
        field: entity.tokenSymbol == null? MSG.strings.Txn_detail_row2 : MSG.strings.Txn_detail_row2_alt1,
        value: 
                  entity.tokenSymbol == null? 
                  <NCEntityLabel
                  entityType={NCEntity.TKN}
                  entityId={"AION ("+ MSG.strings.Txn_detail_row2_desc +")"}
                  linkActive={false}/>
                  :
                  <NCEntityLabel
                  entityType={NCEntity.TKN}
                  entityId={entity.tokenName}
                  linkActive={false}/>
              
      },
      {
        field: MSG.strings.Txn_detail_row3,
        value: <NCEntityLabel
                  entityType={NCEntity.TXN}
                  entityId={entity.transactionHash}
                  linkActive={false}/>,
      },
      {
        field: MSG.strings.Txn_detail_row4,
        value: <NCEntityLabel
                  entityType={NCEntity.BLOCK}
                  entityId={entity.blockNumber}/>,
      },
      // ---------------------------------------------------------------
      {

        field: MSG.strings.Txn_detail_row5,
        value: entity.value == null ? EMPTY_STR : <span className="">{value + " " + unit}</span>,
      },
      {
        field: MSG.strings.Txn_detail_row6,
        value: entity.nrgPrice == null ? EMPTY_STR : 
            <span>
              { nc_numFormatterAmp(entity.nrgPrice, null) }
              <span className="subtitle"><a href="https://github.com/aionnetwork/aion/wiki/Aion-Terminology" target="_blank">(what's an Amp?)</a></span>
            </span>
      },
      {
        field: MSG.strings.Txn_detail_row7,
        value: entity.nrgConsumed != null ? nc_numFormatter(entity.nrgConsumed, 18) + " NRG" : EMPTY_STR,
      },
      {
        field: MSG.strings.Txn_detail_row8,
        value: entity.txError == null ? EMPTY_STR :
          (entity.txError == "") ?
          <span className="tx-status">
            <span className="pt-icon-standard pt-icon-tick-circle icon success"/>
            <span className="status-text">SUCCESS</span>
          </span> :
          <span className="tx-status">
            <span className="pt-icon-standard pt-icon-error icon fail"/>
            <span className="status-text">{entity.txError}</span>
          </span>
        
      },
      // ---------------------------------------------------------------
      {
        field: MSG.strings.Txn_detail_row9,
        value: entity.transactionIndex != null ? entity.transactionIndex : EMPTY_STR,
      },
      {
        field: MSG.strings.Txn_detail_row10,
        value: entity.nonce != null ? BigNumber(String(entity.nonce), 16).toString(10) : EMPTY_STR,
      },
      {
              //Contract type
              field: "Type",//MSG.strings.Txn_detail_row10,
              value: entity.type,//entity.nonce != null ? BigNumber(String(entity.nonce), 16).toString(10) : EMPTY_STR,
      },
      {
        field: MSG.strings.Txn_detail_row11,
        value: <NCEntityLabel 
                  entityType={NCEntity.ACCOUNT} 
                  entityId={entity.fromAddr}/>,
      },
      {
        field: MSG.strings.Txn_detail_row12,
        value: entity.toAddr ? 
                <NCEntityLabel 
                  entityType={NCEntity.ACCOUNT} 
                  entityId={entity.toAddr}/> :
                entity.contractAddr ?
                <NCEntityLabel 
                  entityType={NCEntity.CNTR} 
                  entityId={entity.contractAddr}/> :
                MSG.strings.Txn_detail_row12_sub_a + " ",
      },
       
      // ---------------------------------------------------------------
      {
        field: MSG.strings.Txn_detail_row13,
        value: parsedTxnLog ? 
        <pre className={"nc-resizable"}>
          {this.cpmessage}
          <CopyToClipboard text={parsedTxnLog}
          onCopy={() => this.setState({copied: true})}>
          <button className="copy">{MSG.strings.Txn_detail_row14_sub_a}</button>
          </CopyToClipboard>
          { parsedTxnLog }
        </pre> 
        : 
        "No Transaction Logs",
      },
      {
        field: MSG.strings.Txn_detail_row14,
        value: parsedInputData ? 
                (entity.toAddr ? 
                  <pre className={"nc-resizable"}>
                  <CopyToClipboard text={parsedInputData}
                    onCopy={() => this.setState({copied: true})}>
                    <button className="copy">{MSG.strings.Txn_detail_row14_sub_a}</button>
                    </CopyToClipboard>
                  { parsedInputData }
                  </pre> 
                  : 
                  <pre className={"nc-resizable"}>
                  <CopyToClipboard text={entity.data}
                   onCopy={() => this.setState({copied: true})}>
                  <button className="copy">{MSG.strings.Txn_detail_row14_sub_a}</button>
                  </CopyToClipboard>
                  { entity.data }
                  </pre>
                ):
                MSG.strings.Txn_detail_row14_sub_b + " ",
      },
    ];

    return (
      <NCEntityDetail desc={desc}/>
    );
  }
}
























