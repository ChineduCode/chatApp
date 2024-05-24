import { io } from 'socket.io-client'

console.log('connected to', process.env.REACT_APP_SERVER_URL)

const socket = io(process.env.REACT_APP_SERVER_URL, {
    autoConnect: false,
    // reconnection: true,
    // reconnectionAttempts: Infinity,
    // reconnectionDelay: 1000,
})

socket.onAny((event, ...args)=> {
    console.log(event, args)
})

export default socket;
