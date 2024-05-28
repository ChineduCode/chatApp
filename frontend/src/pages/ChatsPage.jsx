import Header from '../components/ChatsHeader';
import Footer from '../components/Footer';
import NewChatBtn from '../components/NewChatBtn';
import Loading from '../components/Loading'
import NewChat from '../components/NewChat'
import { FaUser } from 'react-icons/fa6'
import { LiaCheckDoubleSolid } from "react-icons/lia";
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const ChatsPage = ({ chats }) => {
    const [loading, setLoading] = useState(false)

    useEffect(()=> {
        setLoading(true)
        if(chats || chats.length === 0){
            setLoading(false)
        }
    }, [chats])

    if(loading){
        <Loading />
    }

    if(chats.length === 0){
        <NewChat />
    }

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
