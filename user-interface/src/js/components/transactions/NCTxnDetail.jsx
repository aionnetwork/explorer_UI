/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';

import { NCEntity } from 'lib/NCEnums';
import NCEntityLabel, { parseClientTransaction } from 'components/common/NCEntityLabel';
import NCEntityDetail from 'components/common/NCEntityDetail';

import { nc_isStrEmpty, nc_numFormatter, nc_numFormatterBytes, nc_numFormatterACSensitive, nc_isPositiveInteger, nc_hexPrefix } from 'lib/NCUtility';

const EMPTY_STR = "Not Available";

export default class NCTxnDetail extends Component
{
  constructor(props) {
    super(props);
  }

  parseTxnLog = (txnLog) => {
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

  render() {
    let { entity } = this.props;

    let parsedTxnLog = this.parseTxnLog(entity.transactionLog)

    let desc = 
    [
      {
        field: "Time Sealed",
        value: moment.unix(entity.timestampVal).format('LLLL'),
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
        field: "Index",
        value: entity.transactionIndex != null ? entity.transactionIndex : EMPTY_STR,
      },
      {
        field: "Nonce",
        value: entity.nonce != null ? entity.nonce : EMPTY_STR,
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
                "Contract Creation",
      },
      // ---------------------------------------------------------------
      {
        field: "Value",
        value: entity.value = null ? EMPTY_STR : <span className="strong">{nc_numFormatterACSensitive(entity.value) + " AION"}</span>,
      },
      {
        field: "Nrg Price",
        value: entity.nrgPrice != null ? nc_numFormatter(entity.nrgPrice, 6) + " NRG" : EMPTY_STR,
      },
      {
        field: "Nrg Consumed",
        value: entity.nrgConsumed != null ? nc_numFormatter(entity.nrgConsumed, 6) + " NRG" : EMPTY_STR,
      },
      // ---------------------------------------------------------------
      {
        field: "Txn Logs",
        value: parsedTxnLog ? <pre className={"nc-resizable"}>{ parsedTxnLog }</pre> : "No Transaction Logs",
      },
      {
        field: "Input Data",
        value: entity.data ? <pre className={"nc-resizable"}>{ entity.data }</pre> : "No Input Data",
      },
    ];

    return (
      <NCEntityDetail desc={desc}/>
    );
  }
}
























