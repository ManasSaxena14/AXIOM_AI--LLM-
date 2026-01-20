import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useChats } from '../../hooks/useChats';
import { useAuth } from '../../contexts/AuthContext';
import {
    Plus,
    Trash2,
    Code,
    Brain,
    LogOut,
    ChevronRight,
    Search,
    MoreHorizontal,
    Pin,
    Share,
    Check,
    User,
    Shield
} from 'lucide-react';

const Sidebar = () => {
    const { chatId: activeChatId } = useParams();
    const { chats, deleteChat, updateChat, isLoading } = useChats();
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [menuOpenId, setMenuOpenId] = useState(null);
    const { showToast } = useToast();

    const handleNewChat = () => {
        navigate('/chat');
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();

        const chatToDelete = chats.find(c => c._id === id);
        if (chatToDelete?.isPinned) {
            showToast('Pinned sessions are protected. Unpin to purge.', 'warning');
            return;
        }

        try {
            await deleteChat(id);
            showToast('Session purged from Axiom network.', 'info');
            if (activeChatId === id) {
                navigate('/chat');
            }
        } catch {
            showToast('Purge operation failed.', 'error');
        }
    };

    const handleShare = (id) => {
        const url = `${window.location.origin}/chat/${id}`;
        navigator.clipboard.writeText(url);
        showToast('Session link copied to clipboard.', 'success');
        setMenuOpenId(null);
    };

    const handlePin = async (e, chat) => {
        e.stopPropagation();
        try {
            await updateChat({ chatId: chat._id, updates: { isPinned: !chat.isPinned } });
            showToast(chat.isPinned ? 'Session unpinned.' : 'Session pinned for quick access.', 'success');
            setMenuOpenId(null);
        } catch {
            showToast('State update failed.', 'error');
        }
    };

    const sortedChats = [...chats].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const filteredChats = sortedChats.filter(chat =>
        chat.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <aside className="w-[280px] bg-axiom-surface border-r border-axiom-border flex flex-col h-full z-20">
            <div className="p-5">
                <div className="flex items-center gap-3 mb-6 group cursor-default">
                    <img src="/logo-symbol.png" alt="AxiomAI Symbol" className="h-8 w-auto mix-blend-screen" />
                    <span className="text-xl font-bold tracking-tight text-white/95">
                        Axiom<span className="text-axiom-brand">AI</span>
                    </span>
                </div>

                <button
                    onClick={handleNewChat}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-axiom transition-all active:scale-[0.98] group"
                >
                    <Plus size={16} className="text-axiom-text-secondary group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium">New Session</span>
                </button>
            </div>

            <div className="px-5 mb-4">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-axiom-text-tertiary group-focus-within:text-white transition-colors" size={14} />
                    <input
                        type="text"
                        placeholder="Search history..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/20 border border-axiom-border rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-axiom-text-tertiary focus:outline-none focus:border-axiom-brand/50 transition-all"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
                {user?.role === 'admin' && (
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 mb-4 text-axiom-text-secondary hover:bg-white/5 hover:text-white rounded-axiom transition-all group"
                    >
                        <Shield size={16} className="text-axiom-brand group-hover:text-white transition-colors" />
                        <span className="text-[13px] font-medium tracking-tight">Admin Dashboard</span>
                    </button>
                )}

                <h3 className="text-[10px] font-bold text-axiom-text-tertiary uppercase tracking-widest px-3 mb-2 mt-4">
                    Recent History
                </h3>

                {isLoading ? (
                    <div className="px-3 space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-8 bg-white/5 rounded-lg animate-pulse" />)}
                    </div>
                ) : filteredChats.length === 0 ? (
                    <div className="px-3 py-4 text-center">
                        <p className="text-[10px] text-axiom-text-tertiary">No sessions found</p>
                    </div>
                ) : (
                    filteredChats.map((chat) => (
                        <div
                            key={chat._id}
                            onClick={() => navigate(`/chat/${chat._id}`)}
                            className={`group flex items-center justify-between px-3 py-2.5 rounded-axiom cursor-pointer transition-all relative ${activeChatId === chat._id ? 'bg-axiom-hover text-white shadow-sm' : 'text-axiom-text-secondary hover:bg-white/5 hover:text-white'}`}
                        >
                            <div className="flex items-center gap-2 truncate pr-4">
                                {chat.isPinned && (
                                    <Pin size={10} className="text-axiom-brand flex-shrink-0 rotate-45" />
                                )}
                                <span className="text-[13px] truncate font-medium tracking-tight">
                                    {chat.title || 'New Session'}
                                </span>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    className={`p-1 hover:bg-white/10 rounded-md transition-all text-axiom-text-tertiary hover:text-white ${menuOpenId === chat._id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMenuOpenId(menuOpenId === chat._id ? null : chat._id);
                                    }}
                                >
                                    <MoreHorizontal size={14} />
                                </button>
                            </div>

                            {menuOpenId === chat._id && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpenId(null)} />
                                    <div className="absolute top-10 right-2 w-40 bg-axiom-surface border border-axiom-border rounded-xl shadow-2xl py-1 z-50 animate-fade-in overflow-hidden">
                                        <button
                                            onClick={(e) => handlePin(e, chat)}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-[12px] text-axiom-text-secondary hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                            <Pin size={14} className={chat.isPinned ? 'text-axiom-brand' : ''} />
                                            {chat.isPinned ? 'Unpin' : 'Pin chat'}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleShare(chat._id);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-[12px] text-axiom-text-secondary hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                            <Share size={14} />
                                            Share chat
                                        </button>
                                        <div className="h-[1px] bg-axiom-border my-1" />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(e, chat._id);
                                                setMenuOpenId(null);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-[12px] text-red-400 hover:bg-red-400/10 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                            Delete chat
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 border-t border-axiom-border bg-axiom-surface/50">
                <div className="flex items-center justify-between gap-3 p-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-default group">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-axiom-surface border border-axiom-border flex items-center justify-center text-axiom-accent shadow-lg">
                            <User size={16} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-white truncate max-w-[100px]">
                                {user?.name || 'User'}
                            </span>
                            <span className="text-[10px] text-axiom-text-tertiary">Premium Plan</span>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 text-axiom-text-tertiary hover:text-white hover:bg-white/5 rounded-lg transition-all"
                        title="Log out"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
