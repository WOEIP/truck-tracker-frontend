import React, { Component } from 'react';
import '../css/header.css';
import '../css/pure-release-1.0.0/pure-min.css';
import logo from '../img/logo.png';

class Header extends Component {
  render() {
    return (
      <header id="header">

        <div className="banner">
        <div className="banner-head">
        <div className="logo">
          <img src={logo} id="logo" alt="logo" />
          </div>
        </div>
        <div className="content">
          <div className="inner">
            <h1>WOEIP Truck Report System</h1>
          </div>
        </div>
        <nav>
          <ul>
            <li><a href="#report">Report</a></li>
            <li><a href="#mission">Mission</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        </div>
      </header>
    );
  }
}

export default Header;
