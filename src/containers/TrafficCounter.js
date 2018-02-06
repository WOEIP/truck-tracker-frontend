import React from 'react';

import './../sass/counter.scss';
import truck from './../img/truck.jpg';

import Button from '../components/button.js';

const R = React.createElement;

class TrafficCounter extends React.Component {
  constructor (props){
    super(props);

    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.send = this.send.bind(this);

    this.state= {
      count: 1
    };
  };

  increment(){
    this.setState({
      count: this.state.count + 1
    });
  };

  decrement(){
    this.setState({
      count: this.state.count - 1
    });
  };

  send(){
    console.log('State: ' + this.state.count.toString() + ', sent');
  };

  render (){
    return (
      R('div', null,
        R('p', {'className': 'colored'},
          'State: ' + this.state.count.toString()),
        Button({'handleClick': this.increment, 'label': 'Plus'}),
        Button({'handleClick': this.decrement, 'label': 'Minus'}),
        Button({'handleClick': this.send, 'label': 'Send'}),
       ));
  }
}

export default TrafficCounter;
