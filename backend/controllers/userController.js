const User = require('../models/user')
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

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
    
        await newUser.save()
    
        return res.status(200).json({message: 'Registration successful'})

    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: 'Internal server error'})
    }
}

const loginUser = async (req, res)=> {
    const { username, password } = req.body
    if(!username || !password){
        return res.status(400).json({message: 'Fill all fields'})
    }

    try{
        const user = await User.findOne({ username: { $regex: new RegExp('^' + username + '$', 'i') } })
        if(!user){
            return res.status(400).json({message: 'Invalid credentials'})
        }

        const checkPassword = await bcrypt.compare(password, user.password)
        if(!checkPassword){
            return res.status(400).json({message: 'Invalid credentials'})
        }

        return res.status(200).json(user)

    }catch(error){
        console.log(error.message)
        return res.status(500).json({message: 'Internal server error'})
    }
}

module.exports = {
    registerUser,
    loginUser
}
