const express = require('express');
const { createServer } = require('http');
const { join } = require('path')
const cors = require('cors');
const { Server } = require('socket.io')
const connectDB = require('./config/connectDB')
const User = require('./models/user')
const Message = require('./models/message')
const Chat = require('./models/chat')
//const jwt = require('jsonwebtoken')
const userRouter = require('./Routes/userRouter')

require('dotenv').config()
connectDB()

const app = express()
// Middleware to handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//server static file from react
app.use(express.static(join(__dirname, '..', 'frontend', 'build')))


//routes
app.use('/api/users', userRouter)

app.get('*', (req, res)=> {
    res.sendFile(join(__dirname, '..', 'frontend', 'build', 'index.html'))
})

const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.COR_URL,
        methods: ['GET', 'POST']
    }
})


io.use( async (socket, next)=> {
    try{
        const { username, userID } = socket.handshake.auth
    
        if (!userID || !username) {
            return next(new Error('userID and username are required'));
        }

        // Check if the user exists by userID
        let user = await User.findOne({ _id: userID });
        if (user) {
            socket.userID = userID;
            socket.username = username;
            socket.connected = true
            return next();
        }

        // If userID is not found, check by username (case-insensitive)
        user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } }, { password: 0, __v: 0, createdAt: 0, updatedAt: 0 });
        if (!user) {
            return next(new Error('invalid username'));
        }

        socket.userID = user.id;
        socket.username = username;
        socket.connected = true
        next()

    }catch(error){
        console.log('Error in socket middleware', error.message)
        next(new Error('internal server error'));
    }
    
})

let onlineUsers = []

io.on('connection', async (socket)=> {
    try {

        
        socket.emit('session', {
            userID: socket.userID,
            username: socket.username
        })
    
        socket.join(socket.userID)
        
        let users = await User.find({}, {__v: 0, password: 0, createdAt: 0, updatedAt: 0})
        socket.emit('users', users)
    
        //Private message
        // forward the private message to the right recipient (and to other tabs of the sender)
        socket.on("private message", async ({ content, to }) => {
            const from = socket.userID
            const message = {
                content,
                from,
                to,
                timestamp: new Date()
            }
    
            socket.to(to).to(socket.userID).emit("private message", message);
    
            const newMessage = new Message(message)
            await newMessage.save()
            
            //Create chat for the message
            let chat = await Chat.findOne({
                participants: { $all: [from, to] }
            })
     
            if(!chat){
                chat = new Chat({
                    participants: [from, to],
                });
            }
            
            chat.lastMessage = newMessage._id,
            chat.lastUpdated = newMessage.timestamp
            //console.log(chat)
            
            await chat.save()
            
        });
        
        socket.on("getMessages", async ()=> {
            const messages = await Message.find({
                $or: [
                    { from: socket.userID },
                    { to: socket.userID }
                ]
            })
            
            socket.emit("messages", messages)
        })
        
        socket.on("getChats", async ()=> {
            const chats = await Chat.find({
                participants: socket.userID
            })
            .populate({
                path: 'lastMessage',
                populate: { path: 'from to', select: 'username' }
            })
            .populate('participants', 'username');
            
            socket.emit("chats", chats)
        })
        
        // add new user
        socket.on("user online", ({userID, username}) => {
            if (!onlineUsers.some((user) => user.userID === userID)) {  
                // if user is not added before
                onlineUsers.push({ userID, username });
            }
            // send all active users to new user
            io.emit("online users", onlineUsers);
        });
        
    } catch (error) {
        console.log(error.message)
    }
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
