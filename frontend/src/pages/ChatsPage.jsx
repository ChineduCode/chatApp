import Header from '../components/ChatsHeader';
import Footer from '../components/Footer';
import NewChatBtn from '../components/NewChatBtn';
import NewChat from '../components/NewChat';
import Loading from '../components/Loading';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa6';
import { LiaCheckDoubleSolid } from "react-icons/lia";
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet'

const ChatsPage = ({ socket }) => {
    const [chats, setChats] = useState([])

    useEffect(() => {
        const handleChats = (chats)=> {
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
        }

        // Emit the event to get chats
        socket.emit('getChats');
        socket.on('chats', handleChats);

        return () => {
            socket.off('chats', handleChats);
        };
    }, [socket, setChats]);
    
    // useEffect(()=> {
    //     if(chats){
    //         setLoading(false)
    //     }

    // },[chats])

    // if(loading){
    //     return <Loading />
    // }

    // if(chats.length === 0){
    //     return setChatsExist(false)
    // }

    return (
        <>
            <Helmet>
                <title>Chats</title>
            </Helmet>
            <div className="chats-page">
                <Header chats={chats}/>
                <div className="chats">
                    {!chats ? <Loading /> : chats.length === 0 ? <NewChat /> : chats.map((chat, index) => (
                        <Link to={`/chat/${chat.username}`} key={index} className="chat">
                            <div className="profile-pics-last-message-container">
                                <div className="profile-pics">
                                    <FaUser size={27} />
                                </div>
                                <div className="participant_and_last-message">
                                    <div className="chat-participant">{chat.username}</div>
                                    <div className="status_last-message-container">
                                        <span className="status"><LiaCheckDoubleSolid /></span>
                                        <span className="chat-last-message">{chat.content}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="time-num-of-messages">
                                <span className="time">{new Date(chat.lastUpdated).toLocaleTimeString('en-US')}</span>
                                <span className="num-of-messages">2</span>
                            </div>
                        </Link>
                    ))}
                </div>
                <NewChatBtn />
            </div>
            <Footer />
        </>
    );
};

export default ChatsPage;
