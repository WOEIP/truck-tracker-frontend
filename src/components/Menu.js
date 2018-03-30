import React, { Component } from 'react';
import '../styles/menu.scss';
import '../styles/pure-release-1.0.0/menus.css';
import '../styles/pure-release-1.0.0/pure-min.css';
import '../styles/pure-release-1.0.0/grids-responsive.css';

//current selection from prop

class Menu extends Component {
  render() {
    return (
      <div id="top-menu-container">
      <nav id="top-menu">
        <a href="#" id="top-menu-icon"></a>
        <ul>
          <li>
            <a href="#report" className="top-menu-item">Report</a>
          </li>
          <li>
            <a href="#mission" className="current top-menu-item">Mission</a>
          </li>
          <li>
            <a href="#contact" className="top-menu-item">Contact</a>
          </li>
        </ul>
      </nav>
      <br/>
      </div>
    );
  }
}

export default Menu;
