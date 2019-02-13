import React from 'react';
import * as classes from './BookingControls.module.css';

const bookingControls = props => {
    return (
        <div className={classes.bookingsControl}>
            <button
                className={props.activeOutputType === 'list' ? classes.active : null}
                onClick={props.onChange.bind(this, 'list')}
                >
                List
        </button>
            <button
                className={props.activeOutputType === 'chart' ? classes.active : null}
                onClick={props.onChange.bind(this, 'chart')}>
                Chart
            </button>
        </div>
    )
};

export default bookingControls;
