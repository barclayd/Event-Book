import React, {Component} from 'react';
import Modal from '../../components/Modal/modal';
import Backdrop from '../../components/Backdrop/backdrop';
import AuthContext from '../../context/auth-context';
import EventList from '../../components/Events/EventList/eventList';
import Spinner from '../../components/Spinner/spinner';
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
        events: [],
        loading: false,
        selectedEvent: null
    };

    createEventHandler = () => {
        this.setState(prevState => {
            return {
                createEvent: !prevState.createEvent,
                selectedEvent: null
            }
        });
    };

    modalViewDetailHandler = () => {
        this.setState({
            selectedEvent: null
        })
    };

    modalConfirmHandler = () => {
        this.setState(prevState => {
            return {
                createEvent: !prevState.createEvent,
                selectedEvent: null
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
                this.setState(prevState => {
                    const updatedEvents = [...prevState.events];
                    updatedEvents.push({
                        _id: resData.data.createEvent._id,
                        title: resData.data.createEvent.title,
                        price: resData.data.createEvent.price,
                        description: resData.data.createEvent.description,
                        date: resData.data.createEvent.date,
                        creator: {
                            _id: this.context.userId,
                        }
                    });
                    return {
                        events: updatedEvents
                    };
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    fetchEvents = () => {
        this.setState({
            loading: true
        });
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
                    events,
                    loading: false
                });
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    loading: false
                })
            });
    };

    showDetailHandler = eventId => {
        this.setState(prevState => {
           const selectedEvent = prevState.events.find(e => e._id === eventId);
           return {
               selectedEvent
           }
        })
    };

    bookEventHandler = () => {
    };

    render () {

        return (
            <React.Fragment>
                {(this.state.createEvent || this.state.selectedEvent) && <Backdrop/>}
                {this.state.createEvent ?
                        <Modal title='Add Event' canCancel canConfirm toggleModal={this.modalConfirmHandler} onConfirm={this.modalConfirmHandler} cancelName='Cancel' confirmName='Confirm'>
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
                    : null}
                {this.state.selectedEvent &&
                    <Modal title={this.state.selectedEvent.title} canCancel canConfirm toggleModal={this.modalViewDetailHandler} onConfirm={this.bookEventHandler} cancelName='Dismiss' confirmName='Book Event'>
                        <h1>{this.state.selectedEvent.title}</h1>
                        <h2>£{this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()} </h2>
                        <p>{this.state.selectedEvent.description}</p>
                    </Modal>
                }
                <div className={classes.eventsControl}>
                <h1>Events</h1>
                    {this.context.token && (
                        <button className={classes.btn} onClick={this.createEventHandler}>Create Event</button>
                    )}
                </div>
                {this.state.loading ? <Spinner /> :
                    <EventList
                        events={this.state.events}
                        owner={this.context.userId}
                        onViewDetail={this.showDetailHandler}/>}
            </React.Fragment>
        );
    }
}

export default Events;
