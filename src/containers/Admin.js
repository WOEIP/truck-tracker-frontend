import React, { Component } from 'react';
import Api from './../utils/Api.js';
import Menu from './../components/Menu.js';

class Admin extends Component {
    constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  getUsers() {
    Api.get('users').then(response => {
      this.setState({users: response.data});
    });
  }

  userHtml() {
    let users = this.state.users;
    let itemsToRender = [];
    for (let i = 0; i < users.length; i++) {
      itemsToRender.push(
        <p key={users[i]["id"]}> {users[i]["firstName"] + ' ' + users[i]["lastName"]}</p>
      );
    }
    return itemsToRender;
  }


  render() {
    this.getUsers();

    return (
      <article id="mission-text">
        <Menu current="admin"/>
        <h1 className="title">Admin settings</h1>
        <p>{this.userHtml()}</p>
      </article>
    );
  }
}

export default Admin;
