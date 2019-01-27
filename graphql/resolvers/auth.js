const bcrypt = require('bcrypt');
const User = require('../../models/user');

module.exports = {
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
