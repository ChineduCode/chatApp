import socket from "./socket"
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import WelcomePage from './pages/WelcomePage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from "./pages/LoginPage"
import SocketsPage from "./pages/SocketsPage"
import ChatPage from './pages/ChatPage'
import ChatsPage from './pages/ChatsPage'
import UpdatesPage from './pages/UpdatesPage'
import CommunitiesPage from './pages/CommunitiesPage'
import CallsPage from './pages/CallsPage'
import NotFound from "./pages/NotFound"
import PrivateRoutes from "./useAuth"

const App = ()=> {
    const [updatedUsers, setUpdatedUsers] = useState([])
    //const [chats, setChats] = useState([]);
    let [onlineUsers, setOnlineUsers] = useState([])

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
    },[])

    useEffect(()=> {
        const handleSession = ({ userID, username })=> {
            socket.auth = { userID, username }
            localStorage.setItem("userID", userID)
            localStorage.setItem("username", username)
            socket.userID = userID
            socket.username = username
        }

        socket.on('session', handleSession)

        return ()=> {
            socket.off('session', handleSession)
        }
    },[])

    // useEffect(()=> {
    //     const handleChats = (chats)=> {
    //         const userID = socket.userID
    //         const processedChats = chats.map(chat => {
    //             const { lastMessage, lastUpdated } = chat;
    //             //const otherParticipant = participants.find(participant => participant._id !== userID);
    //             const isSentByCurrentUser = lastMessage.from._id === userID;
    
    //             return {
    //                 content: lastMessage.content,
    //                 username: isSentByCurrentUser ? lastMessage.to.username : lastMessage.from.username,
    //                 lastUpdated
    //             };
    //         });
    
    //         setChats(processedChats);
    //     }

    //     // Emit the event to get chats
    //     socket.emit('getChats');
    //     socket.on('chats', handleChats)

    //     return ()=> {
    //         socket.off('chats', handleChats)
    //     }

    // },[setChats])

    useEffect(()=> {
        const handleOnlineUsers = (users)=> {
            setOnlineUsers(users);
        }

        socket.emit("user online", {userID: socket.userID, username: socket.username});
        socket.on('online users', handleOnlineUsers)

        return ()=> {
            socket.off('online users', handleOnlineUsers)
        }

    }, [setOnlineUsers])

    useEffect(()=> {
        const initReactiveProperties = (user) => {
            const newUser = { ...user };
            newUser.hasNewMessages = false;
            return newUser;
        };

        const handleUsers = (users) => {
            //Add self property to each user
            if(updatedUsers.length === 0){
                users.forEach((user) => {
                    setUpdatedUsers(prevUsers => {
                        const updatedUsers = [...prevUsers];
                        user.self = user._id === socket.userID;
                        user.online = onlineUsers.some(onlineUser => onlineUser.userID === user._id)
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
        }

        socket.on('users', handleUsers)

        return ()=> {
            socket.off('users', handleUsers)
        }
        
    }, [setUpdatedUsers, updatedUsers, onlineUsers])

    useEffect(()=> {
        // Tab has focus
        const handleFocus = async () => {
            socket.emit("user online", {userID : socket.userID, username: socket.username});
            socket.on("online users", (users) => {
                setOnlineUsers(users);
            });
        };

        // Tab closed
        const handleBlur = () => {
            socket.emit("offline")  
        };

        // Track if the user changes the tab to determine when they are online
        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
        };

    },[setOnlineUsers])


    return(
        <>
           <Router>
                <Routes>
                    <Route index element={<WelcomePage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage socket={socket} onSelectUsername={onSelectUsername} />} />
                    <Route element={<PrivateRoutes />}>
                        <Route path="/sockets" element={<SocketsPage users={updatedUsers}/>} />
                        <Route path="/chats" element={<ChatsPage socket={socket} users={updatedUsers} />}/>
                        <Route path="/chat/:username" element={<ChatPage socket={socket} users={updatedUsers}/>} />
                        <Route path="/updates" element={<UpdatesPage socket={socket}/>} />
                        <Route path="/communities" element={<CommunitiesPage socket={socket}/>} />
                        <Route path="/calls" element={<CallsPage socket={socket}/>} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
           </Router>
        </>
    )
}

export default App;       
