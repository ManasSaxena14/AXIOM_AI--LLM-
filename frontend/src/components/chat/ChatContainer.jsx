import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMessages } from '../../hooks/useMessages';
import { useChats } from '../../hooks/useChats';
import Message from './Message';
import {
    ArrowUp,
    AlertCircle,
    Code,
    Brain,
    Menu,
    Trash2,
    Pin,
    PinOff,
    User,
    Check,
    Share,
    ChevronDown,
    MessageSquare
} from 'lucide-react';

const MODES = [
    { id: 'chat', label: 'Standard Chat', icon: MessageSquare, desc: 'Balanced for general tasks', tint: 'text-axiom-brand' },
    { id: 'reasoning', label: 'Deep Thinking', icon: Brain, desc: 'Best for complex logic', tint: 'text-purple-400' },
    { id: 'code', label: 'Code Mode', icon: Code, desc: 'Expert assistant for developers', tint: 'text-blue-400' },
];

const ModeSelector = ({ activeMode, setActiveMode, isModePopoverOpen, setIsModePopoverOpen, activeModeData }) => (
    <div className="relative">
        <button
            type="button"
            onClick={() => setIsModePopoverOpen(!isModePopoverOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isModePopoverOpen
                ? 'bg-white/10 border-white/20 text-white shadow-lg'
                : 'bg-white/5 border-white/5 text-axiom-text-tertiary hover:border-white/10 hover:text-white'
                }`}
        >
            <activeModeData.icon size={14} className={activeModeData.tint} />
            <span className="text-[11px] font-semibold tracking-tight">{activeModeData.label}</span>
            <ChevronDown size={12} className={`transition-transform duration-200 ${isModePopoverOpen ? 'rotate-180' : ''}`} />
        </button>

        {isModePopoverOpen && (
            <>
                <div className="fixed inset-0 z-40" onClick={() => setIsModePopoverOpen(false)} />
                <div className="absolute bottom-full left-0 mb-3 w-[260px] bg-axiom-surface border border-axiom-border rounded-2xl p-2 shadow-2xl z-50 animate-fade-in backdrop-blur-xl">
                    <div className="text-[10px] font-bold text-axiom-text-tertiary uppercase tracking-widest px-3 py-2 mb-1">
                        Select Thinking Mode
                    </div>
                    <div className="space-y-1">
                        {MODES.map((m) => (
                            <button
                                key={m.id}
                                type="button"
                                onClick={() => {
                                    setActiveMode(m.id);
                                    setIsModePopoverOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${activeMode === m.id
                                    ? 'bg-white/5 border border-white/5 text-white'
                                    : 'text-axiom-text-secondary hover:bg-white/5 hover:text-white border border-transparent'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center ${m.tint} border border-white/5`}>
                                    <m.icon size={16} />
                                </div>
                                <div className="flex flex-col items-start pr-2">
                                    <span className="text-[13px] font-bold">{m.label}</span>
                                    <span className="text-[10px] text-axiom-text-tertiary leading-tight">{m.desc}</span>
                                </div>
                                {activeMode === m.id && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-axiom-brand shadow-[0_0_8px_rgba(16,163,127,1)]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </>
        )}
    </div>
);

const ChatContainer = () => {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { chats, createChat, updateChat, deleteChat } = useChats();
    const { messages, sendMessage, isLoading, isSending, error } = useMessages(chatId);


    const [input, setInput] = useState('');
    const [activeMode, setActiveMode] = useState('chat');
    const [isModePopoverOpen, setIsModePopoverOpen] = useState(false);
    const [streamingMessageId, setStreamingMessageId] = useState(null);
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
    const { showToast } = useToast();


    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const hasAutoSent = useRef(false);


    const currentChat = chats.find(c => c._id === chatId);
    const activeModeData = MODES.find(m => m.id === activeMode) || MODES[0];


    const scrollToBottom = (behavior = 'auto') => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };


    useEffect(() => {
        const checkAutoSend = async () => {
            const initialMessage = location.state?.initialMessage;
            const initialMode = location.state?.initialMode || activeMode;

            if (chatId && initialMessage && !hasAutoSent.current && !isLoading && messages.length === 0) {
                hasAutoSent.current = true;

                if (initialMode !== activeMode) setActiveMode(initialMode);


                navigate(location.pathname, { replace: true, state: {} });

                try {
                    const result = await sendMessage({ message: initialMessage, mode: initialMode });
                    if (result.assistantMessage) {
                        setStreamingMessageId(result.assistantMessage._id);
                    }
                } catch {
                    console.error('Auto-send failed');
                }
            }
        };
        checkAutoSend();
        scrollToBottom('smooth');
    }, [messages, isSending, chatId, isLoading, location.state, navigate, location.pathname, sendMessage, activeMode]);


    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || isSending) return;

        const content = input;
        setInput('');
        setStreamingMessageId(null);

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        try {
            const result = await sendMessage({ message: content, mode: activeMode });
            if (result.assistantMessage) {
                setStreamingMessageId(result.assistantMessage._id);
            }
        } catch (error) {
            showToast(error.response?.data?.message || error.message || 'Failed to connect to Axiom network.', 'error');
            setInput(content);
        }
    };

    const handleCreateChatFromLanding = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;


        let detectedMode = activeMode;
        const lowInput = input.toLowerCase();

        if (lowInput.includes('code') || lowInput.includes('function') || lowInput.includes('const ') || lowInput.includes('public static')) {
            detectedMode = 'code';
        } else if (lowInput.includes('analyze') || lowInput.includes('evaluate') || lowInput.includes('reasoning') || lowInput.includes('why ')) {
            detectedMode = 'reasoning';
        }

        try {
            const chat = await createChat({
                title: 'New Chat',
                mode: detectedMode
            });
            navigate(`/chat/${chat._id}`, {
                state: { initialMessage: input, initialMode: detectedMode }
            });
            setInput('');
        } catch {
            showToast('Unable to initialize secure session.', 'error');
        }
    };

    const handleShare = () => {
        const url = `${window.location.origin}/chat/${chatId}`;
        navigator.clipboard.writeText(url);
        showToast('Secure session link copied to clipboard.', 'success');
    };

    if (!chatId) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 bg-axiom-bg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,163,127,0.03)_0%,transparent_50%)]" />

                <div className="max-w-2xl w-full z-10 flex flex-col items-center gap-12 -mt-20">
                    <div className="text-center space-y-4">
                        <div className="flex items-center justify-center gap-6 mb-4 animate-pulse-subtle">
                            <img src="/logo-symbol.png" alt="AxiomAI Symbol" className="w-24 h-auto mix-blend-screen" />
                            <span className="text-6xl font-black tracking-tighter text-white">
                                Axiom<span className="text-axiom-brand">AI</span>
                            </span>
                        </div>
                        <p className="text-axiom-text-tertiary text-sm mt-2 flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-axiom-brand" />
                            Start a chat to explore
                        </p>
                    </div>

                    {/* Mode Selection Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full animate-fade-in delay-100">
                        {MODES.map((m) => (
                            <button
                                key={m.id}
                                type="button"
                                onClick={() => setActiveMode(m.id)}
                                className={`flex flex-col items-center gap-4 p-6 rounded-[24px] border transition-all group ${activeMode === m.id
                                    ? 'bg-axiom-brand/5 border-axiom-brand/30 shadow-2xl shadow-axiom-brand/5'
                                    : 'bg-axiom-surface/40 border-axiom-border hover:border-white/10 hover:bg-axiom-surface/60'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center ${m.tint} border border-white/5 transition-transform group-hover:scale-110`}>
                                    <m.icon size={24} />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-sm font-bold text-white mb-1">{m.label}</h3>
                                    <p className="text-[10px] text-axiom-text-tertiary uppercase tracking-widest font-bold">
                                        {m.id === 'chat' ? 'GROQ ENGINE' : 'CEREBRAS ENGINE'}
                                    </p>
                                </div>
                                {activeMode === m.id && (
                                    <div className="mt-auto px-2 py-0.5 bg-axiom-brand/20 rounded-full">
                                        <span className="text-[8px] font-black text-axiom-brand uppercase tracking-tighter">Active</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>


                    {/* Input Bar */}
                    <div className="w-full max-w-2xl relative">
                        <form
                            className="relative bg-axiom-surface border border-axiom-border rounded-3xl p-3 shadow-2xl focus-within:border-white/20 transition-all"
                            onSubmit={handleCreateChatFromLanding}
                        >
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    e.target.style.height = 'auto';
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleCreateChatFromLanding(e);
                                    }
                                }}
                                placeholder="What's on your mind?"
                                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-axiom-text-tertiary px-3 py-2 resize-none max-h-[200px] text-lg outline-none"
                                rows={1}
                            />
                            <div className="flex items-center justify-between px-2 pt-2">
                                <ModeSelector
                                    activeMode={activeMode}
                                    setActiveMode={setActiveMode}
                                    isModePopoverOpen={isModePopoverOpen}
                                    setIsModePopoverOpen={setIsModePopoverOpen}
                                    activeModeData={activeModeData}
                                />
                                <button
                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${input.trim() ? 'bg-white text-black' : 'bg-white/5 text-white/20 pointer-events-none'}`}
                                    type="submit"
                                >
                                    <ArrowUp size={20} strokeWidth={2.5} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="flex-1 flex flex-col bg-axiom-bg overflow-hidden relative">
            {/* Header */}
            <header className="h-16 border-b border-axiom-border flex items-center justify-center px-6 bg-axiom-bg/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="chat-column flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold text-axiom-brand uppercase tracking-widest leading-none mb-1.5">
                                {activeModeData.label}
                            </span>
                            <h2 className="text-sm font-bold text-white truncate max-w-[400px]">
                                {currentChat?.title || 'Active Session'}
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-transparent hover:bg-white/5 text-axiom-text-tertiary hover:text-white transition-all"
                        >
                            <Share size={16} />
                            <span className="text-[11px] font-bold uppercase tracking-wider">Share</span>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                                className={`p-2 rounded-xl transition-all ${isActionMenuOpen ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-axiom-text-tertiary hover:text-white'}`}
                            >
                                <Menu size={20} />
                            </button>

                            {isActionMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsActionMenuOpen(false)} />
                                    <div className="absolute top-full right-0 mt-2 w-56 bg-axiom-surface border border-axiom-border rounded-2xl p-2 shadow-2xl z-50 animate-fade-in backdrop-blur-xl">
                                        <div className="space-y-1">
                                            <button
                                                onClick={() => {
                                                    const isPinned = currentChat?.isPinned;
                                                    updateChat({ chatId, updates: { isPinned: !isPinned } });
                                                    setIsActionMenuOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-axiom-text-secondary hover:bg-white/5 hover:text-white transition-all text-sm font-medium"
                                            >
                                                {currentChat?.isPinned ? <PinOff size={16} /> : <Pin size={16} />}
                                                {currentChat?.isPinned ? 'Unpin Conversation' : 'Pin Conversation'}
                                            </button>

                                            <button
                                                onClick={() => {
                                                    navigate('/profile');
                                                    setIsActionMenuOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-axiom-text-secondary hover:bg-white/5 hover:text-white transition-all text-sm font-medium"
                                            >
                                                <User size={16} />
                                                View Profile
                                            </button>

                                            <div className="h-px bg-white/5 my-1" />

                                            <button
                                                onClick={() => {
                                                    deleteChat(chatId);
                                                    navigate('/chat');
                                                    showToast('Conversation purged successfully.', 'info');
                                                    setIsActionMenuOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-all text-sm font-medium"
                                            >
                                                <Trash2 size={16} />
                                                Delete Chat
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Chat Stream */}
            <div className="flex-1 overflow-y-auto pt-8 pb-40">
                <div className="chat-column space-y-12">
                    {messages.length === 0 && !isLoading && !isSending && (
                        <div className="text-center py-20 animate-fade-in">
                            <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-6 overflow-hidden">
                                <img src="/logo-symbol.png" alt="AxiomAI" className="w-10 h-auto opacity-40 mix-blend-screen" />
                            </div>
                            <p className="text-axiom-text-tertiary text-sm font-medium">Session is encrypted and ready.</p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <Message
                            key={msg._id}
                            role={msg.role}
                            content={msg.content}
                            isNew={msg._id === streamingMessageId}
                        />
                    ))}

                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl text-red-400 text-sm animate-fade-in mx-auto max-w-md">
                            <AlertCircle size={18} />
                            <span>Neural link failed. Testing connection...</span>
                        </div>
                    )}

                    {isSending && (
                        <div className="flex items-start gap-6 py-10">
                            <div className="w-8 h-8 rounded-lg bg-axiom-surface border border-axiom-border flex items-center justify-center flex-shrink-0 overflow-hidden">
                                <img src="/logo-symbol.png" alt="AxiomAI" className="w-5 h-auto animate-pulse mix-blend-screen" />
                            </div>
                            <div className="flex-1 space-y-4 pt-1">
                                <div className="h-2 bg-white/5 rounded-full w-full animate-pulse" />
                                <div className="h-2 bg-white/5 rounded-full w-[90%] animate-pulse" />
                                <div className="h-2 bg-white/5 rounded-full w-[40%] animate-pulse" />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} className="h-4" />

                    {/* Follow-up Suggestions */}
                    {!isSending && messages.length > 0 && !streamingMessageId && (
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 animate-fade-in px-4">
                            <span className="text-[10px] font-bold text-axiom-text-tertiary uppercase tracking-[0.2em] mr-2">Suggestions</span>
                            {[
                                "Tell me more",
                                "Provide an example",
                                "Explain simply"
                            ].map((suggestion) => (
                                <button
                                    key={suggestion}
                                    onClick={() => {
                                        setInput(suggestion);

                                        const event = { preventDefault: () => { } };
                                        setTimeout(() => handleSend(event), 0);
                                    }}
                                    className="px-3 py-1.5 bg-white/5 border border-white/5 hover:border-axiom-brand/30 hover:bg-white/10 text-axiom-text-secondary hover:text-white rounded-full text-[11px] font-medium transition-all"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Input Footer */}
            <div className="absolute bottom-0 left-0 w-full p-6 pb-10 bg-gradient-to-t from-axiom-bg via-axiom-bg to-transparent">
                <div className="chat-column relative">
                    <form
                        className="relative bg-axiom-surface border border-axiom-border rounded-[28px] p-3 shadow-2xl focus-within:border-white/20 transition-all"
                        onSubmit={handleSend}
                    >
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(e);
                                }
                            }}
                            placeholder="Message Axiom..."
                            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-axiom-text-tertiary px-3 py-2 resize-none max-h-[300px] text-base outline-none"
                            rows={1}
                        />
                        <div className="flex items-center justify-between px-2 pt-2">
                            <ModeSelector
                                activeMode={activeMode}
                                setActiveMode={setActiveMode}
                                isModePopoverOpen={isModePopoverOpen}
                                setIsModePopoverOpen={setIsModePopoverOpen}
                                activeModeData={activeModeData}
                            />
                            <button
                                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${input.trim() ? 'bg-white text-black' : 'bg-white/5 text-white/20 pointer-events-none'}`}
                                type="submit"
                                disabled={!input.trim() || isSending}
                            >
                                <ArrowUp size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                    </form>
                    <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-axiom-text-tertiary font-bold uppercase tracking-[0.2em]">
                        <span className="opacity-50">v1.2.4</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="opacity-50">Quantum Secure</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatContainer;
