const {dateToString} = require('../../../helpers/date');
const DataLoader = require('dataloader');
const {events, user} = require('./user');

const eventLoader = new DataLoader((eventIds) => {
    return events(eventIds);
});

const singleEvent = async eventId => {
    try {
        const event = await eventLoader.load(eventId.toString());
        return event;
    } catch (err) {
        throw err;
    }
};

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    };
};

module.exports = {
    transformBooking
};
