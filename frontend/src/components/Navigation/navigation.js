import React from 'react';
import {NavLink} from 'react-router-dom';
import * as classes from './navigation.module.css';

const navigation = (props) => (
  <header className={classes.header}>
      <div className={classes.logo}>
          <h1>EventBook</h1>
      </div>
      <nav className={classes.navigationItems}>
          <ul>
              <li><NavLink to="/events">Events</NavLink></li>
              <li><NavLink to="/bookings">Bookings</NavLink></li>
              <li><NavLink to="/auth">Login</NavLink></li>
          </ul>
      </nav>
  </header>
);

export default navigation;
