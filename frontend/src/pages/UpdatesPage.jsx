import Footer from "../components/Footer"
import { Helmet } from "react-helmet"

const UpdatesPage = ()=>{
    return(
        <>
            <Helmet>
                <title>Updates</title>
            </Helmet>
            <section className="updates">
                Updates
            </section>
            <Footer />
        </>
    )
}

export default UpdatesPage