import React, { Component } from 'react';
import Menu from './../components/Menu.js';
import '../styles/common.scss';
import '../styles/contact.scss';
import '../styles/pure-release-1.0.0/pure-min.css';
import '../styles/pure-release-1.0.0/grids-responsive.css';

class Contact extends Component {

  constructor(props){
    super(props);
    this.state = {name: "",
                  email: "",
                  message: ""
    };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }


  handleTextChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  //this is better suited to be in a container in the long run
  sendMessage(){
    console.log("sending: " + this.state.name + this.state.email + this.state.message);
  }

  render() {
    return (
      <div className="bground">
        <article id="contact">
          <Menu current="contact"/>
          <h1 className="title">Send a message</h1>
          <p>Use the form below, and we'll get back to you!</p>
          <form className="pure-g">
            <div className="form-element pure-u-1">
              <label htmlFor="name">Name</label>
              <input type="text"
                     name="name"
                     value={this.state.name}
                     onChange={this.handleTextChange}  />
            </div>
            <div className="form-element pure-u-1">
              <label htmlFor="email">Email</label>
              <input type="text"
                     name="email"
                     value={this.state.email}
                     onChange={this.handleTextChange}  />
            </div>
            <div className="form-element pure-u-1">
              <label htmlFor="message">Message</label>
              <textarea rows="4"
                        type="text"
                        name="message"
                        value={this.state.message}
                        onChange={this.handleTextChange}  />
            </div>
            <button type="button"
                    onClick={this.sendMessage}>Send</button>
          </form>
          {/*<ul className="icons">
              <li>
                  <a href="" className="icon fa-twitter">
                      <span className="label">Twitttter</span>
                      </a>
                      </li>
                      <li>
                          <a href="" className="icon fa-facebook">
                              <span className="label">Facebook</span>
                              </a>
                              </li>
          </ul>*/}
        </article>
      </div>
    );
  }
}

export default Contact;
