const { User } = require("../models");

const userController = {
  // get all users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get one user by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .select("-__v")
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // create single user
  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },

  // update user by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // delete a single user by id
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },

  // create friend for specific user by id
  addFriend({ params }, res) {
    User.updateOne(
      { _id: params.userId },
      {
        $push: {
          "friends": params.friendId,
        }
      }
    )
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => res.json(err));
  },

  // delete friend for specific user by id
  removeFriend({ params }, res) {
    User.updateOne(
      { _id: params.userId },
      {
        $pull: {
          "friends": params.friendId,
        },
      }
    )
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => res.json(err));
  },
};

module.exports = userController;
