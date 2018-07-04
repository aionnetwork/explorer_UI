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
      
      subtitle,
      content, 

      loadingStr, 
      invalidDataStr, 
      emptyDataStr,
      isToplevelSection=false,

      marginBottom=40,
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
          marginBottom={marginBottom}/>
      }
      {
        (!isLoading && !isDataValid) &&
        <NCNonIdealState
          paddingTop={marginTop}
          paddingBottom={marginBottom}
          icon={"pt-icon-warning-sign"}
          title={invalidDataTitle}
          description={invalidDataStr}
          showHomeLink={isToplevelSection}/>
      }
      {
        (!isLoading && isDataValid && isDataEmpty) &&
        <NCNonIdealState
          paddingTop={marginTop}
          paddingBottom={marginBottom}
          icon={"pt-icon-offline"}
          title={emptyDataTitle}
          description={emptyDataStr}
          showHomeLink={isToplevelSection}/>
      }
      {
        (!isLoading && isDataValid && !isDataEmpty) &&   
        <div>
          { (subtitle != null) && subtitle }
          { content }
        </div>
      }
      </div>
    );
  }
}










































