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
        <p className="map-instructions">
          Set first marker where truck was sighted,
          place second marker where truck was last seen
        </p>
        <MapApp {...this.props}/>
        <div className="actions">
          <button onClick={this.props.returnToTruckSelection}>
            Back
          </button>
        </div>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_MAPS_API_KEY
})(MapContainer);
