const Booking = require('../../models/booking');
const Event = require('../../models/event');
const {transformEvent} = require('./mergeResolvers/events');
const {transformBooking} = require('./mergeResolvers/booking');

module.exports = {
    bookings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error ('Authentication required');
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch (err) {
            throw err;
        }
    },
    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error ('Authentication required');
        }
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: req.userId,
            event: fetchedEvent
        });
        const result = await booking.save();
        return transformBooking(result);
    },
    cancelBooking: async(args, req) => {
        if (!req.isAuth) {
            throw new Error ('Authentication required');
        }
        try {
            if (req.userId !== args.userId) {
                throw new Error ('Authentication required');
            }
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({_id: args.bookingId});
            return event;
        } catch (err) {
            throw err;
        }
    }
};
