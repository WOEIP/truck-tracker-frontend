import React, { Component } from 'react';
import axios from 'axios';

import '../assets/css/report.css';

import MapApp from './MapApp';
import TruckSelection from './TruckSelection';

class Report extends Component {
    constructor(props) {
        super(props);

        this.truckSelectHandler = this.truckSelectHandler.bind(this);
        this.sendDataToServer = this.sendDataToServer.bind(this);
        this.returnToTruckSelection = this.returnToTruckSelection.bind(this);
        this.showMapHideTruckSelect = this.showMapHideTruckSelect.bind(this);

        this.titles = {
            truckSelectionTitle: "Select truck type",
            mapHeadingSelectionTitle: "Set truck heading",
        };

        this.state = {
            truckType: null,
            title: this.titles.truckSelectionTitle,
            mapHasBeenShown: false,
            mapHasBeenHidden: false,
        };
    }

    sendDataToServer(e, timeSinceSeen, fromPos, toPos) {
        //relative time from data submission that truck passed by (e.g. 2 = 2 minutes ago)
        let fromPosLat = fromPos.lat();
        let fromPosLng = fromPos.lng();
        let toPosLat = toPos.lat();
        let toPosLng = toPos.lng();

        /*Debugging only*/
        let fromVector = "(" + fromPosLat + "," + fromPosLng + ")";
        let toVector = "(" + toPosLat + "," + toPosLng + ")";
        console.log(this.state.truckKey, timeSinceSeen, fromVector + "->" + toVector);

        let timeSinceSeenInMS = timeSinceSeen * 60 * 1000; //timeSinceSeen given in minutes -> ms 
        let time = (new Date).getTime() - timeSinceSeenInMS; //time that truck actually passed
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

    truckSelectHandler(e, truckType, truckKey) {
        //console.log(truckType);
        this.setState({
            truckType: truckType,
            truckKey: truckKey, 
        });

        this.openMap();
    }

    returnToTruckSelection() {
        this.setState({
            title: this.titles.truckSelectionTitle,
            mapHasBeenHidden: true,
        });
        this.showTruckSelectHideMap();
    }

    openMap() {
        this.setState({
            title: this.titles.mapHeadingSelectionTitle,
        });
        this.showMapHideTruckSelect();
    }

    showMapHideTruckSelect() {
        this._truckSelectionMenu.style.display = "none";

        this._mapSelectionView.style.display = "block";

        this.setState({
            mapHasBeenShown: true,
        });
    }

    showTruckSelectHideMap() {
        this._truckSelectionMenu.style.display = "block";

        this._mapSelectionView.style.display = "none";
    }

    render() {
        return (
            <article id="report">
                <h2 className="major">
                    {this.state.title}</h2>
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
        );
    }
}

export default Report;