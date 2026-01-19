import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import ChatContainer from '../components/chat/ChatContainer';

const ChatPage = () => {
    const navigate = useNavigate();








    return (
        <div className="chat-layout h-screen w-screen flex overflow-hidden">
            {/* Sidebar with all navigation and chat management */}
            <Sidebar />

            {/* Main chat window */}
            <main className="chat-main flex-1 flex flex-col bg-axiom-bg">
                <ChatContainer />
            </main>
        </div>
    );
};

export default ChatPage;
