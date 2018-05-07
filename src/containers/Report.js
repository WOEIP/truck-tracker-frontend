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
      currentPage: "selectTruck"
    };

    this.truckKey = null;
  }
  sendData(e, timeSeen, fromPos, toPos, wasIdling, timeIdling) {
    if (!wasIdling) {
      timeIdling = 0;
    }

    let start = {lat: fromPos.lat(), lon: fromPos.lng()},
        end = {lat: toPos.lat(), lon: toPos.lng()};

    //TODO create some API module
    axios.post('http://localhost:4000/incident', {
      truckType: this.truckKey,
      start: start,
      end: end, 
      reportedAt: timeSeen,
      idlingDuration: timeIdling,
    }).then(function (response) {
      console.log(response);
    }).catch(function (error) {
      console.log(error);
    });
  }

  truckSelectHandler(truck) {
    this.setState({
      currentPage: "giveLocation"
    });
    this.truckKey = truck.key;
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
                      truckKey: that.truckKey}};
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
