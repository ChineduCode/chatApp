const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    userID: {
        type: String,// Assuming socket.id is a string
        require: true,
        unique: true
    }
},{
    timestamps: true
})

// Defining a case-insensitive index on the username field
userSchema.index({ username: 1 }, { unique: true, collation: { locale: 'en', strength: 2 } });

const User = mongoose.models.User || mongoose.model('User', userSchema)

module.exports = User;
