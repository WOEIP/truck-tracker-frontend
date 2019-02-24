import React, {Component} from 'react';

import '../styles/login-page.scss';

import Api from './../utils/Api.js';
import Auth from './../utils/Auth.js';
import Menu from './../components/Menu.js';

import {SessionContext} from './../utils/Session.js';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: ''
    };

    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.goToRegistration = this.goToRegistration.bind(this);
    this.login = this.login.bind(this);
  }

  login() {
    let session = this.context;
    let postData = {
      username: this.state.username,
      password: Auth.hashPassword(this.state.password)
      //username: 'attila',
      //password: Auth.hashPassword('bacon')
    };

    Api.post('auth/login', postData).then(response => {
       if (response.status === 200) {
         session.update({loggedIn: true});
         window.location.hash = '#report';
       }
    }).catch(() => {
        console.log('unauthorized login');
    });
  }

  goToRegistration() {
    window.location.hash = '#register';
  }

  handleUserChange(evt) {
    this.setState({
      username: evt.target.value
    });
  };

  handlePassChange(evt) {
    this.setState({
      password: evt.target.value
    });
  }

  render() {
    return (
      <article id="login-page">
        <Menu current="login"/>
        <p>
          Please log in to report an incident!
        </p>
        <form>
          <label>Username</label>
          <input type="text" data-test="username"
                 value={this.state.username}
                 onChange={this.handleUserChange} />
          <label>Password</label>
          <input type="password"
                 value={this.state.password}
                 onChange={this.handlePassChange} />
          <div className="actions">
            <button onClick={this.login}>
              Login
            </button>
            <button onClick={this.goToRegistration}>
              Register
            </button>
          </div>
        </form>
      </article>
    );
  }
}

Login.contextType = SessionContext;

export default Login;
