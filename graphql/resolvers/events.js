const Event = require('../../models/event');
const User = require('../../models/user');
const {dateToString} = require('../../helpers/date');
const {transformEvent} = require('./mergeResolvers/events');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    createEvent: async (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: dateToString(args.eventInput.date),
            creator: '5c4ce965afc0af153447b590'
        });
        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = transformEvent(result);
            const creator = await User.findById('5c4ce965afc0af153447b590');
            if(!creator) {
                throw new Error('User not found');
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        } catch(err) {
            console.log(err);
            throw err;
        }
    }
};
