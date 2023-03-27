const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { authMiddleware, signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, { id, username }, context) => {
      if (!context.user) {
        throw new AuthenticationError("Not authenticated");
      }

      const foundUser = await User.findOne({
        $or: [{ _id: context.user._id }, { username: context.user.username }],
      });

      if (!foundUser) {
        throw new Error("Cannot find a user with this id or username!");
      }

      return foundUser;
    },
  },
  Mutation: {
    loginUser: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Wrong password!");
      }

      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, args) => {
      const user = await User.create(args);

      if (!user) {
        throw new Error("Something is wrong!");
      }
      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, args) => {
      console.log(args)
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: args._id },
          { $addToSet: { savedBooks: args.bookInput } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        return err;
      }
    },
    removeBook: async (parent, { bookId }, context) => {
      if (!context.user) {
        throw new AuthenticationError("Not authenticated");
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("Couldn't find user with this id!");
      }
      return updatedUser;
    },
  },
};

module.exports = resolvers;

module.exports = resolvers;
