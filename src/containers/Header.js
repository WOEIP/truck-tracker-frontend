import React, { Component } from 'react';
import '../assets/css/header.css';
import logo from '../img/logo.png';

class Header extends Component {
    render() {
        return (
            <header id="header">
              	<div className="logo">
                	<img src={logo} id="logo" alt="logo" />
              	</div>
              	<div className="content">
	                <div className="inner">
	                	<h1>WOEIP Truck Report System</h1>
	                </div>
              	</div>
              	<nav>
                	<ul>
	                  	<li><a href="#info">Info</a></li>
	                  	<li><a href="#report">Report</a></li>
	                  	<li><a href="#mission">Mission</a></li>
	                  	<li><a href="#contact">Contact</a></li>
                	</ul>
              	</nav>
            </header>
        );
    }
}

export default Header;