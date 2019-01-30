import React, {Component} from 'react';
import Modal from '../../components/Modal/modal';
import Backdrop from '../../components/Backdrop/backdrop';
import * as classes from './Events.module.css';

class Events extends Component {

    state = {
        createEvent: false
    };

    createEventHandler = () => {
        this.setState(prevState => {
            return {
                createEvent: !prevState.createEvent
            }
        })
    };

    render () {
        return (
            <React.Fragment>
                {this.state.createEvent ?
                    <React.Fragment>
                        <Backdrop/>
                        <Modal title='Add Event' canCancel canConfirm toggleModal={this.createEventHandler} onConfirm={this.createEventHandler}>
                            <p>Modal content goes here!</p>
                            <form>
                                <div className={classes.formControl}>
                                    <label htmlFor='title'>Title</label>
                                    <input type='text' id='title'>Title</input>
                                </div>
                            </form>
                        </Modal>
                    </React.Fragment>
                    : null}
                <div className={classes.eventsControl}>
                <h1>Events</h1>
                    <button className={classes.btn} onClick={this.createEventHandler}>Create Event</button>
                </div>
            </React.Fragment>
        );
    }
}

export default Events;
