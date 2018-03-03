import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import TrafficCounter from './containers/TrafficCounter.js';
import MapApp from './containers/MapApp.js';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root-container')
  );
};

render(MapApp);

if (module.hot) {
  module.hot.accept('./containers/MapApp.js',
                    () => { render(MapApp); });
}

/*render(TrafficCounter);

if (module.hot) {
  module.hot.accept('./containers/TrafficCounter.js',
                    () => { render(TrafficCounter); });
}*/