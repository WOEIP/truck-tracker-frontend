import React, { Component } from 'react';
import TWO_AXLE from './../img/Trucks/2ax.png';
import THREE_AXLE from '../img/Trucks/3ax.png';
import BOBTAIL from '../img/Trucks/3axbob.png';
import FOUR_AXLE from '../img/Trucks/4ax.png';
import FIVE_AXLE from '../img/Trucks/5ax.png';
import SIX_AXLE from '../img/Trucks/6ax.png';
import PORT_CHASSIS from './../img/Trucks/port_chassis.png';
import PORT_CONTAINER from './../img/Trucks/port_container.png';



//The "key" is the value sent to the database, "type" is for human display
var truckTypes = [ 
    {key: '2_AXLE', type:"2-axle", img: TWO_AXLE},
    {key: '3_AXLE', type:"3-axle", img: THREE_AXLE},
    {key: 'BOBTAIL', type:"3-axle Bobtail", img: BOBTAIL},
    {key: '4_AXLE', type:"4-axle", img: FOUR_AXLE},
    {key: '5_AXLE', type:"5-axle", img: FIVE_AXLE},
    {key: '6_PLUS_AXLE', type:"6+ axle", img: SIX_AXLE},
    {key: 'PORT_CHASSIS', type:"port chassis", img: PORT_CHASSIS},
    {key: 'PORT_CONTAINER', type:"port container", img: PORT_CONTAINER}
];

/*
    const TRUCK_TYPES = new Enum([
        '2_AXLE',                              
        'BOBTAIL',
        '3_AXLE',
        '4_AXLE',
        '5_AXLE',
        '6_PLUS_AXLE',
        'PORT_CHASSIS',
        'PORT_CONTAINER',
    ]);

    time: UNIX_TIMESTAMP
*/

class TruckSelection extends Component {
	render() {
        return (
            <ul key="truckTypes" className="actions">
                {truckTypes.map((item) => 
                    <li key={item.key}>
                        <button type="submit" className="truck_select_btn" 
                        	onMouseDown={(e) => this.props.truckSelectHandler(e, item.type, item.key)}>
                            
                            <img className="truck_select_img" src={item.img} alt={item.type} />
                        
                        </button>
                    </li>
                )}
            </ul>
        );
    }
}

export default TruckSelection;