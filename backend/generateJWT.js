const jwt = require('jsonwebtoken')

const SECRET_KEY = process.env.SECRET_KEY

const generateToken = (userID)=> {
    const token = jwt.sign({userID}, process.env.SECRET_KEY)
    console.log(token)
    return token
}

const verifyToken = ()=> {}

module.exports = generateToken;