//TODO: time arrays, function clean up
//  also change checkbox triggerEvent

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import flatpickr from 'flatpickr';
import Flatpickr from 'react-flatpickr';

import { GoogleApiWrapper } from 'google-maps-react';

import {getImgOfTruck} from '../components/TruckSelection';
import truck from '../img/truck.png';

const GOOGLE_MAPS_API_KEY = 'AIzaSyB-D3Z23ZfyOZnCh2RVv5QLaWj214DsO-Q';

class MapContainer extends Component {

  constructor(props) {
    super(props);

    this.loadMap = this.loadMap.bind(this);
    this.cancel = this.cancel.bind(this);
    this.updateTimeTruckSeen = this.updateTimeTruckSeen.bind(this);
    this.confirmDataSubmission = this.confirmDataSubmission.bind(this);

    this.state = {
      truckSeenTime: new Date(),
      markersArray: [],
      location: {
        lat: 37.8719,
        lng: -122.2585
      } //Berkeley
    };


    //drawing on the map
    this.map = null;
    this.mapTarget = null;
    this.directionsRenderer = null;


    //TODO: HTTPS is needed I guess
    // if (navigator && navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(pos => {
    //     userLocation = {
    //       lat: pos.coords.latitude,
    //       lng: pos.coords.longitude
    //     };
    //   }),
    //   err => {console.log(`ERROR(${err.code}): ${err.message}`);};
    // };

  }

  componentDidUpdate() {
    this.loadMap();
    if ((this.state.markersArray.length == 2)){
      this.mapOverlay.style.display = "block";
      this.createRoute();
    }
  }

  createRoute() {
    var maps = this.props.google.maps;

    let self = this;
    let directionsService = new maps.DirectionsService();
      directionsService.route({
        origin: this.state.markersArray[0].getPosition(),
        destination: this.state.markersArray[1].getPosition(),
        travelMode: maps.DirectionsTravelMode.WALKING
      }, function(result) {
        self.directionsRenderer = new maps.DirectionsRenderer({
          polylineOptions: {
              strokeColor: '#8aa4d0',
              strokeOpacity: 1.0,
              strokeWeight: 8
          },
          suppressMarkers: true, //don't show default directions markers
          preserveViewport: true //don't move the map window to center on the route
        });
        self.directionsRenderer.setMap(self.map);
        self.directionsRenderer.setDirections(result);
      });
  }

  placeMarker(pos) {
     if ((this.state.markersArray.length < 2)){
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
      var newMarkersArray = this.state.markersArray.concat(marker);
      if (!this.props.truckWasMoving) {
        newMarkersArray = newMarkersArray.concat(marker);
      }
      this.setState({markersArray: newMarkersArray});
    } else {
      this.mapOverlay.style.display = "block";
      this.createRoute();
    }
  }

  cancel() {
    if (this.state.markersArray.length == 2) {
      this.directionsRenderer.setMap(null);
    }
    this.mapOverlay.style.display = "none";
    this.setState({markersArray: []});
  }

  //TODO this rerenders the whole map, not good
  updateTimeTruckSeen(time) {
    var unpackedTime = time.time[0]; //from flatpickr format
    this.setState({truckSeenTime: unpackedTime});
  }

  confirmDataSubmission(e) {
    //TODO let vs var?
    let timeLastSeen = this.state.truckSeenTime;
    let fromPos = this.state.markersArray[0].getPosition();
    let toPos = this.markersArray[1].getPosition();
    let wasIdling = !this.props.truckWasMoving && this.propsEngineWasRunning;
    let timeIdling = 0;

    //let wasParked = !this.props.truckWasMoving && this.propsEngineWasRunning;
    //TODO: review DB schema

    this.props.sendData(e, timeLastSeen, fromPos, toPos, wasIdling, timeIdling);

    this.props.returnToTruckSelection();
  }

  loadMap() {
    const mapConfig = {
      center: {
        lat: this.state.location.lat,
        lng: this.state.location.lng
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

    const curr = this.state.location;
    if (this.map) {
      let center = new this.props.google.maps.LatLng(curr.lat, curr.lng);
      this.map.panTo(center);
      this.map.setZoom(16);
    }

    let input = this._pacInput;
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var searchBox = new google.maps.places.SearchBox((input));
    this._pacInput.style.display = "block";

    // Bias the SearchBox results towards current map's viewport.
    let self = this;
    this.map.addListener('bounds_changed', function() {
      searchBox.setBounds(self.map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction (loc) and center map on that loc
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
          return;
      }

      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      self.map.fitBounds(bounds);
      self.map.setZoom(15);
    });
  }

  render() {
    var mapHeaderText =  `Click on map to set marker where truck was stopped`;
    if(this.props.truckWasMoving){
      mapHeaderText =  `Click on map to set first marker
                          where you saw the truck, place a second
                          marker where truck was last seen`;
    }
    return (
      <div id="jsx-needs-this">
        <p className="map-instructions">
          {mapHeaderText}
        </p>
        <div id="map-wrapper">
          <div id="inner-map-container" ref={(el) => this.mapTarget = el}>
            loading map...
            <input id="pac-input" ref={ (el) => this._pacInput = el }/>
          </div>

          <div ref={(el) => this.mapOverlay = el} id="over-map">
            The vehicle was sighted at
            <Flatpickr
              options={{
                enableTime: true,
                noCalendar: true,
              dateFormat: "H:i"}}
              onChange = {time => { this.updateTimeTruckSeen({time}); }}/>

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
            <button onClick={this.props.goBack}>
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function triggerEvent(el, type) {
  if ((el[type] || false) && typeof el[type] == 'function') {
    el[type](el);
  }
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_MAPS_API_KEY
})(MapContainer);
