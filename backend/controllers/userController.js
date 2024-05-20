const User = require('../models/user')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')

const registerUser = async (req, res)=> {
    const {username, email, password} = req.body

    if(!username || !email || !password){
        return res.status(400).json({message: 'Fill all fields'})
    }

    if(email && !email.includes('@')){
        return res.status(400).json({message: 'Email is not valid'})
    }

    if(password && (password.length < 7)){
        return res.status(400).json({message: 'Password must be more 7 characters'})
    }

    try{
        //Check if the user already exist
        const userExist = await User.findOne({username})
        if(userExist){
            return res.status(400).json({message: 'User already exist'})
        }

        const randomID = ()=> crypto.randomBytes(8).toString('hex')

        const newUser = new User({
            username,
            email,
            password,
            userID: randomID()
        })
    
        await newUser.save()
    
        return res.status(200).json({message: 'Registration successful'})

    }catch(error){
        console.log(error.message)
    }
}

const loginUser = async (req, res)=> {
    const { username } = req.body
    if(!username){
        return res.status(400).json({message: 'Fill all fields'})
    }

    try{
        const user = await User.findOne({ username: { $regex: new RegExp('^' + username + '$', 'i') } }, {password: 0, __v: 0, createdAt: 0, updatedAt: 0})
        if(!user){
            return res.status(400).json({message: 'User does not exist'})
        }
    
        return res.status(200).json(user)

    }catch(error){
        console.log(error.message)
    }
    
}

module.exports = {
    registerUser,
    loginUser
}
