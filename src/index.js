import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './containers/App.js';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root-container')
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./containers/App.js',
                    () => { render(App); });
}
