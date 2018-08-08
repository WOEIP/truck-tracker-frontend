import React, { Component } from 'react';

import '../styles/idling-or-moving.scss';

class IdlingOrMoving extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div id="jsx-needs-this">
        <div id="movement-button-container">
          <button onClick={() => this.props.setMotion(false)}>
            Idling or parking
          </button>
          <button onClick={() => this.props.setMotion(true)}>
            Moving
          </button>
        </div>
        <div className="actions">
          <button onClick={this.props.goBack}>
            Back
          </button>
        </div>
      </div>
    );
  }
}

export default IdlingOrMoving;
