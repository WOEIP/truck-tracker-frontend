import './../sass/counter.scss';
import truck from './../img/truck.jpg';

import React from 'react';

class TrafficCounter extends React.Component {
  render (){
    return (
      <div>
        <p >plain</p>
        <p className="colored">colored</p>
        <img src = {truck}/>
      </div>
    );
  }
}

export default TrafficCounter;
