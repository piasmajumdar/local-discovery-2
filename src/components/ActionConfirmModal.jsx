'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export default function ActionConfirmModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText, 
    cancelText, 
    variant = 'danger', // 'danger', 'warning', 'success'
    isLoading = false,
    isSuccess = false,
    successMessage = "Action completed successfully!"
}) {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && !isLoading) onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose, isLoading]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={!isLoading && !isSuccess ? onClose : null}
                    className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                />
                
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative bg-white w-full max-w-sm rounded-[3rem] shadow-2xl p-10 text-center border border-gray-100"
                >
                    {isSuccess ? (
                        <div className="py-2">
                            <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-green-500 shadow-inner">
                                <i className="fa-solid fa-circle-check text-5xl"></i>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Done!</h3>
                            <p className="text-gray-500 font-medium mb-10 leading-relaxed">{successMessage}</p>
                            <button 
                                onClick={onClose}
                                className="w-full bg-gray-900 hover:bg-black text-white font-black py-5 rounded-2xl transition-all active:scale-95 shadow-xl shadow-gray-900/10"
                            >
                                Continue
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 ${
                                variant === 'danger' ? 'bg-red-50 text-red-500' : 
                                variant === 'warning' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'
                            } shadow-inner`}>
                                <i className={`text-3xl ${
                                    variant === 'danger' ? 'fa-solid fa-trash-can' : 
                                    variant === 'warning' ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-info'
                                }`}></i>
                            </div>
                            
                            <h3 className="text-2xl font-black text-gray-900 mb-3 leading-tight">{title}</h3>
                            <p className="text-sm text-gray-500 font-medium mb-10 leading-relaxed px-2">{message}</p>
                            
                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className={`w-full font-black py-5 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl ${
                                        variant === 'danger' ? 'bg-red-600 text-white shadow-red-500/20' : 
                                        variant === 'warning' ? 'bg-[#ff8938] text-white shadow-orange-500/20' : 'bg-blue-600 text-white shadow-blue-500/20'
                                    }`}
                                >
                                    {isLoading ? (
                                        <i className="fa-solid fa-spinner animate-spin"></i>
                                    ) : (
                                        confirmText || "Confirm Action"
                                    )}
                                </button>
                                <button 
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="w-full bg-gray-50 hover:bg-gray-100 text-gray-400 font-bold py-5 rounded-2xl transition-all"
                                >
                                    {cancelText || "Cancel"}
                                </button>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
