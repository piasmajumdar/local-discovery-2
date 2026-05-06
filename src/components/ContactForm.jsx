"use client";
import React, { useState } from 'react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        bot_field: '' // Honeypot field
    });
    const [status, setStatus] = useState(null); // 'loading', 'success', 'error'
    const [msg, setMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMsg('');

        try {
            // Use your backend relay for security and bot protection
            // Clean API_URL to prevent double-slash issues
            const cleanURL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
            const response = await fetch(`${cleanURL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                mode: 'cors',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMsg(data.message);
                setFormData({ name: '', email: '', subject: '', message: '', bot_field: '' });
            } else {
                throw new Error(data.error || 'Something went wrong');
            }
        } catch (err) {
            setStatus('error');
            setMsg(err.message);
        }
    };

    if (status === 'success') {
        return (
            <div className="text-center py-12 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                    <i className="fa-solid fa-paper-plane-circle-check"></i>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-500 mb-8">{msg}</p>
                <button 
                    onClick={() => setStatus(null)}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg"
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 relative">
            {/* Honeypot Field - Invisible to Users */}
            <div className="hidden" aria-hidden="true">
                <input 
                    type="text" 
                    name="bot_field" 
                    value={formData.bot_field} 
                    onChange={handleChange} 
                    tabIndex="-1" 
                    autoComplete="off" 
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#ff8938] outline-none transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#ff8938] outline-none transition-all"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#ff8938] outline-none transition-all"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                <textarea 
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#ff8938] outline-none transition-all resize-none"
                ></textarea>
            </div>

            {status === 'error' && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <i className="fa-solid fa-triangle-exclamation text-base"></i>
                    {msg}
                </div>
            )}

            <button 
                type="submit" 
                disabled={status === 'loading'}
                className={`w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-3 ${status === 'loading' ? 'bg-slate-300' : 'bg-gradient-to-r from-[#ff8938] to-[#ff5f38] hover:shadow-orange-200 hover:scale-[1.01]'}`}
            >
                {status === 'loading' ? (
                    <><i className="fa-solid fa-circle-notch fa-spin"></i> Processing...</>
                ) : (
                    <><i className="fa-solid fa-paper-plane"></i> Send Message</>
                )}
            </button>
            
            <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                Protected by AI-Based Anti-Spam Fortress
            </p>
        </form>
    );
}
