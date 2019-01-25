const express = require('express');
const app = express();
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const {buildSchema} = require('graphql');
require('dotenv').config();

const Event = require('./models/event');

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
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
    
        type RootQuery {
            events: [Event!]!
        }
        
        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event
                .find()
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
        createEvent: (args) => {
            const event = new Event({
               title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                data: new Date(args.eventInput.date),
            });
            return event
                .save()
                .then(result => {
                    console.log(result);
                    return {...result._doc, _id: result.id};
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        },
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
