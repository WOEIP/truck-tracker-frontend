//TODO: time arrays, function clean up
//  also change checkbox triggerEvent

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

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

    this.cancel = this.cancel.bind(this);
    this.confirmDataSubmission = this.confirmDataSubmission.bind(this);
    this.loadMap = this.loadMap.bind(this);

    //timeTruckSeen functions
    this.setTimeType = this.setTimeType.bind(this);
    this.updateAbsTimeTruckSeen = this.updateAbsTimeTruckSeen.bind(this);
    this.updateRelTimeTruckSeen = this.updateRelTimeTruckSeen.bind(this);
    this.setTimeUnit = this.setTimeUnit.bind(this);

    //TIME_LAST_SEEN = 0, TIME_IDLING = 1, TIME_PARKED = 2
    this.timeUnits = [MIN, MIN, MIN];
    this.timeDur = [0, 0, 0];
    this.timeTypes = [ABS_TIME, REL_TIME, REL_TIME];

    //drawing on the map
    this.markersArray = [];
    this.map = null;
    this.mapTarget = null;
    this.directionsRenderer = null;

    this.audio = null;

    //default to West Oakland coordinates
    let westOaklandCoordinates = {
      lat: 37.806440,
      lng: -122.298261
    };
    let berkeleyCoordinates = {
      lat: 37.8719,
      lng: -122.2585
    };
    var userLocation = berkeleyCoordinates;

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

    this.secondMarkerJSX = <div key="second_marker_prompt" id="second_marker_prompt"
                              ref={ (el) => this._secondMarkerPrompt = el }>
                            Place second marker if you wish to indicate where it was going
                          </div>;
    this.timeJSX = <div key="time" ref={ (el) => this._timeOverlay = el }>
                      <input type="radio" name="time_type" value={ABS_TIME} id={ABS_TIME}
                      checked onChange={this.setTimeType} onMouseDown={this.setTimeType}/>
                        <label htmlFor={ABS_TIME}> at </label><input type="time" name="time_truck_seen" ref={ (el) => this._timeTruckSeen = el }
                          onChange={(e) => this.updateAbsTimeTruckSeen(false)}/><br/>

                      <input type="radio" name="time_type" value={REL_TIME} id={REL_TIME} onMouseDown={this.setTimeType}/>
                        <label htmlFor={REL_TIME}> about </label><input type="number" min="0" defaultValue="0" ref={ (el) => this._timeSinceTruckSeen = el }
                          onChange={(e) => this.updateRelTimeTruckSeen()}/>
                        <select className="time_unit" id={TIME_LAST_SEEN} onChange={this.setTimeUnit}>
                          <option value={MIN}>mins</option>
                          <option value={HRS}>hrs</option>
                        </select> ago
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
    this.state = {
      currentLocation: userLocation,
      overlayJSX: [this.idlingJSX, this.parkedJSX, this.timeJSX, this.secondMarkerJSX]
    };
  }

  componentDidMount() {
    this.updateAbsTimeTruckSeen(); //prefill absolute time truck seen with current time
  }

  componentDidUpdate() {
    console.log("====================updated====================");
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
      this.audio = new Audio('./sounds/engine_idle.mp3');
      this.audio.play();
      this.mapOverlay.style.display = "block";
      this._secondMarkerPrompt.style.display = "block";
    }
    else if (this.markersArray.length === 2) {
      this.audio.pause();
      this.audio = new Audio('./sounds/truck_passby.mp3');
      this.audio.play();
      this._secondMarkerPrompt.style.display = "none";
      this.createRoute();
    }
  }

  cancel() {
    this.audio.pause();
    this.audio = new Audio('./sounds/short_honk.mp3');
    this.audio.play();

    if (this.markersArray.length == 2) { //a route was drawn, remove it
      this.directionsRenderer.setMap(null);
    }
    this.markersArray.map(marker => marker.setMap(null));
    this.markersArray.length = 0;
    this.mapOverlay.style.display = "none";
  }

  setTimeType(event) { //callback for time <input radio> elements in confirm overlay
    this.timeTypes[TIME_LAST_SEEN] = event.target.value; //either ABS_TIME or REL_TIME
    //update this.timeDur[TIME_LAST_SEEN]
    if (this.timeTypes[TIME_LAST_SEEN] == ABS_TIME) {
      this.updateAbsTimeTruckSeen(false);
    } else { //timeType === REL_TIME
      this.updateRelTimeTruckSeen();
    }
  }

  setTimeUnit(event) {
    //TIME_LAST_SEEN: for relative time of time since truck passed (minutes or hours)
    if (event.target.id == TIME_LAST_SEEN) {
      this.timeUnits[TIME_LAST_SEEN] = event.target.value;
      this.updateRelTimeTruckSeen(); //since time unit changed, must update timeTruckSeen
    } else if (event.target.id == TIME_IDLING) {
      //TIME_IDLING: time unit of truck idling (MIN or HRS)
      this.timeUnits[TIME_IDLING] = event.target.value;
      this.setTimeDuration(event); //since time unit changed, must update timeIdling
    } else if (event.target.id == TIME_PARKED) {
      //TIME_PARKED: time unit of truck idling (MIN or HRS)
      this.timeUnits[TIME_PARKED] = event.target.value;
      this.setTimeDuration(event); //since time unit changed, must update timeIdling
    }
  }

  setTimeDuration(event) {
    //TIME_LAST_SEEN
    if (event.target.id == TIME_LAST_SEEN) {
      //updateAbsTimeTruckSeen
      //updateRel...
    } else if (event.target.id == TIME_IDLING) {
      //sets time that truck has been idling
      let time = this._timeTruckIdling.value * 60 * 1000; //time in ms
      if (this.timeUnits[TIME_IDLING] == HRS) {
        time *= 60;
      }

      this.timeDur[TIME_IDLING] = time;
    } else if (event.target.id == TIME_PARKED) {
      //sets time that truck has been parked
      let time = this._timeTruckParked.value * 60 * 1000; //time in ms
      if (this.timeUnits[TIME_PARKED] == HRS) {
        time *= 60;
      }

      this.timeDur[TIME_PARKED] = time;
    }
  }

  updateAbsTimeTruckSeen(setValToCurr=true) { //for absolute time truck passed
    var currDate = new Date();

    if (setValToCurr) { //update <input name="time_truck_seen"> val to current time
      var h = currDate.getHours(),
        m = currDate.getMinutes();
      if (h < 10) {
        h = '0' + h;
      }
      if (m < 10) {
        m = '0' + m;
      }
      this._timeTruckSeen.value = h + ':' + m;
    } else { //get time from user input
      var timeSeen = this._timeTruckSeen.value, //hh:mm
        colon = timeSeen.indexOf(":"),
        hour = timeSeen.substring(0, colon),
        min = timeSeen.substring(colon + 1);

      currDate.setHours(hour);
      currDate.setMinutes(min);
    }

    if (this.timeTypes[TIME_LAST_SEEN] == ABS_TIME) { //update timeTruckSeen
      this.timeDur[TIME_LAST_SEEN] = currDate;
    }
  }

  //func(timeType, time)
  //array timeTypes[], timeUnits[], times[] (for idling time, parked time, timeSeen)
  updateRelTimeTruckSeen() { //for relative time since truck passed
    if (this.timeTypes[TIME_LAST_SEEN] == REL_TIME) {
      let timeSinceSeenInMS = this._timeSinceTruckSeen.value * 60 * 1000; //time should be in min, thus we convert -> ms
      if (this.timeUnits[TIME_LAST_SEEN] == HRS) {
        timeSinceSeenInMS *= 60;
      }

      let time = (new Date()).getTime() - timeSinceSeenInMS; //time that truck actually passed
      this.timeDur[TIME_LAST_SEEN] = new Date(time);
    }
  }

  confirmDataSubmission(e) {
    let fromPos = this.markersArray[0].getPosition();

    let wasIdling = this._truckWasIdling.checked;
    let wasParked = this._truckWasParked.checked;
    let timeIdling = this.timeDur[TIME_IDLING];
    let timeLastSeen = Math.floor(this.timeDur[TIME_LAST_SEEN].getTime() / 1000); //seconds since UNIX EPOCH
    let timeParked = this.timeDur[TIME_PARKED];
    /*Debugging only*/
    let fromVector = "(" + fromPos.lat() + "," + fromPos.lng() + ")";

    if (this.markersArray.length == 1) { //just send idling/parking information of truck
      this.props.sendData(e, timeLastSeen, fromPos, fromPos, wasIdling, timeIdling);
      console.log("A " + this.props.truckKey + " was seen at " + timeLastSeen + " at "
        + fromVector + ". Idling: " + wasIdling + " for " + timeIdling + "ms"
        + ". Parked: " + wasParked + " for " + timeParked + "ms");
    } else { //user gave a truck heading as well
      let toPos = this.markersArray[1].getPosition();
      let toVector = "(" + toPos.lat() + "," + toPos.lng() + ")";
      console.log("A " + this.props.truckKey + " was seen at " + timeLastSeen + " heading " + fromVector + "->" + toVector
              + ". It was idling: " + wasIdling + " for " + timeIdling + "ms");
      this.props.sendData(e, timeLastSeen, fromPos, toPos, wasIdling, timeIdling);
    }

    this.audio.pause();
    this.audio = new Audio('./sounds/honk.mp3');
    this.audio.play();
    this.props.returnToTruckSelection();
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
          A <img className="selected_truck_confirm"
            src={getImgOfTruck(this.props.truckKey)}
            alt={this.props.truckKey + "truck"}/> truck was
          {this.state.overlayJSX}

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
