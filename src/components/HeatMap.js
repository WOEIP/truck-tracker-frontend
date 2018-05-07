import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import { GoogleApiWrapper } from 'google-maps-react';
const GOOGLE_MAPS_API_KEY = 'AIzaSyAe3HlSvyEpC_je3t1UZJVB4tIrhkZwdwo';

import { truckTypes } from './TruckSelection';

class Route {
  constructor(data, opacity=0.3) {
    this.data = data;

    this.poly = null;
    this.opacity = opacity;
    this.color = "blue";
    this.directionsService = null;
    this.directionsRenderer = null;
    this.rendered = false;
  }

  renderRoute(googleMaps, map) {
    let start = {lat: this.data.start.lat, lng: this.data.start.lon},
        end = {lat: this.data.end.lat, lng: this.data.end.lon};

    var self = this;
    console.log(this.rendered);
    if (!this.rendered) {
      self.directionsService = new googleMaps.DirectionsService();
      let request = {
        origin: start, 
        destination: end, 
        travelMode: googleMaps.DirectionsTravelMode.WALKING 
      };
      self.directionsService.route(request, function(result, status) { 
        if (status == 'OK'){
          if (self.directionsRenderer == null) {
            self.directionsRenderer = new googleMaps.DirectionsRenderer({
              polylineOptions: {
                  strokeColor: self.color,
                  strokeOpacity: self.opacity
              },
              suppressMarkers: true, //don't show default directions markers
              preserveViewport: true, //don't move the map window to center on the route
            }); 
            self.directionsRenderer.setMap(map); 
            self.directionsRenderer.setDirections(result); 
          }
          self.rendered = true;
        }
      }); 
    }
  }
}

class MapContainer extends Component {

  constructor(props) {
    super(props);

    this.loadMap = this.loadMap.bind(this);
    this.getDataPoints = this.getDataPoints.bind(this);
    this.renderRoutes = this.renderRoutes.bind(this);

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
  }

  getDataPoints() {
    //initialize this.routes to dummy data points
    let data = [];
    let self = this;
    axios.get('http://localhost:4000/incident')
      .then(res => {
        data = res.data;
        var i;
        for (i = 0; i < data.length; i++) { 
          let d = data[i];

          if (self.isNewDataPoint(d.id)) {
            this.routes.push(new Route(d)); 
          }
        }

        if (self.map != null) {
          this.renderRoutes();
        }
      }).catch(function (error) {
        console.log(error);
      });
    setTimeout(function() {
      self.getDataPoints();
    }, 3000);
  }

  isNewDataPoint(id) {
    for (var i = 0; i < this.routes.length; i++) {
      if (this.routes[i].data.id == id) {
        return false;
      }
    }
    return true;
  }

  renderRoutes() {
    let maps = this.props.google.maps;

    var i;
    for (i = 0; i < this.routes.length; i++) {
      let route = this.routes[i];
      route.renderRoute(maps, this.map);
    }
  }

  loadMap() {
    const mapConfig = {
      center: {
        lat: this.state.currentLocation.lat,
        lng: this.state.currentLocation.lng
      },
      zoom: 16,
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
      self.map.setZoom(16);
    });

    this.renderRoutes();
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
