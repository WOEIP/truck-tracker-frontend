import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { GoogleApiWrapper } from 'google-maps-react';

import truck from '../img/truck.png';

const GOOGLE_MAPS_API_KEY = 'AIzaSyB-D3Z23ZfyOZnCh2RVv5QLaWj214DsO-Q';

class MapContainer extends Component {

  constructor(props) {
    super(props);

    this.cancel = this.cancel.bind(this);
    this.confirmDataSubmission = this.confirmDataSubmission.bind(this);
    this.loadMap = this.loadMap.bind(this);
    this.setTimeSinceTruckPassed = this.setTimeSinceTruckPassed.bind(this);

    //default to West Oakland coordinates
    var userLocation = {
        lat: 37.806440,
        lng: -122.298261
    };

    //TODO: HTTPS is needed I guess
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        userLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
      }),
      err => {console.log(`ERROR(${err.code}): ${err.message}`);};
    };

    this.state = {
      currentLocation: userLocation
    };

    this.markersArray = [];
    this.map = null;
    this.mapTarget = null;
    this.poly = null;
    this.timeSinceTruckPassed = 0;
  }

  componentDidUpdate() {
      this.loadMap();
  }

  createRoute() {
    var maps = this.props.google.maps;
    var path = new maps.MVCArray();
    var service = new maps.DirectionsService();
    this.poly = new maps.Polyline({
      map: this.map,
      strokeColor: '#8aa4d0',
      strokeOpacity: 1.0,
      strokeWeight: 8
    });

    service.route({
      origin: this.markersArray[0].getPosition(),
      destination: this.markersArray[1].getPosition(),
      travelMode: maps.DirectionsTravelMode.WALKING
    }, function(result, status) {
      //TODO error handling in general
      if (status === maps.DirectionsStatus.OK) {
        result.routes[0].overview_path.map(pos => path.push(pos));
      }
    });

    this.poly.setPath(path);
  }

  placeMarker(pos) {
    if (this.markersArray.length < 2) {
      const marker = new this.props.google.maps.Marker({
        position: {
          lat: pos.lat(),
          lng: pos.lng()
        },
        map: this.map,
        icon: {
          url: truck,
          scaledSize: new this.props.google.maps.Size(32, 32)
        }
      });

      this.markersArray.push(marker);
    }
    if (this.markersArray.length === 2) {
      this.createRoute();
      this.mapOverlay.style.display = "block";
    }
  }

  cancel() {
    this.markersArray.map(marker => marker.setMap(null));
    this.markersArray.length = 0;
    this.poly.setMap(null);
    this.mapOverlay.style.display = "none";
  }

  setTimeSinceTruckPassed(event) {
    this.timeSinceTruckPassed = event.target.value;
  }

  confirmDataSubmission(e) {
    let fromPos = this.markersArray[0].getPosition();
    let toPos = this.markersArray[1].getPosition();

    let time = this.timeSinceTruckPassed;
    if (this.timeUnit === "hours") {
      time *= 60;
    }
    this.props.sendData(e, time, fromPos, toPos);
  }

  loadMap() {
    const mapConfig = {
      center: {
        lat: this.state.currentLocation.lat,
        lng: this.state.currentLocation.lng
      },
      zoom: 14,
      clickableIcons: false,
      streetViewControl: false,
      mapTypeControl: false
    };

    this.map = new this.props.google.maps.Map(this.mapTarget, mapConfig);

    this.map.addListener('click', e => {
      this.placeMarker(e.latLng);
    });

    const curr = this.state.currentLocation;
    if (this.map) {
      let center = new this.props.google.maps.LatLng(curr.lat, curr.lng);
      this.map.panTo(center);
    }
  }

  render() {
    return (
      <div id="map-wrapper">
        <p className="map-instructions">
          Set first marker where truck was sighted,
          place second marker where truck was last seen
        </p>
        <div id="inner-map-container" ref={(el) => this.mapTarget = el}>
          loading map...
        </div>
        <div ref={(el) => this.mapOverlay = el} id="over-map">
          <p>A {this.props.truckText} truck passed by</p>
          <input
            type="number"
            min="0"
            defaultValue="0"
            onChange={this.setTimeSinceTruckPassed}/>
            <p>minutes ago</p>
          <div className="actions">
            <button onClick={this.confirmDataSubmission}
                    className="confirm-button">
                      Confirm
            </button>
            <button onClick={this.cancel}
                    className="cancel-button">
                      Cancel
            </button>
           </div>
         </div>
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
