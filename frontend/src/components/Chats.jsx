import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa6';
import { LiaCheckDoubleSolid } from "react-icons/lia";

const Chats = ({chats})=> {
    return(
        <div className="chats">
                    {chats.map((chat, index) => (
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
    )
}

export default Chats
