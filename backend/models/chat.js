const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    participants: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }
    ],
    lastMessage: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Message' 
    },
    lastUpdated: {
        type: Date, 
        default: Date.now 
    }
})

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat;
