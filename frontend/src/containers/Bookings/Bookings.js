import React, {Component} from 'react';
import BookingList from '../../components/Bookings/BookingList/BookingList';
import BookingsChart from '../../components/Bookings/BookingsChart/BookingChart';
import BookingsControl from '../../components/Bookings/BookingsControls/BookingControls';
import Spinner from '../../components/Spinner/Spinner';
import AuthContext from "../../context/auth-context";

class Bookings extends Component {

    static contextType = AuthContext;


    state = {
        loading: false,
        bookings: [],
        currentBooking: null,
        outputType: 'list'
    };

    componentDidMount() {
        this.fetchBookings();
    }

    fetchBookings = () => {
        this.setState({
            loading: true
        });
        const requestBody = {
            query: `
                query {
                    bookings {
                        _id,
                        createdAt,
                        updatedAt,
                        event {
                            _id
                            title
                            date
                            price
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
                'Authorization': `Bearer ${this.context.token}`
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
                const bookings = resData.data.bookings;
                this.setState({
                    bookings,
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

    cancelBookingHandler = bookingId => {
        this.setState({
            currentBooking: bookingId,
            loading: true
        });
        const requestBody = {
            query: `
                mutation CancelBooking($id: ID!) {
                    cancelBooking(bookingId: $id) {
                       _id
                        title
                   } 
                }
            `,
            variables: {
                id: bookingId
            }
        };

        fetch('http://localhost:3001/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.context.token}`
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
                    const updatedBookings = prevState.bookings.filter(booking => booking._id !== bookingId);
                    return {
                        currentBooking: null,
                        loading: false,
                        bookings: updatedBookings
                    }
                });
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    loading: false
                })
            });
    };

    changeOutputTypeHandler = (outputType) => {
        if (outputType === 'list') {
            this.setState({
                outputType: 'list'
            })
        } else {
            this.setState({
                outputType: 'chart'
            })
        }
    };

    render () {
        let content = <Spinner/>;
        if(!this.state.loading) {
            content = (
                <React.Fragment>
                   <BookingsControl
                    activeOutputType={this.state.outputType}
                    onChange={this.changeOutputTypeHandler}
                   />
                    <div>
                        {this.state.outputType  === 'list' ? <BookingList bookings={this.state.bookings} cancelBooking={this.cancelBookingHandler}/> : <BookingsChart bookings={this.state.bookings} />}
                    </div>
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                {content}
            </React.Fragment>
        );
    }
}

export default Bookings;
