const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    data: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Event', eventSchema);
