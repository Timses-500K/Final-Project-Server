require("dotenv").config();
const jwt = require('jsonwebtoken');
const { User, Admin } = require("../models");

class Auth {
  
  static async author(req, res, next){
    try {
      // Get the token from the request header
      const token = req.header('Authorization').replace('Bearer ', '');

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database
      const user = await User.findOne({ where: { id: decoded.id } });

      // Check if the user exists
      if (!user) {
        next({name: "UserNotFound"});
      }

      // Attach the user object to the request
      req.user = user;
      next();  
    } catch (err) {
      res.status(401).send({ error: 'Please Authenticate' });
    }
  }

  static async authorAdmin(req, res, next){
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.JWT_SECRETADMIN);
      const admin = await Admin.findOne({ where: { id: decoded.id } });

      if (!admin) {
        next({name: "UserNotFound"});
      }
      req.admin = admin;
      next();  
    } catch (err) {
      res.status(401).send({ error: 'Please Authenticate' });
    }
  }
}

module.exports = { Auth };