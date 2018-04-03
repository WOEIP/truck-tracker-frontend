import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import truck from '../img/truck.png';

export default class MapApp extends Component {

  constructor(props) {
    super(props);

    // This binding is necessary to make `this` work in the callback
    this.recenterMap = this.recenterMap.bind(this);
    this.centerMapOnUser = this.centerMapOnUser.bind(this);
    this.clearMarkers = this.clearMarkers.bind(this);
    this.confirmDataSubmission = this.confirmDataSubmission.bind(this);
    this.setTimeSinceTruckPassed = this.setTimeSinceTruckPassed.bind(this);
    this.setTimeUnit = this.setTimeUnit.bind(this);

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
    if (this.props.mapHasBeenShown && !this.props.mapHasBeenHidden) {
      this.loadMap(); // call loadMap function to load the google map
    }
    //this.centerMapOnUser();
  }

  centerMapOnUser() {
    if (navigator && navigator.geolocation) { //center on user's location
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
    const {google} = this.props; // should be valid because loadMap is always called before this function
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

  setTimeUnit(event) {
    this.timeUnit = event.target.value;
  }

  confirmDataSubmission(e) {
    /*console.log("(" + this.markersArray[0].getPosition().lat() + "," + this.markersArray[0].getPosition().lng()
      + ") ->" + "(" + this.markersArray[1].getPosition().lat() + "," + this.markersArray[1].getPosition().lng() + ")");*/
    let fromPos = this.markersArray[0].getPosition();
    let toPos = this.markersArray[0].getPosition();

    let time = this.timeSinceTruckPassed;
    if (this.timeUnit === "hours") {
      time *= 60;
    }
    this.props.sendDataToServer(e, time, fromPos, toPos);
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
    const linkStyle = {
      color: "black",
      boxShadow: "inset 0 0 0 1px black"
    };

    // in our return function you must return a div with ref='map' and style.
    return (
      <div id="map_wrapper">
        <div id="inner_map_container" ref={(el) => this._map = el}>
          loading map...
        </div>
        <div ref={(el) => this._mapOverlay = el} id="over_map">
          <p>
            A {this.props.truckType} truck passed by
            <input type="number"
                   min="0"
                   max="60"
                   defaultValue="0"
                   onChange={this.setTimeSinceTruckPassed}/>
            <select className="time_unit" onChange={this.setTimeUnit}>
              <option value="minutes">minutes ago</option>
              <option value="hours">hours ago</option>
            </select>
          </p>
          <ul className="actions">
            <li><a style={linkStyle}
                   onMouseDown={this.confirmDataSubmission}
                   className="button icon fa-truck">Confirm</a></li>
            <li><a style={linkStyle}
                   onMouseDown={this.clearMarkers}
                   className="button icon fa-close">Cancel</a></li>
           </ul>
         </div>
       </div>
    );
  }
}
