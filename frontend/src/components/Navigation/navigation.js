import React from 'react';
import {NavLink} from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import * as classes from './navigation.module.css';

const navigation = (props) => {

    return (
            <AuthContext.Consumer>
                {(context) => {
                    return (
                        <header className={classes.header}>
                            <div className={classes.logo}>
                                <h1>EventBook</h1>
                            </div>
                            <nav className={classes.navigationItems}>
                                <ul>
                                    <li><NavLink to="/events" activeClassName={classes.isActive}>Events</NavLink></li>
                                    {context.token && (
                                        <li><NavLink to="/bookings" activeClassName={classes.isActive}>Bookings</NavLink></li>
                                    )}
                                    {context.token && (
                                        <li><button onClick={context.logout}>Logout</button></li>
                                    )}
                                    {!context.token && (
                                        <li><NavLink to="/login" activeClassName={classes.isActive}>Login</NavLink></li>
                                    )}
                                </ul>
                            </nav>
                        </header>
                    )
                }}
            </AuthContext.Consumer>
        )
};

export default navigation;
