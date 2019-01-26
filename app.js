const express = require('express');
const app = express();
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
require('dotenv').config();

const graphQLSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

// middleware
express.json();

app.use('/', graphqlHttp({
    schema: graphQLSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}));

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
