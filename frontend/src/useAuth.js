import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = () => {
    const userID = localStorage.getItem('userID');
    const username = localStorage.getItem('username');

    return(
        (userID && username) ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoutes
