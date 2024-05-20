import { useLocation, Link } from 'react-router-dom'

const Menu = ({ menuActive })=> {
    const location = useLocation()
    const pathname = location.pathname

    if(pathname === '/chats'){
        return(
            <div className={`menu ${menuActive ? 'menu-active': 'menu'}`}>
                <Link to={'/new-group'}>New group</Link>
                <Link to={'/new-broadcast'}>New broadcast</Link>
                <Link to={'/linked-devices'}>Link devices</Link>
                <Link to={'/starred-messages'}>Starred messages</Link>
                <Link to={'/settings'}>Settings</Link>
            </div>
        )
    }

    if(pathname === '/updates'){
        return(
            <div className="menu">
                <Link to={'/settings'}>Settings</Link>
            </div>
        )
    }

    if(pathname === '/communities'){
        return(
            <div className="menu">
                <Link to={'/settings'}>Settings</Link>
            </div>
        )
    }

    if(pathname === '/calls'){
        return(
            <div className="menu">
                <Link to={'/new-group'}>New group</Link>
                <Link to={'/new-broadcast'}>New broadcast</Link>
            </div>
        )
    }
}

export default Menu