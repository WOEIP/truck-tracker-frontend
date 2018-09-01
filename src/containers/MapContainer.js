//TODO: time arrays, function clean up
//  also change checkbox triggerEvent

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import flatpickr from 'flatpickr';
import Flatpickr from 'react-flatpickr';

import { GoogleApiWrapper } from 'google-maps-react';

import {getImgOfTruck} from '../components/TruckSelection';
import truck from '../img/truck.png';

let MIN = 0;
let HRS = 1;

let ABS_TIME = 7;
let REL_TIME = 8;

const TIME_LAST_SEEN = 0,
      TIME_IDLING = 1,
      TIME_PARKED = 2;

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
      engineWasRunning: false,
      location: {
        lat: 37.8719,
        lng: -122.2585
      } //Berkeley
    };


    //drawing on the map
    this.markersArray = [];
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


    this.secondMarkerJSX = <div key="second_marker_prompt" id="second_marker_prompt"
                              ref={ (el) => this._secondMarkerPrompt = el }>
                            Place second marker if you wish to indicate where it was going
                          </div>;
    this.parkedJSX = <div key="parked">
                      <input type="checkbox" id="truck_was_parked" ref={ (el) => this._truckWasParked = el }/>
                        <label htmlFor="truck_was_parked">parked for </label>
                      <input type="number" id={TIME_PARKED} min="0" max="60"
                        defaultValue="0" ref={ (el) => this._timeTruckParked = el }
                        onChange={(e) => this.setTimeDuration(e)}/>
                      <select className="time_unit" id={TIME_PARKED} onChange={this.setTimeUnit}>
                        <option value={MIN}>mins</option>
                        <option value={HRS}>hrs</option>
                      </select>
                  </div>;
    this.idlingJSX = <div key="idling" id="was_idling">
                      <input type="checkbox" id="truck_was_idling" ref={ (el) => this._truckWasIdling = el }/>
                        <label htmlFor="truck_was_idling">idling for </label>
                      <input type="number" id={TIME_IDLING} min="0" max="60"
                        defaultValue="0" ref={ (el) => this._timeTruckIdling = el }
                        onChange={(e) => this.setTimeDuration(e)}/>
                      <select className="time_unit" id={TIME_IDLING} onChange={this.setTimeUnit}>
                        <option value={MIN}>mins</option>
                        <option value={HRS}>hrs</option>
                      </select>
                    </div>;

  }

  componentDidMount() {
    this.setState({
       truckSeenTime: new Date()
    });
  }

  componentDidUpdate() {
    this.loadMap();
  }

  createRoute() {
    var maps = this.props.google.maps;

    let self = this;
    let directionsService = new maps.DirectionsService();
      directionsService.route({
        origin: this.markersArray[0].getPosition(),
        destination: this.markersArray[1].getPosition(),
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
    if (this.markersArray.length === 1) {
      this.mapOverlay.style.display = "block";
    }
    else if (this.markersArray.length === 2) {
      this.createRoute();
    }
  }

  cancel() {
    if (this.markersArray.length == 2) { //a route was drawn, remove it
      this.directionsRenderer.setMap(null);
    }
    this.markersArray.map(marker => marker.setMap(null));
    this.markersArray.length = 0;
    this.mapOverlay.style.display = "none";
  }

  updateTimeTruckSeen(time) {
    var unpackedTime = time.time[0]; //from flatpickr format
    this.setState({truckSeenTime: unpackedTime});
  }

  confirmDataSubmission(e) {

    let fromPos = this.markersArray[0].getPosition();

    let wasIdling = this._truckWasIdling.checked;
    let wasParked = this._truckWasParked.checked;
    let timeIdling = this.timeDur[TIME_IDLING];
    let timeLastSeen = Math.floor(this.timeDur[TIME_LAST_SEEN].getTime() / 1000);
    let timeParked = this.timeDur[TIME_PARKED];

    if (this.markersArray.length == 1) { //just send idling/parking information of truck
      this.props.sendData(e, timeLastSeen, fromPos, fromPos, wasIdling, timeIdling);
    } else { //user gave a truck heading as well
      let toPos = this.markersArray[1].getPosition();
      let toVector = "(" + toPos.lat() + "," + toPos.lng() + ")";
      this.props.sendData(e, timeLastSeen, fromPos, toPos, wasIdling, timeIdling);
    }

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
    console.log(this.state.truckSeenTime.getHours());
    console.log(this.state.truckSeenTime.getMinutes());
    return (
      <div id="jsx-needs-this">
        <p className="map-instructions">
          Click on map to set 1st marker where truck was sighted,
          place a 2nd marker where truck was last seen
        </p>
        <div id="map-wrapper">
          <div id="inner-map-container" ref={(el) => this.mapTarget = el}>
            loading map...
            <input id="pac-input" ref={ (el) => this._pacInput = el } placeholder="Enter a location" style={{display: "none"}}></input>
          </div>

          <div ref={(el) => this.mapOverlay = el} id="over-map">
            The vehicle was sighted at
          <Flatpickr
            options={{
              enableTime: true,
              noCalendar: true,
              dateFormat: "H:i"}}
            onChange = {time => { this.updateTimeTruckSeen({time}); }}
          />

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
