import React, { Component } from 'react';

import AC_BUS from '../img/Trucks/ac_bus.png';
import TWO_AXLE from '../img/Trucks/2ax.png';
import THREE_AXLE from '../img/Trucks/3ax.png';
import BOBTAIL from '../img/Trucks/3axbob.png';
import FOUR_AXLE from '../img/Trucks/4ax.png';
import FIVE_AXLE from '../img/Trucks/5ax.png';
import SIX_AXLE from '../img/Trucks/6ax.png';
import PORT_CHASSIS from '../img/Trucks/port_chassis.png';
import PORT_CONTAINER from '../img/Trucks/port_container.png';

import '../styles/truck-selection.scss';

import '../styles/pure-release-1.0.0/pure-min.css';
import '../styles/pure-release-1.0.0/grids-responsive.css';

export const truckTypes = [
  {key: 'AC_BUS', tooltip:"AC bus", img: AC_BUS},
  {key: '2_AXLE', tooltip:"2-axle", img: TWO_AXLE},
  {key: '3_AXLE', tooltip:"3-axle", img: THREE_AXLE},
  {key: 'BOBTAIL', tooltip:"3-axle Bobtail", img: BOBTAIL},
  {key: '4_AXLE', tooltip:"4-axle", img: FOUR_AXLE},
  {key: '5_AXLE', tooltip:"5-axle", img: FIVE_AXLE},
  {key: '6_PLUS_AXLE', tooltip:"6+ axle", img: SIX_AXLE},
  {key: 'PORT_CHASSIS', tooltip:"Port chassis", img: PORT_CHASSIS},
  {key: 'PORT_CONTAINER', tooltip:"Port container", img: PORT_CONTAINER}
];

export function getImgOfTruck(truckKey) {
    var i;
    var truck;
    for (i = 0; i < truckTypes.length; i++) {
        truck = truckTypes[i];
        if (truck.key === truckKey) {
            return truck.img;
        }
    }
    return truckTypes[0].img;
}

class TruckSelection extends Component {

  //TODO check if this optimization actually works (named callback)
  selectTruck(truck){
    return this.props.selectTruck(truck);
  }

  render() {
    return (
      <div>
        <h2>Select truck type</h2>
        <ul className="pure-g truck-grid">
          {truckTypes.map((item) =>
            <li key={item.key}
                title={item.tooltip} //HTML tooltip with :hover?
                className="pure-u-1 pure-u-sm-1-2 button-container">
          {/*TODO pure-u-sm-* dynamic based on no. of trucks?*/}
             <input  onClick={(e) => this.selectTruck(item)}
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
