import React, { useState, useEffect, useRef } from 'react';
import { HiMiniEllipsisVertical } from "react-icons/hi2";
import { MdOutlineVideocam, MdOutlineCall, MdKeyboardVoice, MdSend } from "react-icons/md";
//import { MdOutlineEmojiEmotions, MdOutlineAttachFile, MdOutlinePhotoCamera, MdOutlineKeyboard } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";
import { IoMdArrowDropright } from "react-icons/io";
import { FaUser } from 'react-icons/fa6'
import { Link, useParams } from 'react-router-dom'

const ChatApp = ({socket, users}) => {
    const { username } = useParams()
    const [selectedUser, setSelectedUser] = useState(null);
    const [textMessage, setTextMessage] = useState('')
    let [menuActive, setMenuActive] = useState(false)
    let [textareaActive, setTextareaActive] = useState(false)
    const [messages, setMessages] = useState([])
    const chatContainerRef = useRef(null)

    useEffect(()=> {
        const user = users.find(user => user.username.toLowerCase() === username.toLowerCase())
        setSelectedUser(user)

    },[ username, users, selectedUser, socket])
    
    useEffect(()=> {
        socket.emit('getMessages')
        
        socket.on("messages", (message)=> {
            
            if(selectedUser){
                const filteredMessages = message.filter(msg => (msg.from === selectedUser._id) || (msg.to === selectedUser._id))
                setMessages(filteredMessages.map((msg)=> ({
                    ...msg,
                    fromSelf: msg.from === socket.userID
                })))
            }
        })

        return ()=> {
            socket.off('messages')
        }
    },[selectedUser, socket])

    
    useEffect(()=> {
        const handlePrivateMessage = ({ content, from }) => {
            if(selectedUser && from === selectedUser._id){
                setMessages(prevMessages => [...prevMessages, {content, fromSelf: false}])
            }
        }

        socket.on('private message', handlePrivateMessage)

        return ()=> {
            socket.off('private message', handlePrivateMessage);        
        }
    }, [messages, selectedUser, socket])

    //Scroll to the bottom when the messages updates
    useEffect(()=> {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }

    }, [messages])

    const handleTextarea = (e)=> {
        const text = e.target.value
        setTextMessage(text)
        setTextareaActive(!!text)
    }

    const handleMessage = (e) => {
        e.preventDefault();
        if (textMessage.trim() && selectedUser) {
            socket.emit("private message", {
                content: textMessage,
                to: selectedUser._id,
            });

            setMessages(prevMessages => [...prevMessages, {content: textMessage, fromSelf: true}])
            
            setTextMessage('');
            setTextareaActive(false);
        }
    };

    const handleKeyDown = (e)=> {
        if(e.key === 'Enter' && !e.shiftKey){
            e.preventDefault()
            handleMessage(e)
        }
    }


    return (
        <div className='chat-page'>
            <div className="header">
                <div className="profile">
                    <IoArrowBackOutline />
                    <div className="profile-pics">
                        <FaUser size={27}/>
                    </div>
                    <div className="username-last-seen-container">
                        <div className="username">{username}</div> 
                        <div className="last-seen"></div>
                    </div>
                </div>
                <div className="options">
                    <MdOutlineVideocam size={25}/>
                    <MdOutlineCall className='call-svg' size={25}/>
                    <div className="chat-menu">
                        <HiMiniEllipsisVertical size={25} onClick={()=> setMenuActive(!menuActive)}/>
                        <div className={`menu ${menuActive ? 'menu-active' : 'menu'}`}>
                            <Link to={'/view-contact'}>View contact</Link>
                            <Link to={'/media-links-docs'}>Media, links, and docs</Link>
                            <Link to={'/search'}>Search</Link>
                            <Link to={'/mute-notifications'}>Mute notification</Link>
                            <Link to={'/disappearing-messages'}>Disappearing messages</Link>
                            <Link to={'/wallpaper'}>Wallpaper</Link>
                            <Link to={'/more'}> <span>More</span> <IoMdArrowDropright /> </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={chatContainerRef} className='messages-container'>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.fromSelf ? 'sent' : 'received'}`}
                    >
                        {message.content.split('\n').map((msg, index)=> (
                            <React.Fragment key={index}>
                                {msg}
                                <br/>
                            </React.Fragment>
                        ))}
                    </div>
                ))}
            </div>

            <form className='footer' onSubmit={handleMessage}>
                <div className="textarea">
                    <textarea
                        placeholder="Message"
                        className='input-field'
                        value={textMessage}
                        onChange={handleTextarea}
                        onKeyDown={handleKeyDown}
                    ></textarea>
                </div>

                <button type='submit' className='send-button'>
                    { textareaActive ? <MdSend size={22}/> : <MdKeyboardVoice size={22}/> }
                </button>
            </form>
        </div>
    );
};

export default ChatApp;
