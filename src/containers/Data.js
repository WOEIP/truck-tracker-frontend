import React, { Component } from 'react';
import Menu from './../components/Menu.js';

import '../styles/common.scss';

import HeatMap from './../components/HeatMap';

class Data extends Component {
  constructor(props) {
    super(props);

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

export default Data;
