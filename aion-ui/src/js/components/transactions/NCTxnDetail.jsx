/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';

import { NCEntity } from 'lib/NCEnums';
import NCEntityLabel, { parseClientTransaction } from 'components/common/NCEntityLabel';
import NCEntityDetail from 'components/common/NCEntityDetail';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import { nc_addDecimal,nc_decimalPrettify, nc_rawFormat, nc_numFormatterAionCoin, nc_numFormatterACSensitive, nc_numFormatter, nc_numFormatterAmp,nc_decimalPoint } from 'lib/NCUtility';
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

  formatTxnLogs = (logs) => {
      let json=[];
      if(typeof logs !== 'undefined'){

          logs.forEach(function(log, i){
            let data = {};
            data.address = log.contractAddr;
            data.topics = log.topics;
            data.data = log.data;
            json.push(data);
          });
      }
      return json;
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
  tokenTransfers = (tokens) => {
       let list=[];
       if(tokens.length > 0){
         tokens.map((token,i) => {

             list.push(
                             <span key = {i}><b> {nc_decimalPrettify(nc_addDecimal(token.value,18,1,true))}</b>{" "+token.tokenSymbol+ " from: "}
                                 <a href = {"#/account/" + token.from}>{token.from}</a>
                                 {" to:  "}
                                 <a src = "#">{token.to}</a><br/>
                             </span>

                          );


             });





       }else{
            return;
       }
       return list;
  }

  render() {
    let { entity } = this.props;

    //TODO: Improve to use v2 transaction logs

    let parsedTxnLog = entity.log ? JSON.stringify(this.formatTxnLogs(entity.log), undefined, 2) : this.parseTxnLog(entity.transactionLog);
    let parsedInputData = this.parseInputData(entity.data);

    let value = (typeof entity.tokenSymbol === 'undefined') ?  nc_decimalPrettify(nc_addDecimal(entity.value)) : nc_decimalPrettify(nc_rawFormat(entity.value));

    let unit = (typeof entity.tokenSymbol === 'undefined')? "Aion" : entity.tokenSymbol;

    let tokenList = (entity.tokenTransfers) ? this.tokenTransfers(entity.tokenTransfers) : null;


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
         field: "",
         value: tokenList ==null ? "" :<div className="token-box">{tokenList}</div>,
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
              field: (entity.contractAddr) ?  "Type" : "",
              value: entity.contractAddr ? (entity.type=="DEFAULT")? "FVM" : entity.type : "",
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
        value: (parsedTxnLog.length > 2) ?
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
      }];
      //#########################################################
let desc_2 =[     {
        field: MSG.strings.Txn_detail_row1,
        value: moment.unix(entity.blockTimestamp).format('LLLL'),
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
        field: MSG.strings.Txn_detail_row15,
        value: entity.nrgConsumed != null ? nc_numFormatter(entity.nrgLimit, 18) + " NRG" : EMPTY_STR,
      },
      {
        field: MSG.strings.Txn_detail_row8,
        value: entity.rejected == null ? EMPTY_STR :
          (entity.rejected == false) ?
          <span className="tx-status">
            <span className="pt-icon-standard pt-icon-tick-circle icon success"/>
            <span className="status-text">SUCCESS</span>
          </span> :
          <span className="tx-status">
            <span className="pt-icon-standard pt-icon-error icon fail"/>
            <span className="status-text">REJECTED</span>
          </span>

      },
      {
        field: MSG.strings.Txn_detail_row9,
        value: entity.internalTransactionIndex != null ? entity.internalTransactionIndex : EMPTY_STR,
      },
      {
        field: MSG.strings.Txn_detail_row10,
        value: entity.nonce != null ? BigNumber(String(entity.nonce), 16).toString(10) : EMPTY_STR,
      },
      {
              field: MSG.strings.Txn_detail_row16,
              value: entity.type
      },

      {
              //Contract type
              field: (entity.contractAddr) ?  "Type" : "",
              value: entity.contractAddr ? (entity.type=="DEFAULT")? "FVM" : entity.type : "",
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
      {
        field: MSG.strings.Txn_detail_row17,
        value: entity.data ?

                  <pre className={"nc-resizable"}>
                  <CopyToClipboard text={entity.data}
                   onCopy={() => this.setState({copied: true})}>
                  <button className="copy">{MSG.strings.Txn_detail_row17_sub_a}</button>
                  </CopyToClipboard>
                  { entity.data }
                  </pre>
                :
                MSG.strings.Txn_detail_row17_sub_b + " ",
      }
    ];

    return (
      <NCEntityDetail desc={(typeof entity.internalTransactionIndex !== 'undefined') ? desc_2 : desc}/>
    );
  }
}
























