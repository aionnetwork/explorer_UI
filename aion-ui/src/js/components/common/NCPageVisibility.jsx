// modified https://www.npmjs.com/package/react-page-visibility

/* eslint-disable */
import React from 'react';

const hasDocument = typeof document !== 'undefined';
const vendorEvents = [{
  hidden: 'hidden',
  event: 'visibilitychange',
  state: 'visibilityState'
}, {
  hidden: 'webkitHidden',
  event: 'webkitvisibilitychange',
  state: 'webkitVisibilityState'
}, {
  hidden: 'mozHidden',
  event: 'mozvisibilitychange',
  state: 'mozVisibilityState'
}, {
  hidden: 'msHidden',
  event: 'msvisibilitychange',
  state: 'msVisibilityState'
}, {
  hidden: 'oHidden',
  event: 'ovisibilitychange',
  state: 'oVisibilityState'
}];

const isSupported = hasDocument && Boolean(document.addEventListener);

const visibility = (() => {
  if (!isSupported) {
    return null;
  }
  for (let i = 0; i < vendorEvents.length; i++) {
    const event = vendorEvents[i];
    if (event.hidden in document) {
      return event;
    }
  }
  // otherwise it's not supported
  return null;
})();

export const getVisibilityState = (hidden, state) => {
  return ({
    documentHidden: hidden,
    visibilityState: state,
  });
};

export default function NCPageVisibility (ComposedComponent)
{
  return class PageVisibilityHOC extends React.Component 
  {
    constructor(props) {
      super(props);

      const { hidden, state } = visibility;
      this.state = {
        documentHidden: document[hidden],
        visibilityState: document[state],
      }

      this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }

    componentWillMount() 
    {
      if (!isSupported || !visibility) {
        return;
      }
      this.isListening = true;
      document.addEventListener(visibility.event, this.handleVisibilityChange);
    }

    componentWillUnmount() 
    {
      if (!this.isListening) {
        return;
      }
      document.removeEventListener(visibility.event, this.handleVisibilityChange);
    }

    handleVisibilityChange()
    {
      const { hidden, state } = visibility;
      this.setState(getVisibilityState(document[hidden], document[state]), () => {
        //console.log(this.state);
      });
    }
    
    // Returns the underlying wrapped component instance.
    // Useful if you need to access a method or property of the component
    // passed to HOC.

    getWrappedInstance () {
      return this.refs.wrappedInstance
    }

    render() {
      if (ComposedComponent == null) return null;
      return(
        <ComposedComponent
          {...this.state}
          ref='wrappedInstance'
        />
      );
    }
  }
}
















