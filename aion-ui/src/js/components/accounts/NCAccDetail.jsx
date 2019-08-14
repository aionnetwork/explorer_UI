/* eslint-disable */
import React, { Component } from 'react'; 
import moment from 'moment';

//import {BigNumber} from 'bignumber.js';
import NCEntityLabel from 'components/common/NCEntityLabel';

import { NCEntity } from 'lib/NCEnums';
import { nc_decimalPrettify,nc_addDecimal, nc_decimalPoint,nc_numFormatterAionCoin } from 'lib/NCUtility';
//import NCLink from 'components/common/NCLink';

import NCEntityDetail from 'components/common/NCEntityDetail';
import {strings as MSG} from 'lib/NCTerms';//MSG.Acc_detail_row3

const EMPTY_STR = MSG.empty_string; //"Not Available";
const NOT_CONTRACT = MSG.not_contract; //"Not a Contract";
export default class NCAccDetail extends Component
{


  render() {
    let { entity, tokenList } = this.props;
    
    //let bal = nc_numFormatterACSensitive(entity.balance);nc_numFormatterAionCoin(num.toFixed(),8);
    //console.log(entity.tokenDecimal);
    let balance = entity.tokenName ? (entity.scaledBalance < 1) ? nc_decimalPrettify(entity.scaledBalance) : nc_decimalPrettify(nc_decimalPoint(entity.scaledBalance)) : nc_decimalPrettify(nc_decimalPoint(entity.balance,18));
    //let balance = entity.tokenName && entity.tokenDecimal ? nc_decimalPrettify(nc_addDecimal(entity.balance,entity.tokenDecimal,8)) : nc_decimalPrettify(entity.balance);
    //let value = entity.tokenSymbol == null ? nc_decimalPrettify(entity.value) : nc_decimalPrettify(nc_addDecimal(entity.value));

    let desc = [
      {
        field: MSG.Acc_detail_row1,
        value:  <NCEntityLabel
                  entityType={ NCEntity.ACCOUNT }
                  entityId={ entity.address }
                  linkActive={ false }/>
      },
      {
                    field: "Token",
                    value: tokenList

      },
      {
        field: MSG.Acc_detail_row2,
        value:  entity.tokenName  ?
                entity.balance == null ? MSG.Acc_detail_row2_subtitle_a :
                <span className="">
                  {balance + " " + entity.tokenName}
                </span>
                :
                entity.balance == null ? MSG.Acc_detail_row2_subtitle_a :
                <span className="">{balance + " AION"}
                  <span className="subtitle">{"("+ MSG.Acc_detail_row2_subtitle_b +"  "+ entity.lastBlockNumber + ")"}</span>
                </span>


      },
      {
        field: MSG.Acc_detail_row3,
        value: !entity.nonce ? EMPTY_STR : entity.nonce
      },
      {
        field: entity.contract ? MSG.Acc_detail_row4 : "",
        value: entity.contract ? <NCEntityLabel
                  entityType={ NCEntity.CNTR }
                  entityId={ entity.address }
                  linkActive={ true }/>
                  :""
      }


    ];

    return (
      <NCEntityDetail desc={desc}/>
    );
  }
}
























