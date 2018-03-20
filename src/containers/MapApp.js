import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';

import MapContainer from './MapContainer'; // import child component

const GOOGLE_MAPS_API_KEY = 'AIzaSyB-D3Z23ZfyOZnCh2RVv5QLaWj214DsO-Q';

class MapApp extends Component {
  render() {
    return (
      // Pass the Google Maps props down to the
      // MapContainer component as 'google'
      <div>
        <MapContainer {...this.props}
                      mapHasBeenHidden={this.props.mapHasBeenHidden}/>
        <p className="map_instructions">Set 1st marker where truck was sighted, place 2nd marker where truck was last seen</p>
        <ul className="actions">
          <li><a onMouseDown={this.props.returnToTruckSelection} className="button icon fa-chevron-left">Back</a></li>
        </ul>
      </div>
    );
  }
}
// Exporting the MapApp component WITH the GoogleApiWrapper.
//Pass it down with an object containing API key

export default GoogleApiWrapper({
  apiKey: GOOGLE_MAPS_API_KEY
})(MapApp);