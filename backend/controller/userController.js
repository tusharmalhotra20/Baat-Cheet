//if there is any error in this controller, it will be handeled by express-async-handler, a npm package.

const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = expressAsyncHandler(async (req, res) => {
  // destructuring req parameters
  const { name, email, password, pic } = req.body;

  //check if any of the parameter is undefined.
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  //check for an existing user by querying into our database
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists!");
  }

  //if user does not exist in our database; then create one!
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  //when a new user is created, send success status code with json user's json values
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id), //create a jwt token for authorising user
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user!");
  }
});

const authUser = expressAsyncHandler(async (req, res) => {
  //login credentials
  const { email, password } = req.body;

  //check wether user with provided credentials exists or not.
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// /api/user
const allUsers = expressAsyncHandler(async (req, res) => {
  //for accessing query result
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {}; //else return nothing

  const users = await User.find(keyword).find({
    _id: { $ne: req.user._id },
  }); //find all the users except the one who is logged in
  res.send(users);
});
module.exports = { registerUser, authUser, allUsers };
