import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { GoogleApiWrapper } from 'google-maps-react';

import {getImgOfTruck} from '../components/TruckSelection';
import truck from '../img/truck.png';

let MIN = 0;
let HRS = 1;

let ABS_TIME = 2;
let REL_TIME = 3;

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
    //timeTruckIdling functions
    this.setTimeTruckIdling = this.setTimeTruckIdling.bind(this);
    this.setIdlingTimeUnit = this.setIdlingTimeUnit.bind(this);
    this.toggleTruckIdling = this.toggleTruckIdling.bind(this);

    //timeTruckSeen variables
    this.timeTruckSeen = 0;
    this.timeUnit = MIN;
    this.timeType = ABS_TIME;
    //idling variables
    this.timeIdling = 0;
    this.timeIdlingUnit = MIN;

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
  }

  componentDidMount() {
    this.updateAbsTimeTruckSeen(); //prefill absolute time truck seen with current time
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

  setTimeType(event) { //callback for time <input radio> elements in confirm overlay
    this.timeType = event.target.value; //either ABS_TIME or REL_TIME
    //update this.timeTruckSeen
    if (this.timeType == ABS_TIME) {
      this.updateAbsTimeTruckSeen(false);
    } else { //timeType === REL_TIME
      this.updateRelTimeTruckSeen();
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

    if (this.timeType == ABS_TIME) { //update timeTruckSeen 
      this.timeTruckSeen = currDate;
    }
  }

  updateRelTimeTruckSeen() { //for relative time since truck passed
    if (this.timeType == REL_TIME) {
      let timeSinceSeenInMS = this._timeSinceTruckSeen.value * 60 * 1000; //time should be in min, thus we convert -> ms
      if (this.timeUnit == HRS) {
        timeSinceSeenInMS *= 60;
      }

      let time = (new Date()).getTime() - timeSinceSeenInMS; //time that truck actually passed
      this.timeTruckSeen = new Date(time);
    }
  }

  setTimeUnit(event) { //for relative time of time since truck passed (minutes or hours)
    this.timeUnit = event.target.value;
    this.updateRelTimeTruckSeen(); //since time unit changed, must update timeTruckSeen
  }

  setTimeTruckIdling() { //sets time that truck has been idling
    let time = this._timeTruckIdling.value * 60 * 1000; //time in ms
    if (this.timeIdlingUnit == HRS) {
      time *= 60;
    }

    this.timeIdling = time;
  }

  setIdlingTimeUnit(event) { //time unit of truck idling (MIN or HRS)
    this.timeIdlingUnit = event.target.value;
    this.setTimeTruckIdling(); //since time unit changed, must update timeIdling
  }

  toggleTruckIdling(event) {
    let prevWasChecked = this._truckWasIdling.checked;
    let self = this;

    //since we're setting this click event on <p id="idling_toggle">, we wait 125ms to make sure we don't conflict with the actual checkbox event
    setTimeout(function(){ 
      if (self._truckWasIdling.checked == prevWasChecked) { //if no conflict
        triggerEvent(self._truckWasIdling, "click");
      }
    }, 150);
  }

  confirmDataSubmission(e) {
    let fromPos = this.markersArray[0].getPosition();
    let toPos = this.markersArray[1].getPosition();

    this.props.sendData(e, this.timeTruckSeen, fromPos, toPos, this._truckWasIdling.checked, this.timeIdling);
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

    // =====================
    // Create the search box
    // =====================
    let input = this._pacInput;
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    var searchBox = new google.maps.places.SearchBox((input));

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
      self.map.setZoom(17);
    });
  }

  render() {
    return (
      <div id="jsx-needs-this">
        <p className="map-instructions">
          Set first marker where truck was sighted,
          place second marker where truck was last seen
        </p>
      <div id="map-wrapper">
        <div id="inner-map-container" ref={(el) => this.mapTarget = el}>
          loading map...
          <input id="pac-input" ref={ (el) => this._pacInput = el } placeholder="Enter a location"></input>
        </div>

        <div ref={(el) => this.mapOverlay = el} id="over-map">
          <h3>When did it pass by?</h3>
          <p>
              A <img className="selected_truck_confirm" src={getImgOfTruck(this.props.truckKey)} alt={this.props.truckKey + "truck"}/> passed by <br/><br/>
              <input type="radio" name="time_type" value={ABS_TIME} id={ABS_TIME} checked onChange={this.setTimeType} onMouseDown={this.setTimeType}/>
                  at <input type="time" name="time_truck_seen" ref={ (el) => this._timeTruckSeen = el }
                      onChange={(e) => this.updateAbsTimeTruckSeen(false)}/><br/>
              <input type="radio" name="time_type" value={REL_TIME} id={REL_TIME} onMouseDown={this.setTimeType}/>
                  about <input type="number" min="0" defaultValue="0" ref={ (el) => this._timeSinceTruckSeen = el }
                      onChange={(e) => this.updateRelTimeTruckSeen()}/>
                  <select className="time_unit" onChange={this.setTimeUnit}>
                      <option value={MIN}>mins</option>
                      <option value={HRS}>hrs</option>
                  </select> ago
          </p>

          <div id="was_idling"> 
              <p id="idling_toggle" onMouseDown={this.toggleTruckIdling}>
                  <input type="checkbox" id="truck_was_idling" ref={ (el) => this._truckWasIdling = el }/>
                  <label htmlFor="truck_was_idling">Truck was idling for </label>
              </p>
              <input type="number" min="0" max="60" defaultValue="0" ref={ (el) => this._timeTruckIdling = el }
                  onChange={(e) => this.setTimeTruckIdling()}/>
              <select className="time_unit" onChange={this.setIdlingTimeUnit}>
                  <option value={MIN}>mins</option>
                  <option value={HRS}>hrs</option>
              </select>
          </div>

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
