import { Link } from 'react-router-dom'

const WelcomePage = () => {
    return(
        <div className="welcome">
            <div className="container">  
                <h1>Welcome To WhatsApp</h1>

                <div className="register-login-links">
                    <Link to={'/register'}>Register</Link>
                    <Link to={'/login'}>Login</Link>
                </div>
            </div>
        </div>
    )
}

export default WelcomePage;
