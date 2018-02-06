import React from 'react';

import './../sass/counter.scss';
import truck from './../img/truck.jpg';

import Button from '../components/button.js';

const R = React.createElement;

class TrafficCounter extends React.Component {
  constructor (props){
    super(props);
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
        Button({'handleClick': this.increment.bind(this), 'label': 'Plus'}),
        Button({'handleClick': this.decrement.bind(this), 'label': 'Minus'}),
        Button({'handleClick': this.send.bind(this), 'label': 'Send'}),
       ));
  }
}

export default TrafficCounter;
