import React, { Component } from 'react';
import Header from './Header';
import Report from './Report';
import Mission from './Mission';
import Contact from './Contact';
import Footer from './Footer';

class App extends Component {
  render() {
    return (
      <div>
          <Header/>
          <div id="main">
            <Report/>
            <Mission/>
            <Contact/>
          </div>
          <Footer/>
      </div>
    );
  }
}

export default App;
