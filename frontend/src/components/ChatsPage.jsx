import Header from './ChatsHeader';
import Footer from './Footer';
import NewChatBtn from './NewChatBtn';
import Loading from './Loading'
//import { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa6'
import { LiaCheckDoubleSolid } from "react-icons/lia";
import { Link } from 'react-router-dom'

const ChatsPage = ({ chats }) => {
    
    //const [chats, setChats] = useState([]);

    //const navigate = useNavigate()

    // useEffect(() => {
    //     const userID = localStorage.getItem('userID')
    //     const username = localStorage.getItem('username')

    //     if(userID && username){
    //         console.log(userID, username)
    //         socket.auth = { username, userID }
    //         socket.connect()
    //     }else{
    //         navigate('/login')
    //     }

    //     // socket.on('session', ({ userID, username })=> {
    //     //     socket.auth = { userID, username }
    //     //     localStorage.setItem("userID", userID)
    //     //     localStorage.setItem("username", username)
    //     //     socket.userID = userID
    //     //     socket.username = username
    //     // })

    //     // Emit the event to get chats
    //     socket.emit('getChats');

    //     // Clean up the effect
    //     socket.on('chats', (chats)=> {
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
    //     })
        
    //     return () => {
    //         socket.off('chats');
    //     };
    // }, [socket, navigate, setChats]);

    return(
        <>
            <div className="chats-page">
                <Header />
                <div className="chats">
                    {chats.length === 0 ? 
                        <Loading />
                        :
                        chats.map((chat, index) => (
                            <Link to={`/chat/${chat.username}`} key={index} className="chat">
                                <div className="profile-pics-last-message-container">
                                    <div className="profile-pics">
                                        <FaUser size={27}/>
                                    </div>
                                    <div className="participant_and_last-message">
                                        <div className="chat-participant">{chat.username}</div>
                                        <div className="status_last-message-container">
                                            <span className="status"> <LiaCheckDoubleSolid /> </span>
                                            <span className="chat-last-message">{chat.content}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="time-num-of-messages">
                                    <span className="time"> {new Date(chat.lastUpdated).toLocaleTimeString('en-US')} </span>
                                    <span className="num-of-messages">2</span>
                                </div>
                            </Link>
                       ))
                    }
                </div>
                <NewChatBtn />
            </div>
            <Footer />
        </>
    )
}

export default ChatsPage;
