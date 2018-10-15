/* eslint-disable */
import React, { Component } from 'react';
import { Link } from 'react-router'; 

import moment from 'moment';

import NCTimescale from 'components/common/NCTimescale';

export default class NCExplorerHead extends Component
{
  render() {
    const { breadcrumbs, momentUpdated, title, subtitle } = this.props;

    const showBreadcrumbs = (breadcrumbs && Array.isArray(breadcrumbs));
  
    const bc = [];
    if (showBreadcrumbs) {
      breadcrumbs.forEach((element, index) => {
        const isLast = (index + 1 == breadcrumbs.length)
        if (!isLast) {
          bc.push(<li key={index}><Link to={element.link} className="pt-breadcrumb">{element.body}</Link></li>);
        } else {
          bc.push(<li key={index}><span className="pt-breadcrumb pt-breadcrumb-current">{element.body}</span></li>);
        }
      });
    }

    return(
      <div className="NCExplorerHead">
        <div className="nav-row">
        {
          showBreadcrumbs &&
          <ul className="pt-breadcrumbs">
            { bc }
          </ul>
        }
        </div>
        <div className="title-row">
          <span className="left">
            <span className="title">
            <h2 className="page">{title}</h2>
            {
              subtitle && 
              <span className="join"></span>
            }
            {
              subtitle && 
              <h2 className="desc">{subtitle.totalTokens + " Total Tokens"}</h2>
            }
            </span>
          </span>
          <span className="right">
          { 
            (momentUpdated && moment(momentUpdated).isValid()) &&
            <div className="updated">
              <span className="title">Retrieved:</span> 
              <NCTimescale
                dateObjArr={[momentUpdated]}
                isMedium={true}/>
            </div>              
          }
          </span>
        </div>
      </div>
    );
  }
}

          