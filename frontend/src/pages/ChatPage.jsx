import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatContainer from '../components/chat/ChatContainer';

const ChatPage = () => {
    return (
        <div className="chat-layout h-screen w-screen flex overflow-hidden">
            <Sidebar />

            <main className="chat-main flex-1 flex flex-col bg-axiom-bg">
                <ChatContainer />
            </main>
        </div>
    );
};

export default ChatPage;
