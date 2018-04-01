import React, { Component } from 'react';

import TWO_AXLE from './../img/Trucks/2ax.png';
import THREE_AXLE from '../img/Trucks/3ax.png';
import BOBTAIL from '../img/Trucks/3axbob.png';
import FOUR_AXLE from '../img/Trucks/4ax.png';
import FIVE_AXLE from '../img/Trucks/5ax.png';
import SIX_AXLE from '../img/Trucks/6ax.png';
import PORT_CHASSIS from './../img/Trucks/port_chassis.png';
import PORT_CONTAINER from './../img/Trucks/port_container.png';

import '../styles/truck-selection.scss';

import '../styles/pure-release-1.0.0/pure-min.css';
import '../styles/pure-release-1.0.0/grids-responsive.css';

//The "key" is the value sent to the database, "type" is for human display
const truckTypes = [
  {key: '2_AXLE', type:"2-axle", img: TWO_AXLE},
  {key: '3_AXLE', type:"3-axle", img: THREE_AXLE},
  {key: 'BOBTAIL', type:"3-axle Bobtail", img: BOBTAIL},
  {key: '4_AXLE', type:"4-axle", img: FOUR_AXLE},
  {key: '5_AXLE', type:"5-axle", img: FIVE_AXLE},
  {key: '6_PLUS_AXLE', type:"6+ axle", img: SIX_AXLE},
  {key: 'PORT_CHASSIS', type:"port chassis", img: PORT_CHASSIS},
  {key: 'PORT_CONTAINER', type:"port container", img: PORT_CONTAINER}
];


class TruckSelection extends Component {

  //TODO check if this optimization actually works (named callback)
  truckSelectHandler(truck){
    return () => this.props.truckSelectHandler(truck);
  }

  render() {
    return (
      <div>
        <h2>Select truck type</h2>
        <ul className="pure-g">
          {truckTypes.map((item) =>
            <li key={item.key}
                className="pure-u-1 pure-u-sm-1-2 button-container">
          {/*TODO pure-u-sm-* dynamic based on no. of trucks?*/}
             <input  onClick={this.truckSelectHandler(item)}
                     type="image"
                     src={item.img}/>
            </li>
          )}
      </ul>
    </div>
    );
  }
}

export default TruckSelection;
