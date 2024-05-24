import { IoArrowBackOutline } from "react-icons/io5";
import { MdSearch, MdGroupAdd, MdPersonAddAlt1, MdGroups } from "react-icons/md";
import { HiMiniEllipsisVertical } from "react-icons/hi2";
import { FaUser } from 'react-icons/fa6'
import { Link } from  'react-router-dom'
import { useState, useEffect } from "react";

const SocketsPage = ({socket, users})=> {
    const [search, setSearch] = useState('')
    let [menuActive, setMenuActive] = useState(false)
    let [searchInputActive, setSearchInputActive] = useState(false)

    const handleSearch = (e)=> {
        e.preventDefault()
        console.log(search)
    }

    useEffect(()=> console.log(users))

    return( 
        <section className="sockets">
            <div className="header">
                <div className="first-container">
                    <div className="left-container">
                        <IoArrowBackOutline size={25}/>
                        <div className="container">
                            <div className="heading">Select contact</div>
                            <div className="sub-heading">200 contacts</div>
                        </div>
                    </div>

                    <div className="option">
                        <MdSearch size={25} className="search-svg" onClick={()=> setSearchInputActive(true)}/>
                        <div className="sockets-menu">
                            <HiMiniEllipsisVertical size={25} onClick={()=> setMenuActive(!menuActive)}/>
                            <div className={`menu ${menuActive ? 'menu-active' : 'menu'}`}>
                                <Link to={'/invite-a-friend'}>Invite a friend</Link>
                                <Link to={'/contacts'}>Contacts</Link>
                                <Link to={'/refresh'}>Refresh</Link>
                                <Link to={'/help'}>Help</Link>
                            </div>
                        </div>
                    </div>
                </div>

                <form className="search" onSubmit={handleSearch}>
                   <div className={`form-control ${searchInputActive ? 'search-input-active' : 'form-control'}`}>
                        <input 
                            type="search" 
                            name="search"
                            value={search}
                            onChange={(e)=> setSearch(e.target.value)}
                        />
                        <IoArrowBackOutline size={25} className="back-arrow-svg" onClick={()=> setSearchInputActive(false)}/>
                    </div>
                </form>
            </div>

            <div className="container">
                <div className="add-container">
                    <div className="new-group container">
                        <div className="icon"><MdGroupAdd size={25}/></div>
                        <div className="text">New Group</div>
                    </div>
                    <div className="new-contact container">
                        <div className="icon"><MdPersonAddAlt1 size={25}/></div>
                        <div className="text">New contact</div>
                    </div>
                    <div className="new-community container">
                        <div className="icon"><MdGroups size={25}/></div>
                        <div className="text">New community</div>
                    </div>
                </div>

                <div className="connected-sockets">
                    <div className="heading">Contacts on WhatsApp</div>
                    <ul className="contacts">
                        {users.map((user, index) => (
                            <li key={index} className="contact">
                                <Link to={`/chat/${user.username}`}>
                                    <div className="profile-pics">
                                        {/* {socket.image ? <img src={socket.image} alt=''/> : <FaUser size={27}/>} */}
                                        <FaUser size={27}/>
                                    </div>
                                    <div className="username-about-container">
                                        <div className="username"> {user.username} {user.self && "(You)"} </div>
                                        <div className="about">Hey there! I am on WhatsApp.</div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </section>
    )
}

export default SocketsPage;
