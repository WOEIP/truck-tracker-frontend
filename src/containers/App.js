 import React, { Component } from 'react';
import '../assets/css/main.css';
import Header from './Header';
import Report from './Report';
import Mission from './Mission';
import Contact from './Contact';
import Footer from './Footer';

class App extends Component {
  render() {
    return (
        <div>

            <div id="wrapper">

                <Header/>

                <div id="main">

                    <Report/>

                    <Mission/>

                    <Contact/>

                </div>

                <Footer/>

            </div>

            <div id="bg"></div>
        </div>
    );
  }
}

export default App;
