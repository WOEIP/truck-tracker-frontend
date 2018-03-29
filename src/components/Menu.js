import React, { Component } from 'react';
import '../css/pure-release-1.0.0/pure-min.css';
import '../css/pure-release-1.0.0/grids-responsive.css';

class Menu extends Component {
  render() {
    return (
      <nav className="nav">
        <ul className="nav__menu">
          <li className="nav__menu-item">
            <a>Report</a>
          </li>
          <li
            className="nav__menu-item"
          >
            <a>Mission</a>
          </li>
          <li className="nav__menu-item">
            <a>Contact</a>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Menu;
