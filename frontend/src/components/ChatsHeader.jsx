import { FaMagnifyingGlass } from 'react-icons/fa6'
import { AiOutlineCamera } from 'react-icons/ai'
import { useRef, useState } from 'react';
import HeaderMenu from './HeaderMenu';

const Header = ({chats}) => {
    const [focus, setFocus] = useState(false)
    const myRef = useRef(null)

    function onFocus(e){
        setFocus(true)
        e.target.style.border = 'none'
    }

    function onBlur(){
        setFocus(false)
    }

    return(
        <header className="header">
            <div className="top">
                <div className="logo">ChatApp</div>
                <div className="camera-menu-container">
                    <AiOutlineCamera size={25} className='camera-icon' />
                    <HeaderMenu />
                </div>
            </div>
            {
                chats.length > 0
                &&
                <div className="search">
                    <input 
                        type="search" 
                        name="search message" 
                        className={`search-input ${focus ? 'search-input-active': 'search-input'}`}
                        onFocus={onFocus}
                        onBlur={onBlur}
                    />
                <div className={`search-placeholder ${focus ? 'search-placeholder-active': 'search-placeholder'}`} ref={myRef}> <FaMagnifyingGlass /> <span>Search...</span> </div>
                </div>
            }
        </header>
    )
}

export default Header;
