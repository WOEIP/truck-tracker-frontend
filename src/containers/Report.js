import React, { Component } from 'react';
import Api from './../utils/Api.js';
import Menu from './../components/Menu.js';

import '../styles/common.scss';
import '../styles/report.scss';

import RegistrationPage from './../components/RegistrationPage';
import RegistrationSent from './../components/RegistrationSent';
import TruckSelection from './../components/TruckSelection';
import IdlingOrMoving from './../components/IdlingOrMoving';
import MapContainer from './MapContainer';

import {SessionContext} from './../utils/Session.js';

class Report extends Component {
  constructor(props) {
    super(props);

    this.selectTruck = this.selectTruck.bind(this);
    this.setMotion = this.setMotion.bind(this);
    this.sendData = this.sendData.bind(this);

    this.state = {
      currentPage: 'truckSelection',
      truckKey: null,
      truckWasMoving: false,
      engineWasRunning: false
    };
  }

  shouldComponentUpdate() {
    let session = this.context;
    console.log(session.data);
    return session.data.loggedIn;
  }

  componentWillMount() {
    let session = this.context;
    if (!session.data.loggedIn) {
      window.location.hash = '#login';
    }
  }

  sendData(e, timeSeen, fromPos, toPos, wasIdling, timeIdling) {
    if (!wasIdling) {
      timeIdling = 0;
    }

    let start = {lat: fromPos.lat(), lon: fromPos.lng()},
        end = {lat: toPos.lat(), lon: toPos.lng()};

    let postData = {
      truckType: this.state.truckKey,
      reporterId: 'a578bf68-ef1b-4cbf-9a48-bf5a47980598',
      start: start,
      end: end,
      reportedAt: timeSeen.getTime() / 1000, // unix epoch
      truckSeenAt: timeSeen.getTime()/ 1000, // unix epoch
      idlingDuration: timeIdling
    };

    Api.post('reports', postData);
  }

  selectTruck(truck) {
    this.setState({
      currentPage: 'idlingOrMoving',
      truckKey: truck.key
    });
  }

  setMotion(movingP, engineRunningP) {
    this.setState({
      currentPage: 'giveLocation',
      truckWasMoving: movingP,
      engineWasRunning: engineRunningP
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
    switch(this.state.currentPage) {
      case "registrationSent":
         return {component: RegistrationSent,
                 props: {}};
      case "registration":
        return {component: RegistrationPage,
                props :{registerUser: that.registerUser}};
      case "giveLocation":
        return {component: MapContainer,
                props: {sendData: that.sendData,
                        truckKey: that.truckKey,
                        truckWasMoving: this.state.truckWasMoving}};
      case "idlingOrMoving":
        return {component: IdlingOrMoving,
                props: {setMotion: that.setMotion}};
      case "truckSelection":
        return {component: TruckSelection,
                props: {selectTruck: that.selectTruck}};
      default:
        return null;
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

Report.contextType = SessionContext;

export default Report;
