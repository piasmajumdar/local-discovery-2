'use client';
import { useState, useEffect } from 'react';
import { getAdminStats, getUserProfile } from '@/lib/api';

export default function ActiveCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalShops, setTotalShops] = useState(0);

    useEffect(() => {
        const loadCategories = async () => {
            const token = localStorage.getItem('token');
            try {
                const user = await getUserProfile(token);
                if (user.role !== 'admin') {
                    window.location.href = '/dashboard?error=access_denied';
                    return;
                }
                const data = await getAdminStats(token);
                setCategories(data.categoryStats || []);
                setTotalShops(data.totalShops || 0);
            } catch (err) {
                setError("Failed to load category data.");
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    if (loading) return (
        <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-[#ff8938] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Analyzing Market Segments...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="mb-12">
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Market Segments</h2>
                <p className="text-slate-500 font-medium">Platform reach: <span className="text-orange-500 font-bold">{categories.length}</span> unique categories identified in the ecosystem.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((cat, idx) => (
                    <div key={idx} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                            <i className="fa-solid fa-layer-group text-6xl text-slate-900"></i>
                        </div>

                        <div className="flex justify-between items-start mb-8">
                            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 text-2xl group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                                <i className="fa-solid fa-tags"></i>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Saturation</p>
                                <p className="text-2xl font-black text-slate-900 tracking-tighter">{((cat.count / totalShops) * 100).toFixed(1)}%</p>
                            </div>
                        </div>

                        <h3 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">{cat._id}</h3>
                        <p className="text-slate-500 font-medium text-sm mb-10 leading-relaxed">Currently powering <span className="text-orange-500 font-bold">{cat.count}</span> live establishments on the map ecosystem.</p>

                        <div className="space-y-5">
                            <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden p-0.5 border border-slate-100 shadow-inner">
                                <div 
                                    className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(255,137,56,0.4)]"
                                    style={{ width: `${(cat.count / totalShops) * 100}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span className="flex items-center gap-1.5"><i className="fa-solid fa-chart-line text-orange-500"></i> Market Share</span>
                                <span className="text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{cat.count} / {totalShops}</span>
                            </div>
                        </div>

                        <button className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                            Detailed Analytics
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
