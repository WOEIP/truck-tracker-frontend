import React, { Component } from 'react';
import Menu from './../components/Menu.js';

import axios from 'axios';

import '../styles/common.scss';
import '../styles/report.scss';

import MapContainer from './MapContainer';
import TruckSelection from './../components/TruckSelection';

class Report extends Component {
  constructor(props) {
    super(props);

    this.truckSelectHandler = this.truckSelectHandler.bind(this);

    this.state = {
      truckType: null,
      currentPage: "selectTruck"
    };
  }

  sendDataToServer(e, timeSinceSeen, fromPos, toPos) {

    // relative time from data submission that truck passed by
    // (e.g. 2 = 2 minutes ago)
    let fromPosLat = fromPos.lat();
    let fromPosLng = fromPos.lng();
    let toPosLat = toPos.lat();
    let toPosLng = toPos.lng();

    /*Debugging only*/
    let fromVector = "(" + fromPosLat + "," + fromPosLng + ")";
    let toVector = "(" + toPosLat + "," + toPosLng + ")";
    console.log(this.state.truckKey,
                timeSinceSeen,
                fromVector + "->" + toVector);

    //timeSinceSeen given in minutes -> ms
    let timeSinceSeenInMS = timeSinceSeen * 60 * 1000;

    //time that truck actually passed
    let time = (new Date).getTime() - timeSinceSeenInMS;

    axios.post('/Incident', {
      truckType: this.state.truckKey,
      startLat: fromPosLat,
      startLon: fromPosLng,
      endLat: toPosLat,
      endLng: toPosLng,
      reportedAt: time
    }).then(function (response) {
      console.log(response);
    }).catch(function (error) {
      console.log(error);
    });
  }

  truckSelectHandler(truck) {
    console.log('type: ' + truck.type);
    this.setState({
      truckType: truck.type,
      truckKey: truck.key
    });

    this.openMap();
  }

  returnToTruckSelection() {
    this.setState({
      title: this.titles.truckSelectionTitle,
      mapHasBeenHidden: true
    });
    this.showTruckSelectHideMap();
  }

  openMap() {
    this.setState({
      title: this.titles.mapHeadingSelectionTitle
    });
    this.showMapHideTruckSelect();
  }

  showMapHideTruckSelect() {
    //this._truckSelectionMenu.style.display = "none";
    //this._mapSelectionView.style.display = "block";
    this.setState({
      mapHasBeenShown: true
    });
  }

  showTruckSelectHideMap() {
    this._truckSelectionMenu.style.display = "block";
    this._mapSelectionView.style.display = "none";
  }

  render() {
    return (
      <div className="bground">
      <article id="report">
        <Menu current="report"/>
        <div ref={ (el) => this._truckSelectionMenu = el }>
          <TruckSelection truckSelectHandler={this.truckSelectHandler}/>
        </div>
        <div id="map_container" ref={ (el) => this._mapSelectionView = el }>
          <MapApp returnToTruckSelection={this.returnToTruckSelection}
                  mapHasBeenShown={this.state.mapHasBeenShown}
                  mapHasBeenHidden={this.state.mapHasBeenHidden}
                  truckType={this.state.truckType}
                  sendDataToServer={this.sendDataToServer}
                  />
        </div>
      </article>
      </div>
    );
  }
}

export default Report;
