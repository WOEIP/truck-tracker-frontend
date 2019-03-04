//TODO: time arrays, function clean up
//  also change checkbox triggerEvent

//Todo this could be the same component as HeatMap.js

import React, { Component } from 'react';
import L from 'leaflet';
import Flatpickr from 'react-flatpickr';
import axios from 'axios';
var polyline = require('@mapbox/polyline');

import '../styles/leaflet/leaflet.css';

import truck from '../img/truck.png';

const OSRMRootURL = 'http://router.project-osrm.org/match/v1/driving/';

class MapContainer extends Component {

  constructor(props) {
    super(props);

    this.loadMap = this.loadMap.bind(this);
    this.cancel = this.cancel.bind(this);
    this.placeMarker = this.placeMarker.bind(this);
    this.updateTimeTruckSeen = this.updateTimeTruckSeen.bind(this);
    this.confirmDataSubmission = this.confirmDataSubmission.bind(this);
    this.drawRoute = this.drawRoute.bind(this);

    this.state = {
      truckSeenTime: new Date(),
      markersArray: [],
      viewLocation: {
        lat: 37.810652,
        lng: -122.291439
      }, //Oakland
      zoom: 17
    };

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
   if ((!this.props.truckWasMoving && this.state.markersArray.length === 1) ||
       this.state.markersArray.length === 2){
      this.mapOverlay.style.display = "block";
      if (this.state.markersArray.length === 2){
        this.drawRoute(this.state.markersArray[0]._latlng, this.state.markersArray[1]._latlng);
      }
    }
  }

  drawRoute(start, end) {
    // TODO lat or lng, put drawRoute to utils or something
    let URL = OSRMRootURL + start.lng + ',' + start.lat + ';' + end.lng + ',' + end.lat;
    console.log(URL);
    axios.get(URL)
        .then(response => {
          console.log(response.data);
          response.data.matchings.map((r) => L.polyline(polyline.decode(r.geometry)).addTo(this.map));
          return response;
        }).catch(error => {
          console.log(error);
          throw error;
        });
  }

  placeMarker(e) {
    let truckIcon = L.icon({
      iconUrl: truck,
      iconSize: [40, 50]
    });

   if ((this.props.truckWasMoving && this.state.markersArray.length === 1) ||
     this.state.markersArray.length === 0){
       let marker = L.marker([e.latlng.lat, e.latlng.lng], {icon: truckIcon});
       marker.addTo(this.map);
       let newMarkersArray = this.state.markersArray //TODO some nicer method to store these
       newMarkersArray.push(marker);
       this.setState({
         markersArray: newMarkersArray
       });
   }
  }

  cancel() {
    this.mapOverlay.style.display = "none";
    this.state.markersArray.map(marker => this.map.removeLayer(marker));
    this.setState({markersArray: []});

    //Clear the map. TODO: find a mor elegant way
    for(let i in this.map._layers) {
        if(this.map._layers[i]._path != undefined) {
          this.map.removeLayer(this.map._layers[i]);
        }
    }
  }

  updateTimeTruckSeen(time) {
    var unpackedTime = time.time[0]; //from flatpickr format
    this.setState({truckSeenTime: unpackedTime});
  }

  confirmDataSubmission(e) {
    let timeLastSeen = this.state.truckSeenTime;
    let fromPos = this.state.markersArray[0]._latlng;
    let toPos = this.props.truckWasMoving ?
      this.state.markersArray[1]._latlng :
      {lat: 0, lng:0};

    this.props.sendData(e,
      timeLastSeen,
      fromPos,
      toPos,
      this.props.engineWasRunningP,
      this.props.truckWasMovingP);
    this.cancel();
  }

  loadMap() {
    let map = L.map(this.mapTarget).setView(
      [this.state.viewLocation.lat, this.state.viewLocation.lng],
      this.state.zoom
    );

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

    return (
      <div id="jsx-needs-this">
        <p className="map-instructions">
          {mapHeaderText}
        </p>
        <div id="map-wrapper">
          <div id="inner-map-container" ref={(el) => this.mapTarget = el}>
          </div>

          <div ref={(el) => this.mapOverlay = el} id="map-overlay">
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
