import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Counter } from './components/DELETEME-Counter';

export default () => (
  <Switch>
    <Route exact path="/" component={Counter} />
  </Switch>
);
