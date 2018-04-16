import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { GoogleApiWrapper } from 'google-maps-react';
const GOOGLE_MAPS_API_KEY = 'AIzaSyB-D3Z23ZfyOZnCh2RVv5QLaWj214DsO-Q';

import { truckTypes } from './TruckSelection';

//dummy data
let data = [
  {truckType: truckTypes[0]['key'], startLat: 37.868731, startLon: -122.259224, endLat: 37.861615, endLon: -122.267035, reportedAt: Date.now(), idlingDuration: null},
  {truckType: truckTypes[0]['key'], startLat: 37.868731, startLon: -122.259224, endLat: 37.861615, endLon: -122.267035, reportedAt: Date.now(), idlingDuration: null},
];

class Route {
  constructor(data, opacity=0.1) {
    this.data = data;

    this.poly = null;
    this.opacity = opacity;
    this.color = "blue";
  }
}

class MapContainer extends Component {

  constructor(props) {
    super(props);

    this.loadMap = this.loadMap.bind(this);
    this.getDataPoints = this.getDataPoints.bind(this);
    this.renderRoutes = this.renderRoutes.bind(this);

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

    this.map = null;
    this.mapTarget = null;
    this.routes = [];
  }

  componentDidMount() {
    this.getDataPoints();
  }

  componentDidUpdate() {
    this.loadMap();
    this.renderRoutes();
  }

  getDataPoints() {
    //initialize this.routes to dummy data points
    var i;
    for (i = 0; i < data.length; i++) { 
      let d = data[i];
      this.routes.push(new Route(d))
    }
  }

  renderRoutes() {
    let maps = this.props.google.maps;

    var i;
    var self = this;
    for (i = 0; i < this.routes.length; i++) {
      let route = this.routes[i];

      console.log(route);
      let start = {lat: route.data.startLat, lng: route.data.startLon},
          end = {lat: route.data.endLat, lng: route.data.endLon};
      let directionsService = new maps.DirectionsService();
      directionsService.route({ 
        origin: start, 
        destination: end, 
        travelMode: maps.DirectionsTravelMode.WALKING 
      }, function(result) { 
        let directionsRenderer = new maps.DirectionsRenderer({
          polylineOptions: {
              strokeColor: route.color,
              strokeOpacity: route.opacity
          },
          suppressMarkers: true,
        }); 
        directionsRenderer.setMap(self.map); 
        directionsRenderer.setDirections(result); 
      }); 
      /*var path = new maps.MVCArray();
      var service = new maps.DirectionsService();
      route.poly = new maps.Polyline({
        map: this.map,
        strokeColor: '#8aa4d0',
        strokeOpacity: route.opacity,
        strokeWeight: 8
      });

      service.route({
        origin: {lat: route.data.startLat, lng: route.data.startLon},
        destination: {lat: route.data.endLat, lng: route.data.endLon},
        travelMode: maps.DirectionsTravelMode.WALKING
      }, function(result, status) {
        //TODO error handling in general
        if (status === maps.DirectionsStatus.OK) {
          result.routes[0].overview_path.map(pos => path.push(pos));
        }
      });

      route.poly.setPath(path);*/
    }
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
      self.map.setZoom(17);
    });
  }

  render() {
    return (
      <div id="jsx-needs-this">
        <div id="map-wrapper">
          <div id="inner-map-container" ref={(el) => this.mapTarget = el}>
            loading map...
            <input id="pac-input" ref={ (el) => this._pacInput = el } placeholder="Enter a location" style={{display: "none"}}></input>
          </div>
        </div>
     </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_MAPS_API_KEY
})(MapContainer);
