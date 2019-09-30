/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';
import PageVisibility from 'react-page-visibility';

import { NCEntityInfo,NCEntity } from 'lib/NCEnums';
import NCEntityLabel, {parseClientTransaction} from 'components/common/NCEntityLabel';
import { nc_decimalPrettify,nc_addDecimal,nc_numFormatterAionCoin } from 'lib/NCUtility';

import {strings as MSG} from 'lib/NCTerms';

import FlipMove from 'react-flip-move';

class NCTxnTableRTRow extends Component 
{
  render() {
    let { entity } = this.props;
    let val = nc_decimalPrettify(nc_addDecimal(entity.value));
    return (
      <div className="table-row body">
        <div className="column txn-age pt-text-muted hide">{moment.unix(entity.blockTimestamp).fromNow()} </div>
        <div className="column txn-block">{entity.value ? val : 0}</div>
        <div className="column txn-hash growable">
          <NCEntityLabel
            entityType={NCEntity.TXN}
            entityId={entity.transactionHash}/>
          </div>
        <div className="wrapper txn-entityContainer growable">
          <div className="column txn-fromEntity growable">
            <NCEntityLabel 
              entityType={NCEntity.ACCOUNT} 
              
              entityId={entity.fromAddr}/>
             <span className="pt-icon-large pt-icon-arrow-right arrow-icon"/>
          </div>
          <div className="column txn-arrow">
            <span className="pt-icon-large pt-icon-arrow-right"></span>
          </div>
          <div className="column txn-toEntity growable">
            {     
              entity.toAddr ?
                <NCEntityLabel 
                  entityType={NCEntity.ACCOUNT} 
                  
                  entityId={entity.toAddr}/> : entity.contractAddr ?
                <NCEntityLabel 
                  entityType={NCEntity.ACCOUNT} 
                  
                  entityId={entity.contractAddr}/> :

                <strong>Contract Creation</strong>
            }
            <span className="pt-icon-large pt-icon-blank arrow-icon"/>
          </div>
        </div>
      </div>
    );
  }
}


export default class NCTxnTableRT extends Component
{
  constructor(props) {
    super(props);

    this.state = {
      documentHidden: false
    }
  }
  handleVisibilityChange = (visibilityState, documentHidden) => {
    
    this.setState({ documentHidden: documentHidden });
  }

  render() {
    let { entities } = this.props;

    const transactions = entities.map((transaction, i) => (
      <NCTxnTableRTRow
        key={transaction.transactionHash} 
        entity={transaction}
      />
    ));

    return (
      <PageVisibility onChange={this.handleVisibilityChange}>
        <div className="NCTableFlex NCTableTransactionsRT">
          <div className="table-row header">
            <div className="column txn-age hide">{MSG.Txn_rt_list_col1}</div>
            <div className="column txn-block">{MSG.Txn_rt_list_col2}</div>
            <div className="column txn-hash growable">{MSG.Txn_rt_list_col3}</div>
            <div className="wrapper txn-entityContainer growable">
              <div className="column txn-fromEntity growable">{MSG.Txn_rt_list_col4}</div>
              <div className="column txn-arrow">
                <span className="pt-icon-large pt-icon-arrow-right"></span>
              </div>
              <div className="column txn-toEntity growable">{MSG.Txn_rt_list_col5}</div>
            </div>
          </div>
          <FlipMove
            disableAllAnimations={this.state.documentHidden}
            duration={600}
            easing="ease-in-out"
            appearAnimation={"fade"}
            enterAnimation={"fade"}
            leaveAnimation={"accordianVertical"}>
            {transactions}
          </FlipMove>
        </div>
      </PageVisibility>
    );
  }
}




































