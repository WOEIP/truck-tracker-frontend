import React, { Component } from 'react';
import '../styles/main-page.scss';
import '../styles/pure-release-1.0.0/pure-min.css';
import '../styles/pure-release-1.0.0/grids-responsive.css';
import logo from '../img/logo.png';

class MainPage extends Component {
  render() {
    return (
      <div className="bground">
        <div className="app-container">
          <div className="logo-container">
            <img src={logo} alt="logo"/>
          </div>
          <div className="vert-line long"></div>
          <div className="inner-title">
            <h1>WOEIP TRUCK REPORT SYSTEM</h1>
          </div>
          <div className="vert-line short"></div>
          <nav className="pure-g">
            <a className="pure-u-1 pure-u-sm-1-3" href="#report">REPORT</a>
            <a className="pure-u-1 pure-u-sm-1-3" href= "#mission">MISSION</a>
            <a className="pure-u-1 pure-u-sm-1-3" href="#contact">CONTACT</a>
          </nav>
        </div>
      </div>
    );
  }
}

export default MainPage;
