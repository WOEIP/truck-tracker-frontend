import React, { Component } from 'react';
import Login from './../components/Login';
import MainPage from './../components/MainPage';
import Report from './../containers/Report';
import ViewData from './../containers/ViewData';
import Mission from './../components/Mission';
import Contact from './../components/Contact';
import Admin from './../containers/Admin';

class App extends Component {

  componentDidMount() {
    var self = this;
    window.addEventListener('hashchange', () => {self.forceUpdate();});
  }

  componentWillUnmount(){
    window.removeEventListener('hashchange', () => {self.forceUpdate();});
  }

  getActiveContent(){
    switch(window.location.hash) {
    case '#login':
      return Login;
    case '#report':
      return Report;
    case '#mission':
      return Mission;
    case '#contact':
      return Contact;
    case '#view-data':
      return ViewData;
    case '#admin':
      return Admin;
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
