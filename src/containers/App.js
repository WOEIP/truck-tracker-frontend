import React, { Component } from 'react';
import MainPage from './../components/MainPage';
import Report from './Report';
import Mission from './Mission';
import Contact from './Contact';
import Footer from './Footer';

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
    default:
      return MainPage;
    }
  };

  render() {
    const ActiveContent = this.getActiveContent();
    return (
      <div>
        <ActiveContent/>
      </div>
    );
  }
}

export default App;
