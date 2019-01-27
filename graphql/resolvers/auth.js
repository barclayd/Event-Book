const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
    },
    login: async ({email, password}) => {
        // does user exist
        const user = await User.findOne({
            email: email
        });
        // no user found
        if (!user) {
            throw new Error('Authentication failed');
        }
        // validate password
        const isEqual = await bcrypt.compare(password, user.password);
        // check if password is incorrect
        if (!isEqual) {
            throw new Error('Authentication failed');
        }
        const token = jwt.sign({
            userId: user.id,
            email: user.email
        }, process.env.PRIVATE_KEY, {
            expiresIn: '1h'
        });
        return {
            userId: user.id,
            token: token,
            tokenExpiration: 1
        };
    }
};
