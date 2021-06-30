const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { User } = require('../models');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                const userData = await User.findOne({}).select('-__v -password');
                return userData;
            }
            throw new AuthenticationError('Not logged in');
        }
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });

            if(!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async(_, args, context) => {
            if(context.user){
                console.log('hi')
                try {
                    const updatedUser = await User.findOneAndUpdate(
                      { _id: context.user._id },
                      { $addToSet: { savedBooks: args } },
                      { new: true, runValidators: true }
                    );
                    return updatedUser;
                } catch (err) {
                    console.log(err);
                }
            }
            throw new AuthenticationError('Not logged in');
        },
        removeBook: async(_, { bookId }, context) => {
            if(context.user) {
                try {
                    const updatedUser = await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $pull: { savedBooks: { bookId } } },
                        { new: true }
                    )
                    return updatedUser;
                } catch (err) {
                    console.log('removeBook', err);
                }
            }
            throw new AuthenticationError('Not logged in');
        }
    }
};

module.exports = resolvers;