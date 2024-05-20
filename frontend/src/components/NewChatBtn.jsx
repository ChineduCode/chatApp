import { BiCommentAdd } from "react-icons/bi";
import { Link } from 'react-router-dom'

const NewChatBtn = ()=> {
    return(
        <Link to={'/sockets'}>
            <button className='new-chat-btn'>
                <BiCommentAdd size={25}/>
            </button>
        </Link>
    )
}

export default NewChatBtn;