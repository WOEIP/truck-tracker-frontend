//TODO: time arrays, function clean up
//  also change checkbox triggerEvent

import React, { Component } from 'react';
//import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Flatpickr from 'react-flatpickr';

import '../styles/leaflet/leaflet.css';

import truck from '../img/truck.png';

class MapContainer extends Component {

  constructor(props) {
    super(props);

    this.loadMap = this.loadMap.bind(this);
    this.cancel = this.cancel.bind(this);
    this.placeMarker = this.placeMarker.bind(this);
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

  componentDidMount(){
      this.map = this.loadMap();
  }

  componentDidUpdate() {
    if ((this.state.markersArray.length == 2)){
      this.mapOverlay.style.display = "block";
      this.createRoute();
    }
  }

  createRoute() {
  }

  placeMarker(e) {
    console.log(e.latlng);

    let truckIcon = L.icon({
      iconUrl: '../img/truck.png',

      iconSize:     [38, 95], // size of the icon
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    L.marker([e.latlng.lat, e.latlng.lng], {icon: truckIcon}).addTo(this.map);

    // if ((this.state.markersArray.length < 2)){
    //   this.setState({markersArray: newMarkersArray});
    // }
  }

  cancel() {
    this.state.markersArray[0].setMap(null);
    this.state.markersArray[1].setMap(null);
    this.directionsRenderer.setMap(null);
    this.mapOverlay.style.display = "none";
    this.setState({markersArray: []});
  }

  updateTimeTruckSeen(time) {
    var unpackedTime = time.time[0]; //from flatpickr format
    this.setState({truckSeenTime: unpackedTime});
  }

  confirmDataSubmission(e) {
    let timeLastSeen = this.state.truckSeenTime;
    let fromPos = this.state.markersArray[0].getPosition();
    let toPos = this.state.markersArray[1].getPosition();
    let wasIdling = !this.props.truckWasMoving && this.propsEngineWasRunning;
    let timeIdling = 0;

    //let wasParked = !this.props.truckWasMoving && this.propsEngineWasRunning;
    //TODO: review DB schema

    this.props.sendData(e, timeLastSeen, fromPos, toPos, wasIdling, timeIdling);

    //this.props.returnToTruckSelection();
  }

  loadMap() {
    let map = L.map(this.mapTarget).setView([51.505, -0.09], 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

    map.on('click', this.placeMarker);
    return map;
  }

  render() {
    let mapHeaderText =  `Click on map to set marker where truck was stopped`;
    if(this.props.truckWasMoving){
      mapHeaderText =  `Click on map to set first marker
                          where you saw the truck, place a second
                          marker where truck was last seen`;
    }

    const position = [this.state.location.lat, this.state.location.lng]

    return (
      <div id="jsx-needs-this">
        <p className="map-instructions">
          {mapHeaderText}
        </p>
        <div id="map-wrapper">
          <div id="inner-map-container" ref={(el) => this.mapTarget = el}>
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

export default MapContainer;
