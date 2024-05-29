import { Helmet } from "react-helmet"

const NotFound = ()=> {
    return(
        <div className="notfound-page">
            <Helmet>
                <title>404</title>
            </Helmet>
            Page Not Found (404)
        </div>
    )
}

export default NotFound
