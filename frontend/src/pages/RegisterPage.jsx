import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import errorDisplay from '../errorDisplay'
import { Helmet } from 'react-helmet'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'

const RegisterPage = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [passwordShown, setPasswordShown] = useState(false)

    const navigate = useNavigate()
    
    //Handle from Submit
    const handleRegister = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json()

            if(response.ok){
                console.log(data.message)
                setUsername('')
                setEmail('')
                setPassword('')
                navigate('/login')
            }else{
                await errorDisplay(data.message, setError)
                console.error(`Error:`, data.message)
            }


        } catch (error) {
            console.error('Error Registering User:', error.message)
        }
    }
    

    return(
        <form className="register-page" onSubmit={handleRegister}>
            <Helmet>
                <title>Register</title>
            </Helmet>
            <h2 className="heading">Create an Account</h2>
            <small className={`no-error ${error ? 'error': 'no-error'}`}>{error}</small>
            <div className="form-control">
                <label htmlFor="username">Username:</label>
                <input 
                    type="text" 
                    name="username" 
                    className="username" 
                    value={username}
                    onChange={(e)=> setUsername(e.target.value)}
                    required
                />
            </div>
            <div className="form-control">
                <label htmlFor="email">Email:</label>
                <input 
                    type="email" 
                    name="email" 
                    className='email' 
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="form-control form-control-password">
                <label htmlFor="password">Password:</label>
                <input 
                    type={`${passwordShown ? 'text' : 'password'}`}
                    name="password" 
                    className="password" 
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    required
                />

                {passwordShown && <FaRegEye onClick={()=> setPasswordShown(false)}/>}
                {!passwordShown && <FaRegEyeSlash onClick={()=> setPasswordShown(true)}/>}
            </div>

            <button type="submit">Create Account</button>

            <div className="login-link">
                Already have an account ? <Link to={"/login"}>Login</Link>
            </div>
        </form>
    )
}

export default RegisterPage;
