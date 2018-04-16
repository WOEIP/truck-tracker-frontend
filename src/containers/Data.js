import React, { Component } from 'react';
import Menu from './../components/Menu.js';

//import axios from 'axios';

import '../styles/common.scss';
//import '../styles/heat_map.scss';

import HeatMap from './../components/HeatMap';

class Report extends Component {
  constructor(props) {
    super(props);

    /*this.truckSelectHandler = this.truckSelectHandler.bind(this);
    this.returnToTruckSelection = this.returnToTruckSelection.bind(this);
    this.sendData = this.sendData.bind(this);*/

    this.state = {
      currentPage: "heatMap"
    };
  }

  returnToTruckSelection() {
    this.setState({
      currentPage: "heatMap"
    });
  }

  getActiveContent(){
    //TODO that is ugly
    var that = this;
    switch(this.state.currentPage){
    case "timeChart":
      return {component: null,
              props: {}};
    default:
      return {component: HeatMap,
              props: {}};
    }
  };

  render() {
    const ActiveContent = this.getActiveContent();
    return (
      <article id="data">
        <Menu current="data"/>
        <ActiveContent.component {...ActiveContent.props}/>
      </article>
    );
  }
}

export default Report;