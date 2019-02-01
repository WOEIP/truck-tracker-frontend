import React, { Component } from 'react';
import Menu from './../components/Menu.js';

class Admin extends Component {
  render() {
    return (
      <article id="mission-text">
        <Menu current="mission"/>
        <h1 className="title">Admin settings</h1>
      </article>
    );
  }
}

export default Admin;
