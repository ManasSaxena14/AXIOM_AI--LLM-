import React from 'react';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User, Mail, Shield, LogOut, Calendar } from 'lucide-react';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        showToast('Secure session terminated successfully.', 'info');
    };

    return (
        <div className="min-h-screen bg-axiom-bg flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-axiom-border flex items-center px-6 bg-axiom-bg/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white/5 rounded-xl text-axiom-text-tertiary hover:text-white transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-white">Profile Settings</h1>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6">
                <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
                    {/* Hero Profile Card */}
                    <div className="bg-axiom-surface border border-axiom-border rounded-[32px] p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-axiom-brand/5 blur-[100px] -mr-32 -mt-32 transition-colors group-hover:bg-axiom-brand/10" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-24 h-24 rounded-3xl bg-axiom-bg border border-axiom-border flex items-center justify-center text-axiom-brand shadow-2xl">
                                <User size={48} strokeWidth={1.5} />
                            </div>
                            <div className="text-center md:text-left space-y-2">
                                <h2 className="text-3xl font-black tracking-tight text-white">{user?.name || 'User'}</h2>
                                <p className="text-axiom-text-secondary flex items-center justify-center md:justify-start gap-2">
                                    <span className="w-2 h-2 rounded-full bg-axiom-brand animate-pulse" />
                                    Axiom Enterprise Member
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-axiom-surface/50 border border-axiom-border rounded-2xl p-6 space-y-4">
                            <h3 className="text-[10px] font-bold text-axiom-text-tertiary uppercase tracking-widest px-1">Account Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-3 bg-black/20 rounded-xl border border-white/5">
                                    <Mail size={18} className="text-axiom-text-tertiary" />
                                    <div>
                                        <p className="text-[10px] font-bold text-axiom-text-tertiary uppercase">Email Address</p>
                                        <p className="text-sm font-medium text-white">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 bg-black/20 rounded-xl border border-white/5">
                                    <Shield size={18} className="text-axiom-text-tertiary" />
                                    <div>
                                        <p className="text-[10px] font-bold text-axiom-text-tertiary uppercase">Security Role</p>
                                        <p className="text-sm font-medium text-white uppercase tracking-wider">{user?.role || 'authorized'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-axiom-surface/50 border border-axiom-border rounded-2xl p-6 space-y-4">
                            <h3 className="text-[10px] font-bold text-axiom-text-tertiary uppercase tracking-widest px-1">System Status</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-3 bg-black/20 rounded-xl border border-white/5">
                                    <Calendar size={18} className="text-axiom-text-tertiary" />
                                    <div>
                                        <p className="text-[10px] font-bold text-axiom-text-tertiary uppercase">Member Since</p>
                                        <p className="text-sm font-medium text-white">January 2026</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 border border-axiom-brand/20 bg-axiom-brand/5 rounded-xl">
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-axiom-brand uppercase">Tier Status</p>
                                        <p className="text-sm font-black text-white">Quantum Premium</p>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-axiom-brand shadow-[0_0_10px_rgba(16,163,127,1)]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-8 border-t border-axiom-border flex justify-end">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-6 py-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 rounded-xl font-bold transition-all active:scale-95"
                        >
                            <LogOut size={18} />
                            Sign Out of Session
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
