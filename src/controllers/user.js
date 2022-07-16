const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');
const { signupValidation, signinValidation } = require('../validation/user');

exports.signup = async (req, res) => {
  const result = signupValidation(req.body);
  if (result.error) {
    return res
      .status(422)
      .json({
        message: 'Invalid request',
        err: result.error.details[0].message,
      });
  }
  try {
    const userExsits = await User.findOne({ username: req.body.username });
    if (userExsits) {
      return res.status(400).json({ err: 'This username is already in use' });
    }
    const user = new User(req.body);
    const saveUser = await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    });
    const { _id, username, role } = saveUser;
    return res.json({ token, user: { _id, username, role } });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Internal server error, please try again', err });
  }
};

exports.signin = async (req, res) => {
  const result = signinValidation(req.body);
  if (result.error) {
    console.log('error: ', result.error);
    return res.status(422).json({
      message: 'Invalid request',
      err: result.error.details[0].message,
    });
  }

  try {
    const { username, password } = req.body;
    const userLogin = await User.findOne({ username });
    if (!userLogin) {
      return res.status(400).json({
        err: 'Please provide a valid username and password',
      });
    }
    if (!userLogin.authenticate(password)) {
      return res
        .status(401)
        .json({ err: 'Please provide a valid username and password' });
    }
    const { _id, role } = userLogin;
    const token = jwt.sign({ _id: userLogin._id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24,
    });
    return res.json({ token, user: { _id, username, role } });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Internal server error, please try again', err });
  }
};

exports.auth = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.auth._id });
    if (!user) {
      return res.status(400).json({
        err: 'User does not exsit',
      });
    }
    const { username, role, _id } = user;
    res.json({ username, role, _id });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Internal server error, please try again', err });
  }
};

exports.requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth',
});

exports.userById = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        err: 'User does not exsit',
      });
    }
    req.profile = user;
    next();
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Internal server error, please try again', err });
  }
};

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      err: 'Access denied',
    });
  }
  next();
};

exports.isAdmin = (role) => async (req, res, next) => {
  const user = await User.findById({ _id: req.auth._id });
  if (user.role <= role) {
    return res.status(403).json({
      err: 'Admin resourse! Access denied',
    });
  }
  next();
};
