import { render } from 'react-dom';
import App from './App';

const target = document.querySelector('#root');

function renderApp(Component) {
  render(Component, target);
}

renderApp(App);

if (module && module.hot) {
  module.hot.accept('./App', () => {
    const DevRoutes = require('./App').default;
    renderApp(DevRoutes);
  });
}
