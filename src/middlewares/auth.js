const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res ,next) => {
    try {
        const {token} = req.cookies;
        if(!token){
            throw new Error("You are not logged in!")
        }
        const decodesObj = await token.verify(token,"ekansh@123");
        const {_id} = decodesObj;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found!")
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = userAuth;