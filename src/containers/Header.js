import React, { Component } from 'react';
import '../css/header.css';
import '../css/pure-release-1.0.0/pure-min.css';
import '../css/pure-release-1.0.0/grids-responsive.css';
import logo from '../img/logo.png';

class Header extends Component {
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
            <div className="pure-u-1 pure-u-sm-1-3">
              <a className="main-button" href="#report">REPORT</a>
            </div>
            <div className="pure-u-1 pure-u-sm-1-3">
              <a className="main-button" href="#mission">MISSION</a>
            </div>
            <div className="pure-u-1 pure-u-sm-1-3">
              <a className="main-button" href="#contact">CONTACT</a>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}

export default Header;
