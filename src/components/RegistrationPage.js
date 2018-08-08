import React, {Component} from 'react';

import '../styles/registration-page.scss';

class RegistrationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: '',
      zipcode: '',
      email: '',
      address: ''
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleZipChange = this.handleZipChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
  }

  handleNameChange(evt) {
    this.setState({
      fullname: evt.target.value
    });
  };

  handleZipChange(evt) {
    this.setState({
      zipcode: evt.target.value
    });
  };

  handleEmailChange(evt) {
    this.setState({
      email: evt.target.value
    });
  };

  handleAddressChange(evt) {
    this.setState({
      address: evt.target.value
    });
  };

  render() {
    return (
      <div id="registration-page">
        <p>
          Please fill in your data and then send it for verification!
        </p>
        <form>
          <label>Full name</label>
          <input type="text"
                 value={this.state.fullname}
                 onChange={this.handleNameChange} />
          <label>Zip code</label>
          <input type="text"
                 value={this.state.zipcode}
                 onChange={this.handleZipChange} />
          <label>Email address</label>
          <input type="text"
                 value={this.state.email}
                 onChange={this.handleEmailChange} />
          <label>Address (if you live in West Oakland)</label>
          <input type="text"
                 value={this.state.address}
                 onChange={this.handleAddressChange} />
          <div className="actions">
            <button onClick={this.props.goBack}>
              Send data
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default RegistrationPage;
