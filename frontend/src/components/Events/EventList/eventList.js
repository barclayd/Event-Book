import React from 'react';
import EventItem from './EventItem/eventItem';
import * as classes from './eventList.module.css';

const eventList = props => {

    const events = props.events.map(event => {
        console.log(event.creator._id);
        return <EventItem
            key={event._id}
            eventId={event._id}
            title={event.title}
            price={event.price}
            date={event.date}
            description={event.description}
            creator={event.creator._id === props.owner}/>
    });

    return (
    <ul className={classes.eventsList}>
        {events}
    </ul>
    );

};

export default eventList;
