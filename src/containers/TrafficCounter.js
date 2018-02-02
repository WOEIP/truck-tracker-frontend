import './../sass/counter.scss';

import React from 'react';

class TrafficCounter extends React.Component {
  render (){
    return (
      <div>
        <p >plain</p>
        <p className="colored">colored</p>
      </div>
    );
  }
}

export default TrafficCounter;
