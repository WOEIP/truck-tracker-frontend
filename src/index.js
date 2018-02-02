import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import TrafficCounter from './containers/TrafficCounter.js';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root-container')
  );
};

render(TrafficCounter);

if (module.hot) {
  module.hot.accept('./containers/TrafficCounter.js',
                    () => { render(TrafficCounter); });
}
