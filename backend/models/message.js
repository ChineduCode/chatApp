const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String, 
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
