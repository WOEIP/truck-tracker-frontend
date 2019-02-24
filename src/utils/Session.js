import Api from './../utils/Api.js';
import React from 'react';
import merge from 'lodash/merge'

const DEFAULT_SESSION_DATA =  {
        loggedIn: false
};

export const SessionContext = React.createContext(DEFAULT_SESSION_DATA);

export default class SessionProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: DEFAULT_SESSION_DATA,
      update: this.updateSession.bind(this) // we need this bind, right...?
    }
  }

  componentDidMount() {
    Api.get('auth').then(response => {
      this.updateSession(response.data);
    });
  }

  updateSession (updaterObject) { // TODO add callback here
    this.setState(prevState => {
      return merge(prevState, {data: updaterObject});
    });
  };

  render() {
    return (
      <SessionContext.Provider
        value={this.state}
      >
        {this.props.children}
      </SessionContext.Provider>
    );
  }
}
