import React, { Component } from 'react';
import chicken from '../img/mission_chicken.jpg';

class Mission extends Component {
  render() {
    return (
        <article id="mission">
        <h2 className="major">Mission</h2>
        <span className="image main"><img src={chicken} alt="" /></span>
        <p>Our mission is to survey surface streets and estimate traffic
      volumes and routes of medium heavy duty and heavy heavy duty trucks along
      residential streets in West Oakland in order to improve the
      spatial representation of roadway emissions and differentiate
      the contribution of Port versus non-Port trucks. In turn will
      reduce the following: the volume of medium heavy-duty (MHD)
      and heavy heavy-duty (HHD) truck traffic on the residential streets
      of West Oakland, the primary routes of truck travel, the locations
      and duration of truck idling activity, and the vehicle miles
      travelled for trucks within the study area.</p>
        </article>
    );
  }
}

export default Mission;
