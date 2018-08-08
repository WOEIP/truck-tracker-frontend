import React, {Component} from 'react';

import '../styles/login-page.scss';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: ''
    };

    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.dismissError = this.dismissError.bind(this);
  }

  dismissError() {
    this.setState({ error: '' });
  }

  handleSubmit(evt) {
   // evt.preventDefault();

    //auth here
    this.props.goForward();
    // if (!this.state.username) {
    //   return this.setState({ error: 'Username is required' });
    // }

    // if (!this.state.password) {
    //   return this.setState({ error: 'Password is required' });
    // }

    // return this.setState({ error: '' });
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
      <div id="login-page">
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
            <button onClick={this.props.goForward}>
              Login
            </button>
            <button onClick={this.props.registerUser}>
              Register
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default LoginPage;
