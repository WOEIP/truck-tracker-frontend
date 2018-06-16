import React, { Component } from 'react';

class IdlingOrMoving extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div id="jsx-needs-this">
        <button onClick={() => this.props.setMotion(false)}>
          Idling or parking
        </button>
        <button onClick={() => this.props.setMotion(true)}>
          Moving
        </button>
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
