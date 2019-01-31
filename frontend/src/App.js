import React, { Component } from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import Auth from './containers/Auth/Auth';
import Events from './containers/Events/Events';
import Bookings from './containers/Bookings/Bookings';
import Navigation from './components/Navigation/navigation';
import AuthContext from './context/auth-context';
import * as classes from './App.module.css';

class App extends Component {

    state = {
      token: null,
      userId: null
    };

    login = (token, userId, tokenExpiration) => {
        this.setState({
            token: token,
            userId: userId
        })
    };

    logout = () => {
        this.setState({
            token: null,
            userId: null
        })
    };

  render() {
      let routes;
      if (this.state.token) {
          routes = (
              <React.Fragment>
                  <Switch>
                  <Route exact path="/bookings" component={Bookings}/>
                  <Route exact path="/events" component={Events}/>
                  <Redirect from='/login' to="/events" />
                  <Redirect to="/events" />
                  </Switch>
              </React.Fragment>
          )
      } else {
          routes = (
              <React.Fragment>
                  <Switch>
                  <Route exact path="/login" component={Auth}/>
                  <Route exact path="/events" component={Events}/>
                  <Redirect to="/events"  />
                  </Switch>
              </React.Fragment>
          )
      }
    return (
        <React.Fragment>
            <AuthContext.Provider value={{
                token: this.state.token,
                userId: this.state.userId,
                login: this.login,
                logout: this.logout
            }}>
            <Navigation/>
            <main className={classes.content}>
                    {routes}
            </main>
            </AuthContext.Provider>
        </React.Fragment>
    );
  }
}

export default App;
