import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from  'react'

const WelcomePage = () => {

    const navigate = useNavigate()

    useEffect(()=> {
        const user = localStorage.getItem('user')
        const userData = JSON.parse(user)
        const userID = userData?.userID
        const username = userData?.username
        //const loggedIn = !!(localStorage.getItem('userID') && localStorage.getItem('username'))
        if(userID && username){
            navigate('/chats')
        }
    })

    return(
        <div className="welcome-page">
            <div className="container">  
                <h1>Welcome To ChatApp</h1>

                <div className="register-login-links">
                    <Link to={'/register'}>Register</Link>
                    <Link to={'/login'}>Login</Link>
                </div>
            </div>
        </div>
    )
}

export default WelcomePage;
