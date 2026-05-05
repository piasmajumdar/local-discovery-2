'use client';
import { useState, useEffect } from 'react';
import { getAllShops, deleteShop, getUserProfile } from '@/lib/api';
import ActionConfirmModal from '@/components/ActionConfirmModal';
import Link from 'next/link';

export default function TotalShops() {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [processingId, setProcessingId] = useState(null);

    // Modal State
    const [confirmConfig, setConfirmConfig] = useState({
        isOpen: false,
        shopId: null,
        isSuccess: false,
        isLoading: false
    });

    useEffect(() => {
        const loadShops = async () => {
            const token = localStorage.getItem('token');
            try {
                const user = await getUserProfile(token);
                if (user.role !== 'admin') {
                    window.location.href = '/dashboard?error=access_denied';
                    return;
                }
                const data = await getAllShops(token);
                setShops(data);
            } catch (err) {
                setError("Failed to load shops data.");
            } finally {
                setLoading(false);
            }
        };
        loadShops();
    }, []);

    const triggerRemove = (shopId) => {
        setConfirmConfig({
            isOpen: true,
            shopId: shopId,
            isSuccess: false,
            isLoading: false
        });
    };

    const handleConfirm = async () => {
        const token = localStorage.getItem('token');
        const { shopId } = confirmConfig;
        
        setConfirmConfig(prev => ({ ...prev, isLoading: true }));
        setProcessingId(shopId);

        try {
            await deleteShop(token, shopId);
            setShops(prev => prev.filter(s => s.id !== shopId));
            setConfirmConfig(prev => ({ ...prev, isLoading: false, isSuccess: true }));
        } catch (err) {
            alert("Deletion failed: " + err.message);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        } finally {
            setProcessingId(null);
        }
    };

    const closeModal = () => {
        setConfirmConfig({ isOpen: false, shopId: null, isSuccess: false, isLoading: false });
    };

    const filteredShops = shops.filter(shop => 
        shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.id.toString().includes(searchQuery)
    );

    if (loading) return (
        <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-[#ff8938] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Loading Shop Inventory...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Shop Inventory</h2>
                    <p className="text-slate-500 font-medium">Managing <span className="text-orange-500 font-bold">{shops.length}</span> live establishments across the platform.</p>
                </div>
                
                <div className="relative w-full md:w-96 group">
                    <input 
                        type="text" 
                        placeholder="Search by name, category, or ID..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all shadow-sm group-hover:shadow-md text-sm font-medium text-slate-700"
                    />
                    <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors"></i>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Business Details</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Trust Index</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredShops.map((shop) => (
                                <tr key={shop.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                                <img src={shop.coverImg} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-extrabold text-slate-900 tracking-tight">{shop.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: #{shop.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-slate-100">{shop.category}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className="w-20 bg-slate-100 h-1.5 rounded-full overflow-hidden shadow-inner">
                                                <div 
                                                    className={`h-full rounded-full ${shop.trust >= 80 ? 'bg-green-500' : shop.trust >= 50 ? 'bg-orange-500' : 'bg-red-500'} shadow-[0_0_8px_rgba(34,197,94,0.4)]`}
                                                    style={{ width: `${shop.trust}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{shop.trust}% Rating</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-center">
                                            {shop.isVerifiedByAdmin ? (
                                                <span className="flex items-center gap-1.5 text-green-600 font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 bg-green-50 rounded-full border border-green-100/50">
                                                    <i className="fa-solid fa-circle-check"></i> Verified
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-orange-500 font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 bg-orange-50 rounded-full border border-orange-100/50">
                                                    <i className="fa-solid fa-clock"></i> Pending
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button 
                                            onClick={() => triggerRemove(shop.id)}
                                            disabled={processingId === shop.id}
                                            className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-30 border border-transparent hover:border-red-100 flex items-center justify-center mx-auto lg:ml-auto lg:mr-0"
                                            title="Delete Shop"
                                        >
                                            {processingId === shop.id ? (
                                                <i className="fa-solid fa-spinner animate-spin text-sm"></i>
                                            ) : (
                                                <i className="fa-solid fa-trash-can text-sm"></i>
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {filteredShops.length === 0 && (
                    <div className="p-20 text-center text-gray-400 font-medium italic">
                        No shops match your search criteria...
                    </div>
                )}
            </div>

            <ActionConfirmModal 
                isOpen={confirmConfig.isOpen}
                onClose={closeModal}
                onConfirm={handleConfirm}
                isLoading={confirmConfig.isLoading}
                isSuccess={confirmConfig.isSuccess}
                variant="danger"
                title="Delete Shop?"
                message="This will permanently remove the shop from the database, search results, and maps."
                confirmText="Delete Permanently"
                successMessage="Shop has been permanently deleted."
            />
        </div>
    );
}
