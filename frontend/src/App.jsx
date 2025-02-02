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
    let [onlineUsers, setOnlineUsers] = useState([])

    const onSelectUsername = (data)=> {
        const username = data.username
        const userID = data._id
        socket.auth = { username, userID }
        socket.connect()
    }

    useEffect(()=> {
        const user = localStorage.getItem("user");
        const userData = JSON.parse(user)
        const userID = userData?.userID
        const username = userData?.username

        if (userID && username) {
            socket.auth = { userID, username };
            socket.connect();
        }
    },[])

    useEffect(()=> {
        const handleSession = ({ userID, username })=> {
            socket.auth = { userID, username }
            const user = {userID, username}
            const userData = JSON.stringify(user)
            localStorage.setItem("user", userData)
            socket.userID = userID
            socket.username = username
        }

        socket.on('session', handleSession)

        return ()=> {
            socket.off('session', handleSession)
        }
    },[])

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
                const newUsers = users.map((user) => {
                    const newUser = initReactiveProperties(user);
                    newUser.self = user._id === socket.userID;
                    newUser.online = onlineUsers.some(onlineUser => onlineUser.userID === user._id);
                    return newUser;
                });

                newUsers.sort((a, b) => {
                    if (a.self) return -1;
                    if (b.self) return 1;
                    if (a.username < b.username) return -1;
                    return a.username > b.username ? 1 : 0;
                });

                setUpdatedUsers(newUsers);
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
            //console.log('Window on focus')
        };

        // Tab closed
        const handleBlur = () => {
            socket.emit("offline")  
            //console.log('Window on blur')
        };

        // Track if the user changes the tab to determine when they are online
        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
        };

    },[setOnlineUsers])


    // socket.on('new chat', (chat)=> {
    //     console.log('new chat added')
    // })

 
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
