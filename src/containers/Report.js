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
    this.returnToTruckSelection = this.returnToTruckSelection.bind(this);
    this.sendData = this.sendData.bind(this);

    this.state = {
      truckKey: null,
      truckText: "",
      currentPage: "selectTruck"
    };
  }

  sendData(e, timeSinceSeen, fromPos, toPos) {

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
    this.setState({
      truckKey: truck.key,
      truckText: truck.text,
      currentPage: "giveLocation"
    });
  }

  returnToTruckSelection() {
    this.setState({
      currentPage: "truckSelection"
    });
  }

  getActiveContent(){
    //TODO that is ugly
    var that = this;
    switch(this.state.currentPage){
    case "giveLocation":
      return {component: MapContainer,
              props: {returnToTruckSelection: that.returnToTruckSelection,
                      sendData: that.sendData,
                      truckText: that.state.truckText}};
    default:
      return {component: TruckSelection,
              props: {truckSelectHandler: that.truckSelectHandler}};
    }
  };

  render() {
    const ActiveContent = this.getActiveContent();
    return (
      <article id="report">
        <Menu current="report"/>
        <ActiveContent.component {...ActiveContent.props}/>
      </article>
    );
  }
}

export default Report;
