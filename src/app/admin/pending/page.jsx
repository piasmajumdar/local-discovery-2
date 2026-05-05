'use client';
import { useState, useEffect } from 'react';
import { getPendingShops, approveShop, deleteShop, getUserProfile } from '@/lib/api';
import ActionConfirmModal from '@/components/ActionConfirmModal';

export default function PendingApprovals() {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);
    
    // Modal State
    const [confirmConfig, setConfirmConfig] = useState({
        isOpen: false,
        type: null, // 'approve' or 'reject'
        shopId: null,
        isSuccess: false,
        isLoading: false
    });

    useEffect(() => {
        const loadPending = async () => {
            const token = localStorage.getItem('token');
            try {
                // Verify admin
                const user = await getUserProfile(token);
                if (user.role !== 'admin') {
                    window.location.href = '/dashboard?error=access_denied';
                    return;
                }

                const data = await getPendingShops(token);
                setShops(data);
            } catch (err) {
                setError("Failed to load pending shops.");
            } finally {
                setLoading(false);
            }
        };
        loadPending();
    }, []);

    const triggerApprove = (shopId) => {
        setConfirmConfig({
            isOpen: true,
            type: 'approve',
            shopId: shopId,
            isSuccess: false,
            isLoading: false
        });
    };

    const triggerReject = (shopId) => {
        setConfirmConfig({
            isOpen: true,
            type: 'reject',
            shopId: shopId,
            isSuccess: false,
            isLoading: false
        });
    };

    const handleConfirm = async () => {
        const token = localStorage.getItem('token');
        const { type, shopId } = confirmConfig;
        
        setConfirmConfig(prev => ({ ...prev, isLoading: true }));
        setProcessingId(shopId);

        try {
            if (type === 'approve') {
                await approveShop(token, shopId);
            } else {
                await deleteShop(token, shopId);
            }
            
            setShops(prev => prev.filter(s => s.id !== shopId));
            setConfirmConfig(prev => ({ ...prev, isLoading: false, isSuccess: true }));
        } catch (err) {
            alert("Action failed: " + err.message);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        } finally {
            setProcessingId(null);
        }
    };

    const closeModal = () => {
        setConfirmConfig({ isOpen: false, type: null, shopId: null, isSuccess: false, isLoading: false });
    };

    if (loading) return (
        <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-[#ff8938] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Scanning Database...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Review Queue</h2>
                    <p className="text-slate-500 font-medium">Platform moderate: <span className="text-orange-500 font-bold">{shops.length}</span> establishments awaiting verification.</p>
                </div>
                <div className="bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                    <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Live Moderation Active</span>
                </div>
            </div>

            {shops.length > 0 ? (
                <div className="grid grid-cols-1 gap-8">
                    {shops.map((shop) => (
                        <div key={shop.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col lg:flex-row gap-10 items-center">
                            <div className="w-full lg:w-64 h-64 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 group-hover:scale-[1.02] transition-transform">
                                <img src={shop.coverImg} alt={shop.name} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="flex-1 space-y-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-slate-100">{shop.category}</span>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ID: #{shop.id}</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{shop.name}</h3>
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <i className="fa-solid fa-location-dot text-orange-500"></i>
                                        <p className="text-sm font-medium italic tracking-tight">{shop.address}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contact</p>
                                        <p className="text-sm font-extrabold text-slate-900">{shop.phone}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Trust Score</p>
                                        <p className="text-sm font-extrabold text-orange-500">{shop.trust}%</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Business Status</p>
                                        <p className="text-sm font-extrabold text-slate-900">New Entry</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 w-full lg:w-48">
                                <button 
                                    onClick={() => triggerApprove(shop.id)}
                                    disabled={processingId === shop.id}
                                    className="w-full bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {processingId === shop.id && confirmConfig.type === 'approve' ? (
                                        <i className="fa-solid fa-spinner animate-spin"></i>
                                    ) : (
                                        <><i className="fa-solid fa-circle-check"></i> Approve Shop</>
                                    )}
                                </button>
                                <button 
                                    onClick={() => triggerReject(shop.id)}
                                    disabled={processingId === shop.id}
                                    className="w-full bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 font-bold py-4 rounded-2xl border border-red-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {processingId === shop.id && confirmConfig.type === 'reject' ? (
                                        <i className="fa-solid fa-spinner animate-spin"></i>
                                    ) : (
                                        <><i className="fa-solid fa-trash-can"></i> Reject Listing</>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-gray-50">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                        <i className="fa-solid fa-check-double text-5xl"></i>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900">All Caught Up!</h3>
                    <p className="text-gray-400 font-medium max-w-xs mx-auto mt-2">There are no shops currently waiting for approval. Check back later!</p>
                </div>
            )}

            <ActionConfirmModal 
                isOpen={confirmConfig.isOpen}
                onClose={closeModal}
                onConfirm={handleConfirm}
                isLoading={confirmConfig.isLoading}
                isSuccess={confirmConfig.isSuccess}
                variant={confirmConfig.type === 'approve' ? 'warning' : 'danger'}
                title={confirmConfig.type === 'approve' ? 'Approve Shop?' : 'Reject & Delete?'}
                message={confirmConfig.type === 'approve' ? 'This will make the shop live and visible to all users.' : 'This will permanently remove the shop from the database.'}
                confirmText={confirmConfig.type === 'approve' ? 'Confirm Approval' : 'Delete Permanently'}
                successMessage={confirmConfig.type === 'approve' ? 'Shop is now live on the platform!' : 'Shop has been permanently deleted.'}
            />
        </div>
    );
}
