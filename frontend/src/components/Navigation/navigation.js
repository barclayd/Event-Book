import React from 'react';
import {NavLink} from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import * as classes from './navigation.module.css';

const navigation = (props) => (
    <AuthContext.Consumer>
        {(context) => {
            return (
                <header className={classes.header}>
                    <div className={classes.logo}>
                        <h1>EventBook</h1>
                    </div>
                    <nav className={classes.navigationItems}>
                        <ul>
                            <li><NavLink to="/events">Events</NavLink></li>
                            {context.token && (
                                <li><NavLink to="/bookings">Bookings</NavLink></li>
                            )}
                            {context.token && (
                                <li><button onClick={context.logout}>Logout</button></li>
                            )}
                            {!context.token && (
                                <li><NavLink to="/auth">Login</NavLink></li>
                            )}
                        </ul>
                    </nav>
                </header>
            )
        }}
    </AuthContext.Consumer>
);

export default navigation;
