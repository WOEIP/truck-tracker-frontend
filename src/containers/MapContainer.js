import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';

import MapApp from './MapApp';

const GOOGLE_MAPS_API_KEY = 'AIzaSyB-D3Z23ZfyOZnCh2RVv5QLaWj214DsO-Q';

class MapContainer extends Component {
  render() {
    return (
      // Pass the Google Maps props down to the
      // MapContainer component as 'google'
      <div>
        <MapApp {...this.props}/>
        <p className="map_instructions">
          Set 1st marker where truck was sighted,
          place 2nd marker where truck was last seen
        </p>
        <ul className="actions">
          <li>
            <a onMouseDown={this.props.returnToTruckSelection}
                 className="button icon fa-chevron-left">
            Back
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_MAPS_API_KEY
})(MapContainer);
