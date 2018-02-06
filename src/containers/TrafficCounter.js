import React from 'react';

import './../sass/counter.scss';
import truck from './../img/truck.jpg';

import Button from '../components/button.js';

const R = React.createElement;

class TrafficCounter extends React.Component {
  buttonHandler(){
    console.log('yay');
  };

  render (){
    return (
      R('div', null,
       R('p', {'className': 'colored'}, 'hey'),
        Button({'handleClick': this.increment, 'label': 'Plus'})));
  }
}

export default TrafficCounter;
