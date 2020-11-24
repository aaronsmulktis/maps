import React from 'react';
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux';
import { Provider as AnalyticsProvider } from '@carvana/analytics';
import ThemeProvider, { createGlobalStyle } from '@carvana/theme';
import store, { history } from './store/configureStore';
import configs from './store/configs';
import Layout from './components/DELETEME-Layout/Layout';

import Routes from './Routes'

const GlobalStyle = createGlobalStyle(process.env.NODE_ENV);

export default (
  <Provider store={store}>
    <ThemeProvider>
      <AnalyticsProvider configs={configs} debug>
        <GlobalStyle />
        <Router history={history}>
          <Layout>
            <Routes />
          </Layout>
        </Router>
      </AnalyticsProvider>
    </ThemeProvider>
  </Provider>
);
