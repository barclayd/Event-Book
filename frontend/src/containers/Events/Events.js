import React, {Component} from 'react';
import Modal from '../../components/Modal/modal';
import Backdrop from '../../components/Backdrop/backdrop';
import AuthContext from '../../context/auth-context';
import EventList from '../../components/Events/EventList/eventList';
import * as classes from './Events.module.css';

class Events extends Component {

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleRef = React.createRef();
        this.priceRef = React.createRef();
        this.dateRef = React.createRef();
        this.descriptionRef = React.createRef();
    }

    componentDidMount() {
        this.fetchEvents();
    }

    state = {
        createEvent: false,
        validationPass: false,
        events: []
    };

    createEventHandler = () => {
        this.setState(prevState => {
            return {
                createEvent: !prevState.createEvent
            }
        });
    };

    modalConfirmHandler = () => {
        this.setState(prevState => {
            return {
                createEvent: !prevState.createEvent
            }
        });
        const title = this.titleRef.current.value;
        const price = +this.priceRef.current.value;
        const date = this.dateRef.current.value;
        const description = this.descriptionRef.current.value;

        // validation
        if (title.trim().length > 0 || price > 0 || date.trim().length > 0 || description.trim().length > 0) {
            this.setState({
                validationPass: true
            });
        } else {
            return;
        }

        const event = {title, price, date, description};
        console.log(event);

        const requestBody = {
            query: `
                mutation {
                    createEvent(eventInput: {
                    title: "${title}",
                    description: "${description}",
                    price: ${price},
                    date: "${date}" }) {
                        _id
                        title
                        price
                        description
                        date
                        creator {
                            _id
                            email
                        }
                   } 
                }
            `
        };

        fetch('http://localhost:3001/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.context.token}`,
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed')
                }
                return res.json();
            })
            .then(resData => {
                console.log(resData);
                this.fetchEvents();
            })
            .catch(err => {
                console.log(err);
            });
    };

    fetchEvents = () => {

        const requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        price
                        description
                        date
                        creator {
                            _id
                            email
                        }
                   } 
                }
            `
        };

        fetch('http://localhost:3001/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed')
                }
                return res.json();
            })
            .then(resData => {
                console.log(resData);
                const events = resData.data.events;
                this.setState({
                    events
                });
            })
            .catch(err => {
                console.log(err);
            });
    };


    render () {

        return (
            <React.Fragment>
                {this.state.createEvent ?
                    <React.Fragment>
                        <Backdrop/>
                        <Modal title='Add Event' canCancel canConfirm toggleModal={this.createEventHandler} onConfirm={this.modalConfirmHandler}>
                            <form>
                                <div className={classes.formControl}>
                                    <label htmlFor='title'>Title</label>
                                    <input type='text' placeholder='Title' id='title' ref={this.titleRef}/>
                                </div>
                                <div className={classes.formControl}>
                                    <label htmlFor='price'>Price</label>
                                    <input type='number' placeholder='Enter a price' step='1.0' id='price' ref={this.priceRef}/>
                                </div>
                                <div className={classes.formControl}>
                                    <label htmlFor='date'>Date</label>
                                    <input type='datetime-local' id='date' ref={this.dateRef}/>
                                </div>
                                <div className={classes.formControl}>
                                    <label htmlFor='date'>Description</label>
                                    <textarea rows='6' id='description' placeholder='Description goes here...' ref={this.descriptionRef}/>
                                </div>
                            </form>
                        </Modal>
                    </React.Fragment>
                    : null}
                <div className={classes.eventsControl}>
                <h1>Events</h1>
                    {this.context.token && (
                        <button className={classes.btn} onClick={this.createEventHandler}>Create Event</button>
                    )}
                </div>
                <EventList events={this.state.events} owner={this.context.userId}/>
            </React.Fragment>
        );
    }
}

export default Events;
