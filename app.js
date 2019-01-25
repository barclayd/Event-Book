const express = require('express');
const app = express();
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {buildSchema} = require('graphql');
require('dotenv').config();

const Event = require('./models/event');
const User = require('./models/user');

// middleware
express.json();

app.use('/', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
       
        type User {
            _id: ID!
            email: String!
            password: String
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input UserInput {
            email: String!
            password: String!
        }
    
        type RootQuery {
            events: [Event!]!
        }
        
        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event
                .find({

                })
                .then(events => {
                    return events.map(event => {
                        return {...event._doc, _id: event.id};
                    })
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        },
        users: () => {
            return User
                .find()
                .then(users => {
                    return users.map(user => {
                        return {
                            ...user._doc,
                            _id: user.id
                        }
                    })
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        },
        createEvent: (args) => {
            const event = new Event({
               title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                data: new Date(args.eventInput.date),
                creator: '5c4b934322a0423d8497e3da'
            });
            let createdEvent;
            return event
                .save()
                .then(result => {
                    createdEvent = {...result._doc, _id: result.id};
                    return User.findById('5c4b934322a0423d8497e3da');
                })
                .then(user => {
                    if(!user) {
                        throw new Error('User not found');
                    }
                    user.createdEvents.push(event);
                    return user.save();
                })
                .then(() => {
                    return createdEvent;
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        },
        createUser: (args) => {
            return User.findOne({
                email: args.userInput.email
            })
                .then(user => {
                    if(user) {
                        throw new Error('Email already in use');
                    }
                    return bcrypt.hash(args.userInput.password, 12);
                })
                .then(hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    });
                    return user
                        .save()
                        .then(result => {
                            console.log(result);
                            return {
                                ...result._doc,
                                _id: result.id,
                                password: null
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            throw err;
                        });
                })
                .catch(err => {
                    throw err;
                });
        }
    },
    graphiql: true
    })
);

app.use('/', (req, res, next) => {
    res.status(200).json({
        hello: 'Hello World'
    })
});

// connect to MongoDB
mongoose.connect(`mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PW}@cluster0-vxymi.mongodb.net/${process.env.DB_NAME}?retryWrites=true`, {useNewUrlParser: true})
    .then(() => {
        app.listen(process.env.PORT);
    })
    .catch(err => {
        console.log(err);
    });
