'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAdminStats, getPendingShops, approveShop, getUserProfile } from '@/lib/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [pendingShops, setPendingShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'pending'

    useEffect(() => {
        const loadAdminData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login?message=admin_required';
                return;
            }

            try {
                // Verify admin status
                const user = await getUserProfile(token);
                if (user.role !== 'admin') {
                    window.location.href = '/dashboard?error=access_denied';
                    return;
                }

                const [statsData, shopsData] = await Promise.all([
                    getAdminStats(token),
                    getPendingShops(token)
                ]);

                setStats(statsData);
                setPendingShops(shopsData);
            } catch (err) {
                console.error("Admin load error:", err);
                setError("Failed to load administration data. Please ensure you have admin privileges.");
            } finally {
                setLoading(false);
            }
        };

        loadAdminData();
    }, []);

    const handleApprove = async (shopId) => {
        const token = localStorage.getItem('token');
        try {
            await approveShop(token, shopId);
            // Refresh data
            setPendingShops(prev => prev.filter(s => s.id !== shopId));
            const newStats = await getAdminStats(token);
            setStats(newStats);
        } catch (err) {
            alert("Failed to approve shop: " + err.message);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-orange-500 font-black tracking-widest uppercase text-xs">Accessing Command Center...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
            <div className="bg-red-900/20 border border-red-500/50 p-8 rounded-[2rem] max-w-md w-full text-center">
                <i className="fa-solid fa-shield-slash text-5xl text-red-500 mb-4"></i>
                <h2 className="text-2xl font-black text-white mb-2">Access Denied</h2>
                <p className="text-red-200/70 mb-6">{error}</p>
                <Link href="/dashboard" className="inline-block bg-white text-gray-900 font-bold px-8 py-3 rounded-xl">Back to Safety</Link>
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Platform Overview</h1>
                    <p className="text-slate-500 font-medium">Real-time performance metrics and directory analysis.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-100 shadow-sm pr-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-inner">
                        <i className="fa-solid fa-calendar-check"></i>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">System Status</p>
                        <p className="text-sm font-extrabold text-slate-900 leading-none">Operational</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <Link href="/admin/shops" className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <i className="fa-solid fa-store text-5xl text-slate-900"></i>
                    </div>
                    <p className="text-slate-400 text-[11px] font-extrabold uppercase tracking-widest mb-1">Total Shops</p>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stats?.totalShops || 0}</h3>
                    <div className="mt-6 flex items-center gap-2">
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100/50">Live on Platform</span>
                    </div>
                </Link>

                <Link href="/admin/pending" className="bg-white p-8 rounded-[2.5rem] border border-orange-100/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <i className="fa-solid fa-hourglass-half text-5xl text-orange-500"></i>
                    </div>
                    <p className="text-orange-600 text-[11px] font-extrabold uppercase tracking-widest mb-1">Pending Approval</p>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stats?.pendingShops || 0}</h3>
                    <div className="mt-6 flex items-center gap-2 text-orange-500">
                            <i className="fa-solid fa-circle-exclamation text-xs"></i>
                            <span className="text-[10px] font-extrabold uppercase tracking-tighter">Action Required</span>
                    </div>
                </Link>

                <Link href="/admin/users" className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <i className="fa-solid fa-users text-5xl text-slate-900"></i>
                    </div>
                    <p className="text-slate-400 text-[11px] font-extrabold uppercase tracking-widest mb-1">Total Users</p>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stats?.totalUsers || 0}</h3>
                    <div className="mt-6 flex items-center gap-2">
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100/50">Registered</span>
                    </div>
                </Link>

                <Link href="/admin/categories" className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                        <i className="fa-solid fa-tags text-5xl text-slate-900"></i>
                    </div>
                    <p className="text-slate-400 text-[11px] font-extrabold uppercase tracking-widest mb-1">Active Categories</p>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stats?.categoryStats?.length || 0}</h3>
                    <div className="mt-6 flex items-center gap-2 text-slate-400">
                            <i className="fa-solid fa-chart-column text-xs"></i>
                            <span className="text-[10px] font-extrabold uppercase tracking-tighter">Market Share</span>
                    </div>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: List */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                        <h4 className="text-2xl font-extrabold text-slate-900 mb-10 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm">
                                <i className="fa-solid fa-chart-pie"></i>
                            </div>
                            Shop Distribution
                        </h4>
                        <div className="space-y-10">
                            {stats?.categoryStats?.map((cat, idx) => (
                                <div key={idx} className="group">
                                    <div className="flex justify-between items-end mb-3.5 px-1">
                                        <div className="flex items-center gap-2.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(255,137,56,0.6)]"></span>
                                            <span className="text-sm font-extrabold text-slate-700 tracking-tight">{cat._id}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.count} Establishments</span>
                                    </div>
                                    <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden p-0.5 border border-slate-100 shadow-inner">
                                        <div 
                                            className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full group-hover:brightness-110 transition-all duration-1000 shadow-lg shadow-orange-500/20"
                                            style={{ width: `${(cat.count / stats.totalShops) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Mini Stats */}
                <div className="space-y-8">
                    <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl shadow-slate-900/30 text-white relative overflow-hidden group">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all"></div>
                            <h4 className="text-2xl font-extrabold mb-2 tracking-tight">Platform Health</h4>
                            <p className="text-slate-400 text-sm font-medium mb-10">Real-time system monitoring and global metrics.</p>
                            <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-white/5 pb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">API Latency</span>
                                </div>
                                <span className="text-sm font-extrabold font-mono">24ms</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">DB Integrity</span>
                                </div>
                                <span className="text-[10px] font-black text-green-400 uppercase tracking-widest px-2 py-0.5 bg-green-500/10 rounded-md">Optimal</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Server Load</span>
                                </div>
                                <span className="text-sm font-extrabold font-mono">12.4%</span>
                            </div>
                            </div>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Security Audit Log</h4>
                            <div className="space-y-8">
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 font-extrabold text-sm border border-slate-100 group-hover:bg-orange-50 group-hover:text-orange-500 transition-all shadow-sm">PM</div>
                                <div>
                                    <p className="text-sm font-extrabold text-slate-900 leading-tight">Pias Majumdar</p>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Now • Admin Console</p>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full py-5 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all border border-slate-100 active:scale-95">
                                View Security Logs
                            </button>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
