import React from 'react';
import * as classes from './BookingList.module.css';

const bookingList = props => (
    <ul className={classes.bookingList}>
        {props.bookings.map(booking => {
            return (
                <li key={booking._id} className={classes.bookingItem}>
                    <div className={classes.bookingItemData}>
                        <h2>{booking.event.title} </h2>
                            <br />
                        <p className={classes.createdAt}>Date created: {new Date(booking.createdAt).toDateString()}</p>
                        <p className={classes.updatedAt}> Last updated: {new Date(booking.updatedAt).toDateString()}</p>
                    </div>
                    <div className={classes.bookingAction}>
                        <button onClick={props.cancelBooking.bind(this, booking._id)}>Cancel</button>
                    </div>
                </li>
            )
        })}
    </ul>
);

export default bookingList;
