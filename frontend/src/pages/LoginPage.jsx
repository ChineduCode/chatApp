import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import errorDisplay from '../errorDisplay'
import { Helmet } from 'react-helmet'
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";

const LoginPage = ({ onSelectUsername }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [passwordShown, setPasswordShown] = useState(false)

    const navigate = useNavigate()

    useEffect(()=> {
        const user = localStorage.getItem('user')
        const userData = JSON.parse(user)
        const userID = userData?.userID
        const username = userData?.username

        if(userID && username){
            navigate('/chats')
        }
    })
    
    //Handle from Submit
    const handleLogin = async (e)=> {
        e.preventDefault()

        try{
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})
            })

            const data = await response.json()
            if(response.ok){
                onSelectUsername(data)
                setUsername('')
                setPassword('')
                navigate('/chats')

            }else{
                await errorDisplay(data.message, setError)
            }
        
        }catch(error){
            console.log(error.message)
            return
        }
    }


    return(
        <form className="login-page" onSubmit={handleLogin}>
            <Helmet>
                <title>Login</title>
            </Helmet>
            <h2 className="heading">Login</h2>
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

            <button type="submit">Login</button>

            <div className="register-link">
                Don't have an accont ? <Link to={"/register"}>Register</Link>
            </div>
        </form>
    )
}

export default LoginPage;
