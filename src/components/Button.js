import React, { Component } from 'react';

class Button extends Component {
  render() {
    return (
      <button type="button"
              onClick={this.props.handler}>{this.props.text}</button>
    );
}

}

export default Button;
