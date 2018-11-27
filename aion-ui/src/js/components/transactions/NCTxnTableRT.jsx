/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';
import PageVisibility from 'react-page-visibility';

import { NCEntityInfo,NCEntity } from 'lib/NCEnums';
import NCEntityLabel, {parseClientTransaction} from 'components/common/NCEntityLabel';
import { nc_numFormatterAionCoin } from 'lib/NCUtility';

import FlipMove from 'react-flip-move';

class NCTxnTableRTRow extends Component 
{
  render() {
    let { entity } = this.props;
    return (
      <div className="table-row body">
        <div className="column txn-age pt-text-muted hide">{moment.unix(entity.blockTimestamp).fromNow()} </div>
        <div className="column txn-block">{entity.value ? nc_numFormatterAionCoin(entity.value, 4, true) : 0}</div>
        <div className="column txn-hash growable">
          <NCEntityLabel
            entityType={NCEntity.TXN}
            entityId={entity.transactionHash}/>
          </div>
        <div className="wrapper txn-entityContainer growable">
          <div className="column txn-fromEntity growable">
            <NCEntityLabel 
              entityType={NCEntity.ACCOUNT} 
              entityName={entity.fromAddr}
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
                  entityName={entity.toAddr}
                  entityId={entity.toAddr}/>:
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
    //console.log('visibilityState: ', visibilityState);
    //console.log('documentHidden: ', documentHidden);
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
            <div className="column txn-age hide">Age</div>
            <div className="column txn-block">Value</div>
            <div className="column txn-hash growable">Transaction Hash</div>
            <div className="wrapper txn-entityContainer growable">
              <div className="column txn-fromEntity growable">From Address</div>
              <div className="column txn-arrow">
                <span className="pt-icon-large pt-icon-arrow-right"></span>
              </div>
              <div className="column txn-toEntity growable">To Address</div>
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




































