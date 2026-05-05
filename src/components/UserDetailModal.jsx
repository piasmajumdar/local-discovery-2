'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserDetailModal({ user, isOpen, onClose, onSuspend, isProcessing }) {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !user) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden"
                >
                    {/* Header/Cover */}
                    <div className="h-32 bg-gradient-to-br from-gray-900 to-gray-800 relative">
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-10 pb-10 -mt-16 relative">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-xl mb-6">
                                <div className="w-full h-full rounded-[2rem] bg-gradient-to-br from-[#ff8938] to-[#ff0000] flex items-center justify-center text-white text-4xl font-black border-4 border-white">
                                    {user.fullName.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            <h2 className="text-3xl font-black text-gray-900 mb-1">{user.fullName}</h2>
                            <p className="text-gray-400 font-bold mb-6">{user.email}</p>

                            <div className="flex gap-3 mb-10">
                                {user.role === 'admin' ? (
                                    <span className="bg-orange-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-orange-500/20">Administrator</span>
                                ) : (
                                    <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-100">Standard Member</span>
                                )}
                                <span className="bg-gray-100 text-gray-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-gray-200">ID: {user._id.slice(-6)}</span>
                            </div>

                            <div className="w-full grid grid-cols-2 gap-4 mb-10">
                                <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                    <p className="text-sm font-bold text-green-600 flex items-center justify-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Active
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Security</p>
                                    <p className="text-sm font-bold text-gray-900">Verified</p>
                                </div>
                            </div>

                            <div className="w-full flex flex-col gap-3">
                                <button 
                                    onClick={() => onSuspend(user._id)}
                                    disabled={isProcessing}
                                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-red-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    {isProcessing ? (
                                        <i className="fa-solid fa-spinner animate-spin"></i>
                                    ) : (
                                        <><i className="fa-solid fa-user-slash"></i> Suspend & Delete User</>
                                    )}
                                </button>
                                <button 
                                    onClick={onClose}
                                    className="w-full bg-gray-50 hover:bg-gray-100 text-gray-400 font-black py-5 rounded-[1.5rem] transition-all"
                                >
                                    Close Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
