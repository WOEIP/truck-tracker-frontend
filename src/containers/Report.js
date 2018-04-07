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
    //TODO create some API module
    axios.post('/Incident', {
      truckType: this.state.truckKey,
      startLat: fromPos.lat(),
      startLon: fromPos.lng(),
      endLat: toPos.lat(),
      endLng: toPos.lng(),
      reportedAt: Date.now() - timeSinceSeen * 60 * 1000
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
