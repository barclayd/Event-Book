const {dateToString} = require('../../../helpers/date');
const {user} = require('./user');

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    }
};

module.exports = {
  transformEvent
};
