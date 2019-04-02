/* eslint-disable */
import React, { Component } from 'react'; 
import moment from 'moment';

//import {BigNumber} from 'bignumber.js';
import NCEntityLabel from 'components/common/NCEntityLabel';

import { NCEntity } from 'lib/NCEnums';
import { nc_decimalPrettify } from 'lib/NCUtility';
//import NCLink from 'components/common/NCLink';

import NCEntityDetail from 'components/common/NCEntityDetail';
import {strings as MSG} from 'lib/NCTerms';//MSG.Acc_detail_row3

const EMPTY_STR = MSG.empty_string; //"Not Available";
const NOT_CONTRACT = MSG.not_contract; //"Not a Contract";
export default class NCAccDetail extends Component
{


  render() {
    let { entity, tokenList } = this.props;
    
    //let bal = nc_numFormatterACSensitive(entity.balance);
    let balance = nc_decimalPrettify(entity.balance);

    

    let desc = [
      {
        field: MSG.Acc_detail_row2,
        value:  <NCEntityLabel
                  entityType={ NCEntity.ACCOUNT }
                  entityId={ entity.address }
                  linkActive={ false }/>
      },
      {
        field: MSG.strings.Acc_detail_row2,
        value:  entity.tokenName  ?
                entity.balance == null ? MSG.Acc_detail_row2_subtitle_a :
                <span className="">
                  {balance + " " + entity.tokenName}                
                </span>
                :
                entity.balance == null ? MSG.Acc_detail_row2_subtitle_a :
                <span className="">{balance + " AION"}
                  <span className="subtitle">{"("+ MSG.Acc_detail_row2_subtitle_a +"  "+ entity.lastBlockNumber + ")"}</span>
                </span>


      },
      {
        field: MSG.Acc_detail_row3,
        value: !entity.nonce ? EMPTY_STR : entity.nonce
      },
      {
        field: entity.contract ? Acc_detail_row4 : "",
        value: entity.contract ? <NCEntityLabel
                  entityType={ NCEntity.CNTR }
                  entityId={ entity.address }
                  linkActive={ true }/>
                  :""
      },
      {
        field: MSG.Acc_detail_row5,
        value: tokenList
      },
      
      
    ];

    return (
      <NCEntityDetail desc={desc}/>
    );
  }
}
























