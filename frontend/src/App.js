import React, { Component } from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import Auth from './containers/Auth/Auth';
import Events from './containers/Events/Events';
import Bookings from './containers/Bookings/Bookings';
import Navigation from './components/Navigation/navigation';
import * as classes from './App.module.css';

class App extends Component {
  render() {
    return (
        <React.Fragment>
            <Navigation/>
            <main className={classes.content}>
                <Switch>
                    <Redirect from="/" to="/auth" exact />
                    <Route exact path="/auth" component={Auth}/>
                    <Route exact path="/events" component={Events}/>
                    <Route exact path="/bookings" component={Bookings}/>
                </Switch>
            </main>
        </React.Fragment>
    );
  }
}

export default App;
