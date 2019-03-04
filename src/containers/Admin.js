import React, { Component } from 'react';
import Api from './../utils/Api.js';
import Menu from './../components/Menu.js';

import '../styles/admin.scss';

class Admin extends Component {
    constructor(props) {
    super(props);
    this.state = {
      users: []
    };

    this.toggleUser = this.toggleUser.bind(this);
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers() {
    Api.get('users').then(response => {
      this.setState({users: response.data});
    });
  }

  toggleUser(user) {
    console.log('Does not work yet');
    console.log(user);
  }

  userHtml() {
    let users = this.state.users;
    let itemsToRender = [];
    for (let i = 0; i < users.length; i++) {
      let user = users[i];
      console.log(user);
      let buttonText = user.activeP ? "Deactivate" : "Activate";
      itemsToRender.push(
        <p className='admin-row'
            key={user.id}>
          <span>{user.firstName + ' ' + user.lastName}</span>
          <button className='admin-button' onClick={() => this.toggleUser(user)}>
            {buttonText}
          </button>
        </p>
      );
    }
    return itemsToRender;
  }


  render() {
    return (
      <article id="mission-text">
        <Menu current="admin"/>
        <h1 className="title">Admin settings</h1>
        <div>{this.userHtml()}</div>
      </article>
    );
  }
}

export default Admin;
