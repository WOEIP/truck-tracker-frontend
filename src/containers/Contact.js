import React, { Component } from 'react';
import Button from './../components/Button.js';
import Menu from './../components/Menu.js';
import '../styles/common.scss';
import '../styles/contact.scss';
import '../styles/pure-release-1.0.0/pure-min.css';
import '../styles/pure-release-1.0.0/grids-responsive.css';

class Contact extends Component {
  render() {
    return (
      <div className="bground">
        <article id="contact">
          <Menu current="contact"/>
          <h1 className="title">Send a message</h1>
          <p>Use the form below, and we'll get back to you!</p>
          <form className="pure-g" method="post" action="#">
            <div className="form-element pure-u-1">
              <label htmlFor="name">Name</label>
              <input type="text" name="name" id="name" />
            </div>
            <div className="form-element pure-u-1">
              <label htmlFor="email">Email</label>
              <input type="text" name="email" id="email" />
            </div>
            <div className="form-element pure-u-1">
              <label htmlFor="message">Message</label>
              <textarea name="message" id="message" rows="4"></textarea>
            </div>
            <ul className="actions">
              <li>
                <input type="submit" value="Send"/>
              </li>
            </ul>
          </form>
          <ul className="icons">
            <li>
              <a href="" className="icon fa-twitter">
                <span className="label">Twitter</span>
              </a>
            </li>
            <li>
              <a href="" className="icon fa-facebook">
                <span className="label">Facebook</span>
              </a>
            </li>
          </ul>
        </article>
      </div>
    );
  }
}

export default Contact;
