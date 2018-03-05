/* eslint-disable */
import React, { Component } from 'react';
import NCComponentLazyLoad from 'components/common/NCComponentLazyLoad';
import NCNonIdealState from 'components/common/NCNonIdealState';
import NCLoading from 'components/common/NCLoading';

export default class NCExplorerSection extends Component
{
  render() {
    const { 
      className, 
      
      isLoading, 
      isDataValid, 
      isDataEmpty, 
      
      content, 

      loadingStr, 
      invalidDataStr, 
      emptyDataStr,
      isToplevelSection=true,

      marginTop, 
      invalidDataTitle="Invalid Data", 
      emptyDataTitle="No Results Found" 
    } = this.props;

    return(
      <div className={className}>
      {
        (isLoading) &&
        <NCLoading
          title={loadingStr}
          marginTop={marginTop}
          marginBottom={40}/>
      }
      {
        (!isLoading && !isDataValid) &&
        <NCNonIdealState
          paddingTop={marginTop}
          paddingBottom={40}
          icon={"pt-icon-warning-sign"}
          title={invalidDataTitle}
          description={invalidDataStr}
          showHomeLink={isToplevelSection}/>
      }
      {
        (!isLoading && isDataValid && isDataEmpty) &&
        <NCNonIdealState
          paddingTop={marginTop}
          paddingBottom={40}
          icon={"pt-icon-offline"}
          title={emptyDataTitle}
          description={emptyDataStr}
          showHomeLink={isToplevelSection}/>
      }
      {
        (!isLoading && isDataValid && !isDataEmpty) && content
      }
      </div>
    );
  }
}










































