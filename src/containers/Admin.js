import React, { Component } from 'react';
import Menu from './../components/Menu.js';

class Admin extends Component {
  render() {
    return (
      <article id="mission-text">
        <Menu current="admin"/>
        <h1 className="title">Admin settings</h1>
        <p>TBD...</p>
      </article>
    );
  }
}

export default Admin;
