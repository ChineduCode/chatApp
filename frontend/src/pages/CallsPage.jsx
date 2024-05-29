import Footer from '../components/Footer'
import { Helmet } from 'react-helmet'

const CallsPage = ()=> {
    return(
        <>
            <Helmet>
                <title>Calls</title>
            </Helmet>
            <section className="calls">Calls</section>
            <Footer />
        </>
    )
}

export default CallsPage
