import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    MessageSquare,
    Activity,
    ArrowLeft,
    Shield,
    BarChart3,
    PieChart
} from 'lucide-react';
import {
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiClient.get('/admin/dashboard');
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch admin stats:', error);
                showToast('Failed to load dashboard metrics.', 'error');
                // Optional: Redirect if unauthorized, though protected route should handle this
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.role === 'admin') {
            fetchStats();
        } else {
            navigate('/');
        }
    }, [user, navigate, showToast]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-axiom-bg flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-axiom-brand"></div>
            </div>
        );
    }

    if (!stats) return null;

    // Prepare chart data
    const pieData = stats.chats.byMode.map(item => ({
        name: item.name.charAt(0).toUpperCase() + item.name.slice(1) + ' Mode',
        value: item.value
    }));

    const COLORS = ['#10a37f', '#a855f7', '#3b82f6', '#f59e0b'];

    // Placeholder data for message activity if we don't have time-series data yet
    // In a real scenario, backend would provide this. 
    // For now, we'll visualize the distribution of user types or similar if available, 
    // or just use the pie chart as the main "chart" requested.
    // Let's create a simple bar chart comparing Total Users vs Total Chats vs Total Messages (log scale visually or just values)
    const barData = [
        { name: 'Users', value: stats.users.total },
        { name: 'Chats', value: stats.chats.total },
        { name: 'Messages', value: stats.messages.total },
    ];

    return (
        <div className="min-h-screen bg-axiom-bg text-white p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                                <Shield className="text-axiom-brand" size={28} />
                                Admin Command Center
                            </h1>
                            <p className="text-axiom-text-tertiary">Real-time platform monitoring</p>
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Users Card */}
                    <div className="bg-axiom-surface border border-axiom-border rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Users size={64} />
                        </div>
                        <h3 className="text-axiom-text-tertiary font-bold text-sm uppercase tracking-wider mb-2">Total Users</h3>
                        <p className="text-4xl font-black">{stats.users.total}</p>
                    </div>

                    {/* Chats Card */}
                    <div className="bg-axiom-surface border border-axiom-border rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <MessageSquare size={64} />
                        </div>
                        <h3 className="text-axiom-text-tertiary font-bold text-sm uppercase tracking-wider mb-2">Total Sessions</h3>
                        <p className="text-4xl font-black">{stats.chats.total}</p>
                    </div>

                    {/* Messages Card */}
                    <div className="bg-axiom-surface border border-axiom-border rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <Activity size={64} />
                        </div>
                        <h3 className="text-axiom-text-tertiary font-bold text-sm uppercase tracking-wider mb-2">Total Messages</h3>
                        <p className="text-4xl font-black">{stats.messages.total}</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Chat Modes Distribution */}
                    <div className="bg-axiom-surface border border-axiom-border rounded-3xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <PieChart size={20} className="text-axiom-brand" />
                            <h2 className="text-xl font-bold">Session Mode Distribution</h2>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* System Volume Overview */}
                    <div className="bg-axiom-surface border border-axiom-border rounded-3xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <BarChart3 size={20} className="text-purple-400" />
                            <h2 className="text-xl font-bold">System Volume Overview</h2>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                    <XAxis dataKey="name" stroke="#666" />
                                    <YAxis stroke="#666" />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="value" fill="#10a37f" radius={[4, 4, 0, 0]} barSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
