import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, ArrowRight } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { showToast } = useToast();
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            showToast('Welcome to Axiom. Integration successful.', 'success');
            navigate('/chat');
        } catch (err) {
            showToast(err.response?.data?.message || 'Invalid credentials. Please try again.', 'error');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-axiom-bg p-6">
            <div className="w-full max-w-[400px] space-y-8 animate-fade-in">
                {/* Minimal Hero Branding */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-4 mx-auto transition-transform hover:scale-105 duration-300">
                        <img src="/logo-symbol.png" alt="AxiomAI Symbol" className="w-16 h-auto mix-blend-screen" />
                        <span className="text-4xl font-bold tracking-tighter text-white">
                            Axiom<span className="text-axiom-brand">AI</span>
                        </span>
                    </div>
                    <p className="text-axiom-text-secondary">Sign in to Axiom Enterprise</p>
                </div>

                {/* Enterprise Auth Card */}
                <div className="bg-axiom-surface p-8 rounded-3xl border border-axiom-border shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-axiom-brand to-transparent opacity-50" />


                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-axiom-text-tertiary uppercase tracking-widest ml-1">Work Email</label>
                            <input
                                className="w-full bg-black/30 border border-axiom-border rounded-xl px-4 py-3 text-white axiom-focus-ring"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-axiom-text-tertiary uppercase tracking-widest ml-1">Password</label>
                            <input
                                className="w-full bg-black/30 border border-axiom-border rounded-xl px-4 py-3 text-white axiom-focus-ring"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            className="w-full bg-white text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-axiom-text-primary transition-all active:scale-[0.98] mt-6"
                            type="submit"
                        >
                            Explore Axiom
                            <ArrowRight size={16} strokeWidth={3} />
                        </button>
                    </form>
                </div>

                <div className="text-center">
                    <p className="text-sm text-axiom-text-tertiary">
                        New to Axiom? <Link to="/register" className="text-white font-bold hover:underline">Get Access</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
