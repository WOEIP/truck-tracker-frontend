import React, { Component } from 'react';
import Menu from './../components/Menu.js';

import axios from 'axios';

import '../styles/common.scss';
import '../styles/report.scss';

import LoginPage from './../components/LoginPage';
import TruckSelection from './../components/TruckSelection';
import IdlingOrMoving from './../components/IdlingOrMoving';
import MapContainer from './MapContainer';

class Report extends Component {
  constructor(props) {
    super(props);

    this.selectTruck = this.selectTruck.bind(this);
    this.setMotion = this.setMotion.bind(this);
    this.goBack = this.goBack.bind(this);
    this.goForward = this.goForward.bind(this);
    this.sendData = this.sendData.bind(this);

    this.state = {
      pageIndex: 0,
      truckKey: null,
      truckWasMoving: false
    };

    this.subPages = ["login",
                     "selectTruck",
                     "idlingOrMoving",
                     "giveLocation"];

    //this.truckKey = null;
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
      idlingDuration: timeIdling
    }).then(function (response) {
      console.log(response);
    }).catch(function (error) {
      console.log(error);
    });
  }

  selectTruck(truck) {
    this.setState({
      pageIndex: this.state.pageIndex + 1,
      truckKey: truck.key
    });
  }

  setMotion(movingP) {
    this.setState({
      pageIndex: this.state.pageIndex + 1,
      truckWasMoving: movingP
    });
  }

  goBack() {
    this.setState({
      pageIndex: this.state.pageIndex - 1
    });
  }

  goForward() {
    this.setState({
      pageIndex: this.state.pageIndex + 1
    });
  }

  returnToTruckSelection() {
    this.setState({
      currentPage: "truckSelection"
    });
  }

  registerUser(){
    console.log("registering!");
  }

  getActiveContent(){
    //TODO that is ugly
    var that = this;
    switch(this.subPages[this.state.pageIndex]){
    case "login":
      return {component: LoginPage,
              props :{goForward: that.goForward,
                      registerUser: that.registerUser}};
    case "giveLocation":
      return {component: MapContainer,
              props: {goBack: that.goBack,
                      sendData: that.sendData,
                      truckKey: that.truckKey}};
    case "idlingOrMoving":
      return {component: IdlingOrMoving,
              props: {setMotion: that.setMotion,
                      goBack: that.goBack}};
    default:
      return {component: TruckSelection,
              props: {selectTruck: that.selectTruck}};
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
