const { User, Cart } = require("../models");
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
require('dotenv');


class LoginRegisterController {

    static register = async (req, res, next) => {
        try {
            const {email, username, password, firstName, lastName, birth} = req.body;
            // Check if the email or username already exist
            const newUsername = username.toLowerCase();
            const newEmail = email.toLowerCase();
            const existingUser = await User.findOne({
                where: {
                    [Op.or]: [{email: newEmail}, {username: newUsername}],
                }
            });
            if (existingUser) {
                // Return an error response if either email or username is already taken
                if (existingUser.email === newEmail && existingUser.username === newUsername) {
                    return res.status(400).json({message: "Email and username are already taken."});
                }
                if (existingUser.email === newEmail) {
                    return res.status(400).json({message: "Email is already taken."});
                }
                if (existingUser.username === newUsername) {
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
            if (data){
                const cartCreate = await Cart.create({
                    userId: data.id,
                    
                });
                const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET );

                res.status(201).json({ token, data:{firstName} });
            }            
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
