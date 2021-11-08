import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Drop from '../client/Drop'
import Manager from '../manager/Manager';
import Market from '../client/Market';
import Assets from '../client/Assets';

const Routes = () => {
  return (
    <section className="container">
      <Switch>
        <Route exact path="/" component={Drop} />
        <Route exact path="/drop" component={Drop} />
        <Route exact path="/manager" render={(routeProps) => <Manager/>} />
        <Route exact path="/market" component={Market} />
        <Route exact path="/assets" component={Assets} />
      </Switch>
    </section>
  );
};

export default Routes;
