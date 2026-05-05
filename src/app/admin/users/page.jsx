'use client';
import { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, getUserProfile } from '@/lib/api';
import UserDetailModal from '@/components/UserDetailModal';
import ActionConfirmModal from '@/components/ActionConfirmModal';

export default function TotalUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [processingId, setProcessingId] = useState(null);

    // Confirmation Modal State
    const [confirmConfig, setConfirmConfig] = useState({
        isOpen: false,
        userId: null,
        isSuccess: false,
        isLoading: false
    });

    useEffect(() => {
        const loadUsers = async () => {
            const token = localStorage.getItem('token');
            try {
                const user = await getUserProfile(token);
                if (user.role !== 'admin') {
                    window.location.href = '/dashboard?error=access_denied';
                    return;
                }
                const data = await getAllUsers(token);
                setUsers(data);
            } catch (err) {
                setError("Failed to load users data.");
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    const triggerSuspend = (userId) => {
        setConfirmConfig({
            isOpen: true,
            userId: userId,
            isSuccess: false,
            isLoading: false
        });
    };

    const handleConfirm = async () => {
        const token = localStorage.getItem('token');
        const { userId } = confirmConfig;
        
        setConfirmConfig(prev => ({ ...prev, isLoading: true }));
        setProcessingId(userId);
        
        try {
            await deleteUser(token, userId);
            setUsers(prev => prev.filter(u => u._id !== userId));
            setConfirmConfig(prev => ({ ...prev, isLoading: false, isSuccess: true }));
            setIsModalOpen(false);
        } catch (err) {
            alert("Suspension failed: " + err.message);
            setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        } finally {
            setProcessingId(null);
        }
    };

    const closeConfirmModal = () => {
        setConfirmConfig({ isOpen: false, userId: null, isSuccess: false, isLoading: false });
    };

    const openProfile = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const filteredUsers = users.filter(user => 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-[#ff8938] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Accessing User Directory...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Member Directory</h2>
                    <p className="text-slate-500 font-medium">Platform community: <span className="text-orange-500 font-bold">{users.length}</span> registered members.</p>
                </div>
                
                <div className="relative w-full md:w-96 group">
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all shadow-sm group-hover:shadow-md text-sm font-medium text-slate-700"
                    />
                    <i className="fa-solid fa-user-tag absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors"></i>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredUsers.map((user) => (
                    <div key={user._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                        {/* Role Badge */}
                        <div className="absolute top-6 right-6">
                            {user.role === 'admin' ? (
                                <span className="bg-orange-500 text-white text-[8px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-lg shadow-orange-500/20">System Admin</span>
                            ) : (
                                <span className="bg-slate-50 text-slate-500 text-[8px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest border border-slate-100">Member</span>
                            )}
                        </div>

                        <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 font-extrabold text-2xl border border-slate-100 group-hover:scale-105 group-hover:bg-orange-50 group-hover:text-orange-500 transition-all shadow-inner">
                                {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-extrabold text-slate-900 truncate tracking-tight">{user.fullName}</h3>
                                <p className="text-xs text-slate-400 font-semibold truncate tracking-tight">{user.email}</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(255,137,56,0.5)]"></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Account</span>
                             </div>
                             <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Joined Platform</div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <button 
                                onClick={() => openProfile(user)}
                                className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                            >
                                Profile
                            </button>
                            <button 
                                onClick={() => triggerSuspend(user._id)}
                                disabled={processingId === user._id}
                                className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                            >
                                {processingId === user._id ? (
                                    <i className="fa-solid fa-spinner animate-spin"></i>
                                ) : (
                                    'Suspend'
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-gray-50">
                    <p className="text-gray-400 font-medium italic">No users found matching "{searchQuery}"</p>
                </div>
            )}

            <UserDetailModal 
                isOpen={isModalOpen}
                user={selectedUser}
                onClose={() => setIsModalOpen(false)}
                onSuspend={triggerSuspend}
                isProcessing={processingId === selectedUser?._id}
            />

            <ActionConfirmModal 
                isOpen={confirmConfig.isOpen}
                onClose={closeConfirmModal}
                onConfirm={handleConfirm}
                isLoading={confirmConfig.isLoading}
                isSuccess={confirmConfig.isSuccess}
                variant="danger"
                title="Suspend User?"
                message="This will permanently delete the user account and all associated data. This action cannot be reversed."
                confirmText="Suspend Permanently"
                successMessage="User account has been permanently removed."
            />
        </div>
    );
}
