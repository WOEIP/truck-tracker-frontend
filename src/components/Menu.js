import React, { Component } from 'react';
import '../styles/menu.scss';
import '../styles/pure-release-1.0.0/menus.css';
import '../styles/pure-release-1.0.0/pure-min.css';
import '../styles/pure-release-1.0.0/grids-responsive.css';

import {SessionContext} from './../utils/Session.js';

class Menu extends Component {
    onItemClick () {
      console.log('clicked');
    }

  logIn (session) {
    session.update({loggedIn: true});
  }

  logOut (session) {
    session.update({loggedIn: false});
  }

  render() {

    // TODO these could be components
    const menuItems = [
      {id: "report", text: "Report"},
      {id: "view-data", text: "View data"},
      {id: "mission", text: "Mission"},
      {id: "contact", text: "Contact"},
    ];

    var itemsToRender = [];
    var classToAdd="";

    for (let i = 0; i < menuItems.length; i++) {
      if (this.props.current == menuItems[i]["id"]){
        classToAdd = "current ";
      } else {
        classToAdd = "";
      }

      itemsToRender.push(
        <li key={menuItems[i]["id"]}>
          <a href={"#" + menuItems[i]["id"]}
             className={classToAdd + "top-menu-item"}>
               {menuItems[i]["text"]}
          </a>
        </li>
      );
    }

    return (
      <SessionContext.Consumer>{ session =>
      <div id="top-menu-container">
         <nav id="top-menu">
           <button onClick={ () => {
             this.logIn(session);
             this.onItemClick }
           }> Login
           </button>
           <button onClick={ () => {
             this.logOut(session);
             console.log(session.data);
             this.onItemClick }
           }> Logout
           </button>
           <div id="top-menu-icon"></div>
           <ul>
             {itemsToRender}
           </ul>
         </nav>
        </div>}
      </SessionContext.Consumer>
    );
  }
}

export default Menu;


// session.update({loggedIn: !session.data.loggedIn})}>Toggle login
