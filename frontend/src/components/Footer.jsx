import { PiChatTextLight } from "react-icons/pi"
import { FiMessageCircle } from "react-icons/fi";
import { MdOutlineGroups, MdOutlineCall } from "react-icons/md";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Footer = ()=>{
    const [currentPage, setCurrentPage] = useState(null)
    const location = useLocation()
    const path = location.pathname
    
    const handlePageClick = (pageName) => {
        console.log('Clicked :', pageName)
        setCurrentPage(pageName)
    }

    useEffect(()=> {
        switch (path) {
            case '/chats':
                setCurrentPage('chats')
                break;
            case '/updates':
                setCurrentPage('updates')
                break;
            case '/communities':
                setCurrentPage('communities')
                break;
            case '/calls':
                setCurrentPage('calls')
                break;
            default:
                setCurrentPage('chats')
                break;
        }
        
    },[path])

    return(
        <footer >
            <Link to={'/chats'} className={`chats page ${currentPage === 'chats' ? 'active-page' : ''}`} onClick={()=> handlePageClick('chats')}>
                <div className="icon"> <PiChatTextLight size={22}/> </div>
                <div className="text">Chats</div>
            </Link>
            <Link to={'/updates'} className={`updates page ${currentPage === 'updates' ? 'active-page' : ''}`} onClick={()=> handlePageClick('updates')}>
                <div className="icon"> <FiMessageCircle size={22}/> </div>
                <div className="text">Updates</div>
            </Link>
            <Link to={'/communities'} className={`communities page ${currentPage === 'communities' ? 'active-page' : ''}`} onClick={()=> handlePageClick('communities')}>
                <div className="icon"> <MdOutlineGroups size={22}/> </div>
                <div className="text">Communities</div>
            </Link>
            <Link to={'/calls'} className={`calls page ${currentPage === 'calls' ? 'active-page' : ''}`} onClick={()=> handlePageClick('calls')}>
                <div className="icon"> <MdOutlineCall size={22}/> </div>
                <div className="text">Calls</div>
            </Link>
        </footer>
    )
}

export default Footer;
