import React from 'react';
import { Switch, Route } from 'react-router-dom';
// import { Counter } from './components/DELETEME-Counter';
import { World, UnitedStates } from './components/Maps'

export default () => (
  <Switch>
    <Route exact path="/"
      render={(props) => (
        <UnitedStates width={window.innerWidth} height={window.innerHeight} />
      )}
    />
    <Route exact path="/world"
      render={(props) => (
        <World width={window.innerWidth} height={window.innerHeight} />
      )}
    />
    <Route exact path="/us"
      render={(props) => (
        <World width={window.innerWidth} height={window.innerHeight} />
      )}
    />
  </Switch>
);