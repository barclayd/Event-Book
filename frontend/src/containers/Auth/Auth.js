import React, {Component} from 'react';
import AuthContext from '../../context/auth-context';
import * as classes from './Auth.module.css';

class Auth extends Component {
    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();

    }

    state = {
      isLogin: true
    };

    static contextType = AuthContext;

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {
                isLogin: !prevState.isLogin
            }
        })
    };

    submitHandler = (event) => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;
        // check for that a value has been entered for both email and password
        if (email.trim().length === 0 || password.trim().length === 0) {
            return null;
        }

        let requestBody = {
            query: `
                query {
                    login(email: "${email}", password: "${password}") {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        };

        if (!this.state.isLogin) {
            requestBody = {
                query: `
                mutation {
                    createUser(userInput: {
                        email: "${email}",
                        password: "${password}"
                    }) {
                        _id
                        email
                    }
                }
            `
            };
        }

        fetch('http://localhost:3001/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                if(res.status !== 200 && res.status !== 201) {
                    throw new Error('User sign up failed')
                }
                return res.json();
            })
            .then(resData => {
                if (resData.data.login.token) {
                    this.context.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration);
                }
                console.log(resData);
            })
            .catch(err => {
                console.log(err);

            });

    };

    render () {
        return (
            <React.Fragment>
            <form className={classes.authForm} onSubmit={this.submitHandler}>
                <div className={classes.formControl}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" ref={this.emailEl}/>
                </div>
                <div className={classes.formControl}>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordEl}/>
                </div>
             <div className={classes.toggleBtns}>
                 <button type="button" onClick={this.switchAuthModeHandler} id='sign-up'>Switch to {this.state.isLogin ? 'Sign Up' : 'Login'}</button>
                 <button type="submit" id='submit'>Submit</button>
             </div>
            </form>
            </React.Fragment>
        );
    }
}

export default Auth;
