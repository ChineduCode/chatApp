import Header from './ChatsHeader';
import Footer from './Footer';
import NewChatBtn from './NewChatBtn';
import { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa6'
import { LiaCheckDoubleSolid } from "react-icons/lia";
import { Link } from 'react-router-dom'

const ChatsPage = ({ socket }) => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        // Emit the event to get chats
        socket.emit('getChats');

        // Listen for the messages event
        // socket.on('messages', (messages) => {
        //     const userID = socket.userID;
        //     const chatMap = new Map();

        //     messages.forEach(message => {
        //         const chatKey = [message.from._id, message.to._id].sort().join('-');
        //         if (!chatMap.has(chatKey)) {
        //             chatMap.set(chatKey, {
        //                 participants: [],
        //                 messages: []
        //             });
        //         }

        //         // Add participants
        //         if (!chatMap.get(chatKey).participants.find(participant => participant._id === message.from._id)) {
        //             chatMap.get(chatKey).participants.push(message.from);
        //         }
        //         if (!chatMap.get(chatKey).participants.find(participant => participant._id === message.to._id)) {
        //             chatMap.get(chatKey).participants.push(message.to);
        //         }

        //         // Label the message and add it to the chat
        //         const labeledMessage = {
        //             ...message,
        //             label: message.from._id === userID ? 'sent' : 'received'
        //         };
        //         chatMap.get(chatKey).messages.push(labeledMessage);
        //     });

        //     // Convert the map to an array and sort chats by the latest message
        //     const chatArray = Array.from(chatMap.values()).map(chat => {
        //         chat.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        //         chat.lastMessage = chat.messages[chat.messages.length - 1];
        //         return chat;
        //     });

        //     chatArray.sort((a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp));

        //     setChats(chatArray);
        // });

        // Clean up the effect
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
        
        return () => {
            socket.off('chats');
        };
    }, [socket]);

    return(
        <>
            <div className="chats-page">
                <Header />
                <div className="chats">
                    {chats.length === 0 ? 
                        <div>No Chats Available, Start a new Chat</div>
                        :
                        chats.map((chat, index) => (
                            <div to={`/chat/${chat.username}`} key={index} className="chat">
                                <div className="profile-pics-last-message-container">
                                    <div className="profile-pics">
                                        {socket.image ? <img src={socket.image} alt=''/> : <FaUser size={27}/>}
                                    </div>
                                    <Link to={`/chat/${chat.username}`} className="participant_and_last-message">
                                        <div className="chat-participant">{chat.username}</div>
                                        <div className="status_last-message-container">
                                            <span className="status"> <LiaCheckDoubleSolid /> </span>
                                            <span className="chat-last-message">{chat.content}</span>
                                        </div>
                                    </Link>
                                </div>
                                <Link to={`/chat/${chat.username}`} className="time-num-of-messages">
                                    <span className="time"> {new Date(chat.lastUpdated).toLocaleString()} </span>
                                    <span className="num-of-messages">2</span>
                                </Link>
                            </div>
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
