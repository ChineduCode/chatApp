import socket from "./socket"
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import WelcomePage from './components/WelcomePage'
import RegisterPage from './components/RegisterPage'
import LoginPage from "./components/LoginPage"
import SocketsPage from "./components/SocketsPage"
import ChatPage from './components/ChatPage'
import ChatsPage from './components/ChatsPage'
import UpdatesPage from './components/UpdatesPage'
import CommunitiesPage from './components/CommunitiesPage'
import CallsPage from './components/CallsPage'

const App = ()=> {
    const [updatedUsers, setUpdatedUsers] = useState([])
    const [chats, setChats] = useState([]);

    const onSelectUsername = (data)=> {
        const username = data.username
        const userID = data._id
        socket.auth = { username, userID }
        socket.connect()
    }

    useEffect(()=> {
        const userID = localStorage.getItem("userID");
        const username = localStorage.getItem("username");
        if (userID && username) {
            socket.auth = { userID, username };
            socket.connect();
        }

        socket.on('session', ({ userID, username })=> {
            socket.auth = { userID, username }
            localStorage.setItem("userID", userID)
            localStorage.setItem("username", username)
            socket.userID = userID
            socket.username = username
        })

        // Emit the event to get chats
        socket.emit('getChats');
        
        socket.on('chats', (chats)=> {
            const userID = socket.userID
            const processedChats = chats.map(chat => {
                const { lastMessage, lastUpdated } = chat;
                //const otherParticipant = participants.find(participant => participant._id !== userID);
                const isSentByCurrentUser = lastMessage.from._id === userID;
    
                return {
                    content: lastMessage.content,
                    username: isSentByCurrentUser ? lastMessage.to.username : lastMessage.from.username,
                    lastUpdated
                };
            });
    
            setChats(processedChats);
        })


        const initReactiveProperties = (user) => {
            const newUser = { ...user };
            newUser.hasNewMessages = false;
            return newUser;
        };

        socket.on("users", (users) => {
            //Add self property to each user
            if(updatedUsers.length === 0){
                users.forEach((user) => {
                    setUpdatedUsers(prevUsers => {
                        const updatedUsers = [...prevUsers];
                        user.self = user._id === socket.userID;
                        //user.userID = socket.userID
                        initReactiveProperties(user);
                        updatedUsers.push(user);
    
                        updatedUsers.sort((a, b) => {
                            if (a.self) return -1;
                            if (b.self) return 1;
                            if (a.username < b.username) return -1;
                            return a.username > b.username ? 1 : 0;
                        });
    
                        return updatedUsers;
                    });
                });
            }
        });
        
        // socket.on("user connected", (user) => {
        //   setUsers(prevUsers => {
        //     const updatedUsers = prevUsers.map(existingUser => {
        //       if (existingUser.userID === user.userID) {
        //         return { ...existingUser, connected: true };
        //       }
        //       return existingUser;
        //     });
        //     const isNewUser = !updatedUsers.some(existingUser => existingUser.userID === user.userID);
        //     if (isNewUser) {
        //       initReactiveProperties(user);
        //       updatedUsers.push(user);
        //       //console.log(`is new user ${JSON.stringify(user)}`)
        //     }
        //     return updatedUsers;
        //   });
        // });

        return ()=> {
            socket.off('session')
            socket.off('chats')
            socket.off('users')
        }
    })


    return(
        <>
           <Router>
                <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage socket={socket} onSelectUsername={onSelectUsername} />} />
                    <Route path="/sockets" element={<SocketsPage users={updatedUsers}/>} />
                    <Route path="/chats" element={<ChatsPage socket={socket} users={updatedUsers} chats={chats}/>}/>
                    <Route path="/chat/:username" element={<ChatPage socket={socket} users={updatedUsers}/>} />
                    <Route path="/updates" element={<UpdatesPage socket={socket}/>} />
                    <Route path="/communities" element={<CommunitiesPage socket={socket}/>} />
                    <Route path="/calls" element={<CallsPage socket={socket}/>} />
                </Routes>
           </Router>
        </>
    )
}

export default App;
