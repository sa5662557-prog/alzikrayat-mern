const bcrypt = require('bcrypt');
const User = require('../models/User');

const SALT_ROUNDS = 10;

const toPublicProfile = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  location: user.location,
  description: user.description,
  occupation: user.occupation
});

const register = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);

    const user = new User({
      ...req.body,
      password: hashedPassword
    });
    await user.save();

    res.status(201).json(toPublicProfile(user));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json(toPublicProfile(user));
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
