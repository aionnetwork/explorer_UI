/* eslint-disable */
import React, { Component } from 'react';
import NCComponentLazyLoad from 'components/common/NCComponentLazyLoad';
import NCExplorerSection from 'components/common/NCExplorerSection';

export default class NCExplorerPage extends Component
{
  render() {
    const { isLoading, isDataValid, isDataEmpty, page, loadingStr, invalidDataStr, emptyDataStr } = this.props;

    return(
      <NCComponentLazyLoad>
        <NCExplorerSection
          className="NCExplorerPage"

          isLoading={isLoading}
          isDataValid={isDataValid} 
          isDataEmpty={isDataEmpty}
          
          loadingStr={loadingStr}
          invalidDataStr={invalidDataStr}
          emptyDataStr={emptyDataStr}
          isToplevelSection={true}
        
          content={page}/>
      </NCComponentLazyLoad>
    );
  }
}