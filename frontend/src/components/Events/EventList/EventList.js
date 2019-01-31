import React from 'react';
import EventItem from './EventItem/EventItem';
import * as classes from './EventList.module.css';

const eventList = props => {

    const events = props.events.map(event => {
        return <EventItem
            key={event._id}
            eventId={event._id}
            title={event.title}
            price={event.price}
            date={event.date}
            description={event.description}
            creator={event.creator._id === props.owner}
            onDetail={props.onViewDetail}/>
    });

    return (
    <ul className={classes.eventsList}>
        {events}
    </ul>
    );

};

export default eventList;
