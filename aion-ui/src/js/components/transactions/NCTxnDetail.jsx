/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';

import { NCEntity } from 'lib/NCEnums';
import NCEntityLabel, { parseClientTransaction } from 'components/common/NCEntityLabel';
import NCEntityDetail from 'components/common/NCEntityDetail';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import { nc_decimalPrettify,nc_isStrEmpty, nc_numFormatter,nc_numPrettify, nc_numFormatterAmp, nc_numFormatterBytes, nc_numFormatterACSensitive, nc_isPositiveInteger, nc_hexPrefix } from 'lib/NCUtility';
import {BigNumber} from 'bignumber.js';
const EMPTY_STR = "Not Available";

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
    
    let value = nc_decimalPrettify(entity.value);

    let unit = entity.tokenSymbol == null? "Aion" : entity.tokenSymbol;

    let desc = 
    [
      {
        field: "Time Sealed",
        value: moment.unix(entity.blockTimestamp).format('LLLL'),
      },
      {
        field: entity.tokenSymbol == null? "Coin" : "Token",
        value: 
                  entity.tokenSymbol == null? 
                  <NCEntityLabel
                  entityType={NCEntity.TKN}
                  entityId="AION (native)"
                  linkActive={false}/>
                  :
                  <NCEntityLabel
                  entityType={NCEntity.TKN}
                  entityId={entity.tokenName}
                  linkActive={false}/>
              
      },
      {
        field: "Transaction Hash",
        value: <NCEntityLabel
                  entityType={NCEntity.TXN}
                  entityId={entity.transactionHash}
                  linkActive={false}/>,
      },
      {
        field: "Block Number",
        value: <NCEntityLabel
                  entityType={NCEntity.BLOCK}
                  entityId={entity.blockNumber}/>,
      },
      // ---------------------------------------------------------------
      {
        field: "Value",
        value: entity.value == null ? EMPTY_STR : <span className="">{value + " " + unit}</span>,
      },
      {
        field: "Nrg Price",
        value: entity.nrgPrice == null ? EMPTY_STR : 
            <span>
              { nc_numFormatterAmp(entity.nrgPrice, null) }
              <span className="subtitle"><a href="https://github.com/aionnetwork/aion/wiki/Aion-Terminology" target="_blank">(what's an Amp?)</a></span>
            </span>
      },
      {
        field: "Nrg Consumed",
        value: entity.nrgConsumed != null ? nc_numFormatter(entity.nrgConsumed, 18) + " NRG" : EMPTY_STR,
      },
      {
        field: "Status",
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
        field: "Index",
        value: entity.transactionIndex != null ? entity.transactionIndex : EMPTY_STR,
      },
      {
        field: "Nonce",
        value: entity.nonce != null ? BigNumber(String(entity.nonce), 16).toString(10) : EMPTY_STR,
      },
      {
        field: "From Address",
        value: <NCEntityLabel 
                  entityType={NCEntity.ACCOUNT} 
                  entityId={entity.fromAddr}/>,
      },
      {
        field: "To Address",
        value: entity.toAddr ? 
                <NCEntityLabel 
                  entityType={NCEntity.ACCOUNT} 
                  entityId={entity.toAddr}/> :
                entity.contractAddr ?
                <NCEntityLabel 
                  entityType={NCEntity.CNTR} 
                  entityId={entity.contractAddr}/> :
                "Contract Creation",
      },
       
      // ---------------------------------------------------------------
      {
        field: "Txn Logs",
        value: parsedTxnLog ? 
        <pre className={"nc-resizable"}>
          {this.cpmessage}
          <CopyToClipboard text={parsedTxnLog}
          onCopy={() => this.setState({copied: true})}>
          <button className="copy">Copy</button>
          </CopyToClipboard>
          { parsedTxnLog }
        </pre> 
        : 
        "No Transaction Logs",
      },
      {
        field: "Input Data",
        value: parsedInputData ? 
                (entity.toAddr ? 
                  <pre className={"nc-resizable"}>
                  <CopyToClipboard text={parsedInputData}
                    onCopy={() => this.setState({copied: true})}>
                    <button className="copy">Copy</button>
                    </CopyToClipboard>
                  { parsedInputData }
                  </pre> 
                  : 
                  <pre className={"nc-resizable"}>
                  <CopyToClipboard text={entity.data}
                   onCopy={() => this.setState({copied: true})}>
                  <button className="copy">Copy</button>
                  </CopyToClipboard>
                  { entity.data }
                  </pre>
                ):
                "No Input Data",
      },
    ];

    return (
      <NCEntityDetail desc={desc}/>
    );
  }
}
























