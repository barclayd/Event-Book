const express = require('express');
const app = express();
const graphqlHttp = require('express-graphql');
const {buildSchema} = require('graphql');
require('dotenv').config();

// middleware
express.json();

const events = [];

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
            return events;
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: args.eventInput.date
            };
            events.push(event);
            return event;
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

app.listen(process.env.PORT);
