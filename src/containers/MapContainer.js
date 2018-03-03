import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import truck from './../img/truck.jpg';

export default class MapContainer extends Component {

    constructor(props) {
        super(props);

        // This binding is necessary to make `this` work in the callback
        this.clearMarkers = this.clearMarkers.bind(this);
    }

    componentDidUpdate() {
        this.loadMap(); // call loadMap function to load the google map
    }

    recordVectorPt(lat, lng) {
        const {google} = this.props; // should be valid because loadMap is always called before this function
        
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

    clearMarkers() {
        for (var i = 0; i < this.markersArray.length; i++) {
            this.markersArray[i].setMap(null);
        }

        this.markersArray.length = 0;
        this.poly.setMap(null); //remove the route from map as well
        this._mapOverlay.style.display = "none";
        this.numMarkersPlaced = 0;
    }

    placeMarker(lat, lng) {
        const {google} = this.props; // should be valid because loadMap is always called before this function

        const marker = new google.maps.Marker({ // creates a new Google maps Marker object.
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

    loadMap() {
        if (this.props && this.props.google) { // checks to make sure that props have been passed
            const {google} = this.props; // sets props equal to google
            const maps = google.maps; // sets maps to google maps props

            const mapRef = this.refs.map; // looks for HTML div ref 'map'. Returned in render below.
            const node = ReactDOM.findDOMNode(mapRef); // finds the 'map' div in the React DOM, names it node

            const mapConfig = Object.assign({}, {
                center: {
                    lat: 37.8719,
                    lng: -122.2585
                }, // sets center of google map to NYC.
                zoom: 16, // sets zoom. Lower numbers are zoomed further out.
                mapTypeId: 'roadmap' // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
            })

            this.map = new maps.Map(node, mapConfig); // creates a new Google map on the specified node (ref='map') with the specified configuration set above.

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
        const style = { // MUST specify dimensions of the Google map or it will not work. Also works best when style is specified inside the render function and created as an object
            width: '98vw', // 90vw basically means take up 90% of the width screen. px also works.
            height: '75vh' // 75vh similarly will take up roughly 75% of the height of the screen. px also works.
        }

        const wrapperStyle = {
            position: "relative"
        }

        const divOverlayStyle = {
            backgroundColor: "white",
            display: "none",
            zIndex: 99,

            position: "absolute",
            top: 10, 
            right: 10, 

            padding: 50
            /*height: 20,
            width: 20,*/
        }

        return ( // in our return function you must return a div with ref='map' and style.
            <div id="wrapper" style={wrapperStyle}>
                <div ref="map" style={style}>
                    loading map...
                </div>

                <div id="over_map" style={divOverlayStyle} ref={ (el) => this._mapOverlay = el }>
                    <p>
                        Is this correct?
                    </p>
                    <button onClick={this.clearMarkers}>
                        CONFIRM
                    </button>
                </div>
            </div>
        )
    }
    
}