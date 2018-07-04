import React, { Component } from 'react';
import { Link } from 'react-router';

export default class NCNonIdealState extends Component
{
  render() {
    const { paddingTop="140", paddingBottom="0", title, description, icon, showHomeLink=false } = this.props;
    
    return (
      <div 
        className="NCNonIdealState"
        style={{
          paddingTop: `${paddingTop}px`,
          paddingBottom: `${paddingBottom}px`,
        }}>
        <div className="pt-non-ideal-state" >
          <div className="pt-non-ideal-state-visual pt-non-ideal-state-icon">
            <span className={"pt-icon " + icon}></span>
          </div>
          <h4 className="pt-non-ideal-state-title">{title}</h4>
          {
            (description != null) &&
            <div className="pt-non-ideal-state-description">
              { description }
            </div>
          }
          {
            (showHomeLink) && 
            <div className="pt-non-ideal-state-btn">
              <Link to="/">
                <button type="button" className="pt-button pt-intent-primary pt-minimal nc-minimal-btn-shadow">
                  <span className="pt-icon-standard pt-icon-home"></span>
                  Navigate Home
                </button>
              </Link>
            </div>
          }
          
        </div>
      </div>
    );
  }
}
