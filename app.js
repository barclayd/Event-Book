const express = require('express');
const app = express();
require('dotenv').config();

// middleware
express.json();

app.use('/', (req, res, next) => {
    res.status(200).json({
        hello: 'Hello World'
    })
});

app.listen(process.env.PORT);
