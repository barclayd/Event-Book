const bcrypt = require('bcrypt');
const Event = require('../../models/event');
const User = require('../../models/user');

const user = async userId => {
    try {
        const user = await User.findById(userId);
            return {
                ...user._doc,
                _id: user.id,
                password: null,
                createdEvents: events.bind(this, user._doc.createdEvents)
            };
    } catch (err) {
        throw err;
    }
};

const events = async eventIds => {
    try  {
        const events = await Event.find({_id: {$in: eventIds}});
        return events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event._doc.creator)
            };
        });
    } catch(err) {
        throw err;
    }
};

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
                    return events.map(event => {
                        return {
                            ...event._doc,
                            _id: event.id,
                            date: event._doc.date.toISOString(),
                            creator: user.bind(this, event._doc.creator)
                        };
                });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    users: async () => {
        try {
            const users = await User.find();
                return users.map(user => {
                    return {
                        ...user._doc
                    };
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
            date: new Date(args.eventInput.date),
            creator: '5c4ce965afc0af153447b590'
        });
        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = {
                ...result._doc,
                _id: result._doc._id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(result._doc.creator
                )};
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
    },
    createUser: async (args) => {
        try {
            const user = await User.findOne({
                email: args.userInput.email
            });
            if(user) {
                throw new Error('Email already in use');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const createdUser = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await createdUser.save();
            return {
                ...result._doc,
                _id: result.id,
                password: null
            };
        } catch (err) {
            throw err;
        }
    }
};
