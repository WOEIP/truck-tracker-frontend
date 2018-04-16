import React, { Component } from 'react';
import '../styles/menu.scss';
import '../styles/pure-release-1.0.0/menus.css';
import '../styles/pure-release-1.0.0/pure-min.css';
import '../styles/pure-release-1.0.0/grids-responsive.css';

class Menu extends Component {
  render() {

    const menuItems = [
      {id: "report", text: "Report"},
      {id: "data", text: "Data"},
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
      <div id="top-menu-container">
        <nav id="top-menu">
          <a href="#" id="top-menu-icon"></a>
          <ul>
            {itemsToRender}
          </ul>
        </nav>
      </div>
    );
  }
}

export default Menu;
