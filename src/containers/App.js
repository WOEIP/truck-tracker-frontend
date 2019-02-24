import React, { Component } from 'react';
import RegistrationPage from './../components/RegistrationPage.js';
import RegistrationSent from './../components/RegistrationSent.js';
import Login from './../components/Login';
import Logout from './../components/Logout';
import MainPage from './../components/MainPage';
import Report from './../containers/Report';
import ViewData from './../containers/ViewData';
import Mission from './../components/Mission';
import Contact from './../components/Contact';
import Admin from './../containers/Admin';

import SessionProvider from './../utils/Session.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      session: {
        loggedIn: false
      }
    };
  }

  componentDidMount() {
    let self = this;
    window.addEventListener('hashchange', () => {self.forceUpdate();});
  }

  componentWillUnmount(){
    window.removeEventListener('hashchange', () => {self.forceUpdate();});
  }

  getActiveContent(){
    switch(window.location.hash) {
    case '#register':
      return RegistrationPage;
    case '#registerdone':
      return RegistrationSent;
    case '#login':
      return Login;
    case '#logout':
      return Logout;
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
      <SessionProvider>
        <div id="bground">
          <ActiveContent/>
        </div>
     </SessionProvider>
    );
  }
}

export default App;
