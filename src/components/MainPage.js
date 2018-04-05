import React, { Component } from 'react';
import '../styles/main-page.scss';
import '../styles/pure-release-1.0.0/pure-min.css';
import '../styles/pure-release-1.0.0/grids-responsive.css';
import logo from '../img/logo.png';

class MainPage extends Component {
  render() {
    return (
      <div id="app-container">
        <div id="logo-container">
          <img src={logo} alt="logo"/>
        </div>
        <div className="vert-line long"></div>
        <div id="inner-title">
          <h1>WOEIP Truck Report System</h1>
        </div>
        <div className="vert-line short"></div>
        <nav className="pure-g main-menu">
          <a className="pure-u-1 pure-u-sm-1-3" href="#report">Report</a>
          <a className="pure-u-1 pure-u-sm-1-3" href= "#mission">Mission</a>
          <a className="pure-u-1 pure-u-sm-1-3" href="#contact">Contact</a>
        </nav>
      </div>
    );
  }
}

export default MainPage;
