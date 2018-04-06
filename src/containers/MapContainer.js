import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { GoogleApiWrapper } from 'google-maps-react';

import truck from '../img/truck.png';

const GOOGLE_MAPS_API_KEY = 'AIzaSyB-D3Z23ZfyOZnCh2RVv5QLaWj214DsO-Q';

class MapContainer extends Component {

  constructor(props) {
    super(props);

    this.recenterMap = this.recenterMap.bind(this);
    this.centerMapOnUser = this.centerMapOnUser.bind(this);
    this.clearMarkers = this.clearMarkers.bind(this);
    this.confirmDataSubmission = this.confirmDataSubmission.bind(this);
    this.setTimeSinceTruckPassed = this.setTimeSinceTruckPassed.bind(this);

    this.state = {
      currentLocation: {
        //Berkeley coordinates
        lat: 37.8719,
        lng: -122.2585
      }
    };
    this.timeSinceTruckPassed = 0;
    this.timeUnit = "minutes";
  }

  componentDidUpdate() {
      this.loadMap();
  }

  centerMapOnUser() {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = pos.coords;
        this.setState({
          currentLocation: {
            lat: coords.latitude,
            lng: coords.longitude
          }
        });
        this.recenterMap();
      });
    }
  }

  recenterMap() {
    const curr = this.state.currentLocation;

    const {google} = this.props;

    if (this.map) {
      let center = new google.maps.LatLng(curr.lat, curr.lng);
      this.map.panTo(center);
      this.map.setZoom(18);
    }
  }

  recordVectorPt(lat, lng) {
    if (this.numMarkersPlaced < 2) {
      this.placeMarker(lat, lng);
      this.numMarkersPlaced++;
    }

    if (this.numMarkersPlaced === 2) {
      this.createRoute();
      this._mapOverlay.style.display = "block";
    }
  }

  createRoute() {
    const {google} = this.props;
    var path = new google.maps.MVCArray();
    var service = new google.maps.DirectionsService();
    this.poly = new google.maps.Polyline({
      map: this.map,
      strokeColor: '#FF8200',
      strokeOpacity: 1.0,
      strokeWeight: 8
    });

    //assume markersArray has 2 markers
    var src = this.markersArray[0].getPosition();
    var des = this.markersArray[1].getPosition();
    path.push(src);
    this.poly.setPath(path);
    service.route({
      origin: src,
      destination: des,
      travelMode: google.maps.DirectionsTravelMode.WALKING
    }, function(result, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
          path.push(result.routes[0].overview_path[i]);
        }
      }
    });
  }

  placeMarker(lat, lng) {
    const {google} = this.props; // should be valid because loadMap is always called before this function

    // creates a new Google maps Marker object.
    const marker = new google.maps.Marker({
      position: {
        lat: lat,
        lng: lng
      }, // sets position of marker to specified location
      map: this.map, // sets markers to appear on the map we created
      icon: {
        url: truck,
        scaledSize: new google.maps.Size(32, 32)
      }
      //title: location.name //appears on hover over marker
    });

    if (this.markersArray) {
      this.markersArray[this.numMarkersPlaced] = marker;
    } else {
      this.markersArray = [marker];
    }
  }

  clearMarkers() {
    for (var i = 0; i < this.markersArray.length; i++) {
      this.markersArray[i].setMap(null);
    }

    this.markersArray.length = 0;
    this.poly.setMap(null); //remove the route from map as well
    this._mapOverlay.style.display = "none";
    this.numMarkersPlaced = 0;
  }

  setTimeSinceTruckPassed(event) {
    this.timeSinceTruckPassed = event.target.value;
  }

  confirmDataSubmission(e) {
    let fromPos = this.markersArray[0].getPosition();
    let toPos = this.markersArray[0].getPosition();

    let time = this.timeSinceTruckPassed;
    if (this.timeUnit === "hours") {
      time *= 60;
    }
    this.props.sendData(e, time, fromPos, toPos);
  }

  loadMap() {
   // checks to make sure that props have been passed
    if (this.props && this.props.google) {
      // sets props equal to google
      const {google} = this.props;
      // sets maps to google maps props
      const maps = google.maps;
      // looks for HTML div ref 'map'. Returned in render below.
      const mapRef = this._map;
      // finds the 'map' div in the React DOM, names it node
      const node = ReactDOM.findDOMNode(mapRef);
      // sets center of google map to NYC.
      const mapConfig = Object.assign({}, {
        center: {
          lat: this.state.currentLocation.lat,
          lng: this.state.currentLocation.lng
        },
        // sets zoom. Lower numbers are zoomed further out.
        zoom: 16,
        // optional main map layer. Terrain, satellite, hybrid or roadmap
        //if unspecified, defaults to roadmap.
        mapTypeId: 'roadmap',
        // don't display clickable landmarks (so annoying when scrolling)
        clickableIcons: false
      });

      // creates a new Google map on the specified node (ref='map')
      // with the specified configuration set above.
      this.map = new maps.Map(node, mapConfig);

      // ================
      // listen for click
      // ================
      this.numMarkersPlaced = 0;
      var self = this;
      this.map.addListener('click', function(e) {
        var lat = e.latLng.lat();
        var lng = e.latLng.lng();
        self.recordVectorPt(lat, lng);
      });
    }
  }

  render() {
    // in our return function you must return a div with ref='map' and style.
    return (
      <div id="map-wrapper">
        <p className="map-instructions">
          Set first marker where truck was sighted,
          place second marker where truck was last seen
        </p>
        <div id="inner-map-container" ref={(el) => this._map = el}>
          loading map...
        </div>
        <div ref={(el) => this._mapOverlay = el} id="over-map">
          <p>A {this.props.truckType} truck passed by</p>
            <input type="number"
                   min="0"
                   defaultValue="0"
                   onChange={this.setTimeSinceTruckPassed}/>
            <p>minutes ago</p>
          <div className="actions">
            <button onClick={this.confirmDataSubmission}
                    className="confirm-button">
                      Confirm
            </button>
            <button onClick={this.clearMarkers}
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
