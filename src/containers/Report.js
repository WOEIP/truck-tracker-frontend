import React, { Component } from 'react';
import Api from './../utils/Api.js';
import Menu from './../components/Menu.js';

import '../styles/common.scss';
import '../styles/report.scss';

import TruckSelection from './../components/TruckSelection';
import IdlingOrMoving from './../components/IdlingOrMoving';
import MapContainer from './MapContainer';

import {SessionContext} from './../utils/Session.js';

class Report extends Component {
  constructor(props) {
    super(props);

    this.goToTruckSelection = this.goToTruckSelection.bind(this);
    this.goToMotionView = this.goToMotionView.bind(this);
    this.goToMapView = this.goToMapView.bind(this);
    this.sendData = this.sendData.bind(this);

    this.state = {
      currentView: 'truckSelection',
      truckKey: null,
      truckWasMoving: false,
      engineWasRunning: false
    };
  }

  shouldComponentUpdate() {
    let session = this.context;
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

    // TODO lon or lng??
    let start = {lat: fromPos.lat, lon: fromPos.lng},
        end = {lat: toPos.lat, lon: toPos.lng};

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

  goToMotionView(truck) {
    this.setState(prevState => ({
      currentView: 'idlingOrMoving',
      truckKey: truck.key || prevState.truckKey
    }));
  }

  goToMapView(truckWasMoving, engineWasRunning) {
    this.setState({
      currentView: 'giveLocation',
      truckWasMoving: truckWasMoving,
      engineWasRunning: engineWasRunning
    });
  }

  goToTruckSelection() {
    this.setState({
      currentView: "truckSelection"
    });
  }

  getActiveContent(){
    //TODO that is ugly
    var that = this;
    switch(this.state.currentView) {
      case "giveLocation":
        return {component: MapContainer,
                props: {sendData: that.sendData,
                        goBack: that.goToMotionView,
                        truckKey: that.truckKey,
                        truckWasMoving: this.state.truckWasMoving}};
      case "idlingOrMoving":
        return {component: IdlingOrMoving,
                props: {setMotion: that.goToMapView,
                        goBack: that.goToTruckSelection}};
      case "truckSelection":
        return {component: TruckSelection,
                props: {selectTruck: that.goToMotionView}};
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
