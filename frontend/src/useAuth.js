import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = () => {
    const user = localStorage.getItem('user')
    const userData = JSON.parse(user)
    const userID = userData?.userID
    const username = userData?.username

    return(
        (userID && username) ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoutes
