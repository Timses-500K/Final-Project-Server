require("dotenv").config();
const jwt = require('jsonwebtoken');
const { User } = require("../models");

const auth = async (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.header('Authorization').replace('Bearer ', '');

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database
    const user = await User.findOne({ where: { id: decoded.id } });

    // Check if the user exists
    if (!user) {
      throw new Error();
    }

    // Attach the user object to the request
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Please Authenticate' });
  }
};

module.exports = { auth };