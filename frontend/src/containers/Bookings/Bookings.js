import React, {Component} from 'react';
import Spinner from '../../components/Spinner/Spinner';
import AuthContext from "../../context/auth-context";

class Bookings extends Component {

    static contextType = AuthContext;


    state = {
        loading: false,
        bookings: []
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

    render () {
        return (
            <React.Fragment>
            <h1>Bookings</h1>
                {this.state.loading ? <Spinner /> : <ul>
                {this.state.bookings.map(booking => {
                    return <li key={booking._id}>{booking.event.title}</li>
                })}
            </ul>}
            </React.Fragment>
        );
    }
}

export default Bookings;
