import Footer from "../components/Footer"
import { Helmet } from "react-helmet"

const CommunitiesPage = ()=> {
    return(
        <>
            <Helmet>
                <title>Communities</title>
            </Helmet>
            <section className="communities">Communities</section>
            <Footer />
        </>
    )
}

export default CommunitiesPage