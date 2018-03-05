/* eslint-disable */
import React, { Component } from 'react';
import moment from 'moment';

import NCLoading from 'components/common/NCLoading';

const COMPONENT_MOUNT_TIMEOUT = 300; // ms

export default class NCComponentLazyLoad extends Component
{
  constructor(props) {
    super(props);

    this.state = 
    {
      loadingPage: true,
    }
  }

  componentWillMount()
  {
    this.setState({ loadingPage: true, }, function() {
      // Using setTimeout here ensures that the component will wait until
      // the next frame before trying to render again.
      setTimeout(function() {
          this.setState({ loadingPage: false });
      }.bind(this), COMPONENT_MOUNT_TIMEOUT);
    });
  }

  render() {

    const { marginTop="140", title="Loading Page" } = this.props;

    if (this.state.loadingPage) {
      return (
        <NCLoading 
          title={title} 
          marginTop={marginTop}
          marginBottom="0"/>
      );
    }
    
    // this will throw if there are many children
    return React.Children.only(this.props.children);
    
  }
}
























































