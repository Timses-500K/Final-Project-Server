const { User } = require("../models");


class LoginRegisterController {

    static register = async (req, res, next) => {
        try {
            const {email, username, password, firstName, lastName, birth, visibility} = req.body;
            
            const data = await User.create({
                email,
                username,
                password,
                firstName,
                lastName,
                birth,
                visibility
            })

            res.status(201).json(data);
        } catch(err) {
            next(err);
        }
    }

    static login = async (req, res, next) => {
        const {email, username, password} = req.body;

        try {
            const data = await User.findOne({
                where: {
                    email,
                    username,
                    password
                }
            })

            if(data) {
                res.status(200).json(data)
            } else {
                throw {name: "ErrorNotFound"}
            }

        } catch(err) {
            next(err);
        }
    }




    
}

module.exports = LoginRegisterController;
