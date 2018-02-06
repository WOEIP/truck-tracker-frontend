import React from 'react';

import './../sass/counter.scss';
import truck from './../img/truck.jpg';

import Button from '../components/button.js';

class TrafficCounter extends React.Component {
  buttonHandler(){
    console.log('yay');
  };

  render (){
    return (
        <div>
        <p>plain</p>
        <p className="colored">colored</p>
        <img src = {truck}/>
        <Button handleClick={this.buttonHandler} label='Press meee'/>
        </div>
    );
  }
}

export default TrafficCounter;
