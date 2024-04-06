import { useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

function ChatPage() {
    let { messageId } = useParams();

    return (
        <>
            <Navbar />
            <div className="container my-3">
                <h2>Chat</h2>
                <p>Chat for message ID: {messageId}</p>
            </div>
            <Footer />
        </>
    );
}

export default ChatPage;
