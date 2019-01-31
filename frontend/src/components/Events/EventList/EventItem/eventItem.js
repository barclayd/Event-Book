import React from 'react';
import * as classes from './eventItem.module.css';

const eventItem = props => (
    <li key={props.eventId} className={classes.listedEvent}>
        <div>
            <h1>{props.title}</h1>
            <h2>£{props.price} - {new Date(props.date).toLocaleDateString()} </h2>
        </div>
        <div>
            {!props.creator &&  <button onClick={props.onDetail.bind(this, props.eventId)}>View Details</button>}
            {props.creator &&  <p>You created this event</p>}
        </div>
    </li>
);

export default eventItem;
