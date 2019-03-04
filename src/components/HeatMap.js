//TODO: time arrays, function clean up
//  also change checkbox triggerEvent

import axios from 'axios';
import React, { Component } from 'react';
import L from 'leaflet';
var polyline = require('@mapbox/polyline');

import Api from './../utils/Api.js';

import '../styles/leaflet/leaflet.css';

const OSRMRootURL = 'http://router.project-osrm.org/match/v1/driving/';

class HeatMap extends Component {

  constructor(props) {
    super(props);

    this.getData = this.getData.bind(this);
    this.loadMap = this.loadMap.bind(this);
    this.drawRoute = this.drawRoute.bind(this);

    this.map = null;

    this.state = {
      data: [],
      viewLocation: {
        lat: 37.810652,
        lng: -122.291439
      }, //Oakland
      zoom: 16
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

  componentDidUpdate(){
    if (this.state.data.length > 0) {
      this.drawRoute(this.state.data[0].start, this.state.data[0].end);
    }
  }

  drawRoute(start, end) {
    let URL = OSRMRootURL + start.lon + ',' + start.lat + ';' + end.lon + ',' + end.lat;
    console.log(URL);
    axios.get(URL)
        .then(response => {
          console.log(response);
          response.data.matchings.map((m) => L.polyline(polyline.decode(m.geometry)).addTo(this.map));
          return response;
        }).catch(error => {
          console.log(error);
          throw error;
        });
  }

  getData () {
    Api.get('reports').then(response => {
      this.setState({data: response.data});
    });
  }

  loadMap() {
    let map = L.map(this.mapTarget).setView(
      [this.state.viewLocation.lat, this.state.viewLocation.lng],
      this.state.zoom
    );

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    this.getData();

    return map;
  }

  render() {
    return (
      <div id="jsx-needs-this">
        <p className="map-instructions">
          Here you can see our aggregated data from the submissions West Oakland
          residents gave us.
        </p>
        <div id="map-wrapper">
          <div id="inner-map-container" ref={(el) => this.mapTarget = el}>
          </div>
        </div>
      </div>
    );
  }
}

export default HeatMap;
