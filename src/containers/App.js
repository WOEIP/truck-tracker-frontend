import React, { Component } from 'react';
import MainPage from './../components/MainPage';
import Report from './../containers/Report';
import ViewData from './../containers/ViewData';
import Mission from './../components/Mission';
import Contact from './../components/Contact';

class App extends Component {

  componentDidMount() {
    var self = this;
    window.addEventListener('hashchange', (e) => {self.forceUpdate();});
  }

  componentWillUnmount(){
    window.removeEventListener('hashchange', (e) => {self.forceUpdate();});
  }

  getActiveContent(){
    switch(window.location.hash) {
    case '#report':
      return Report;
    case '#mission':
      return Mission;
    case '#contact':
      return Contact;
    case '#view-data':
      return ViewData;
    default:
      return MainPage;
    }
  };

  render() {
    const ActiveContent = this.getActiveContent();
    return (
      <div id="bground">
        <ActiveContent/>
      </div>
    );
  }
}

export default App;
