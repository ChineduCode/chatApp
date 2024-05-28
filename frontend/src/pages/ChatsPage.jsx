import Header from '../components/ChatsHeader';
import Footer from '../components/Footer';
import NewChatBtn from '../components/NewChatBtn';
import Loading from '../components/Loading';
import NewChat from '../components/NewChat';
import Chats from '../components/Chats';
import { useState, useEffect } from 'react';

const ChatsPage = ({ chats }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        if (chats || chats.length === 0) {
            setLoading(false);
        }
    }, [chats]);

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            <div className="chats-page">
                <Header chats={chats}/>
                { chats.length === 0 ? <NewChat /> : <Chats chats={chats}/> }
                <NewChatBtn />
            </div>
            <Footer />
        </>
    );
};

export default ChatsPage;
