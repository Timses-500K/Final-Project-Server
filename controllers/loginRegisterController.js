const { User } = require("../models");
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
require('dotenv');


class LoginRegisterController {

    static register = async (req, res, next) => {
        try {
            const {email, username, password, firstName, lastName, birth} = req.body;
            // Check if the email or username already exist
            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [{email}, {username}],
                }
            });
            if (existingUser) {
                // Return an error response if either email or username is already taken
                if (existingUser.email === email && existingUser.username === username) {
                    return res.status(400).json({message: "Email and username are already taken."});
                }
                if (existingUser.email === email) {
                    return res.status(400).json({message: "Email is already taken."});
                }
                if (existingUser.username === username) {
                    return res.status(400).json({message: "Username is already taken."});
                }
            }
            // Create a new user if email and username are unique
            const data = await User.create({
                email,
                username,
                password,
                firstName,
                lastName,
                birth,
            });

            const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET );

            res.status(201).json({ token, data });
        } catch(err) {
            next(err);
        }
    };

    static login = async (req, res, next) => {
        const { email, password } = req.body;
    
        try {
            const user = await User.findOne({
                where: {
                    email,
                },
            });
    
            if (!user) {
                throw { name: "WrongEmail" };
            } else if ( !(await user.verifyPassword(password))) {
                throw { name: "WrongPassword" };
            }
    
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    
            res.status(201).json({ token, name: user.firstName });
        } catch (err) {
            next(err);
        }
    };
    
}

module.exports = LoginRegisterController;

//testpush
