'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('logout') === 'success') {
            setNotification({ type: 'logout', message: "Successfully logged out!" });
            setTimeout(() => setNotification(null), 4000);
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (params.get('message') === 'login_required') {
            setNotification({ type: 'info', message: "Please log in to list your shop." });
            setTimeout(() => setNotification(null), 5000);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                // Store session
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                setNotification({ type: 'success', message: "Login successful! Welcome back." });
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                setNotification({ type: 'error', message: data.error || "Login failed" });
                setTimeout(() => setNotification(null), 4000);
            }
        } catch (error) {
            setNotification({ type: 'error', message: "Failed to contact backend." });
            setTimeout(() => setNotification(null), 4000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="login-w-11/12 sm:w-10/12 w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8 text-center md:text-left">
                        <Link href="/" className="inline-block mb-6 text-2xl font-bold">
                            <span className="text-[#ff0000]">Local</span> <span className="text-gray-800">Discovery</span>
                        </Link>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                        <p className="text-gray-500">Enter your details to access your account</p>
                    </div>

                    {/* Notification Toast */}
                    {notification && (
                        <div className={`mb-6 flex items-center p-4 rounded-xl shadow-md transition-all transform animate-in fade-in slide-in-from-top-2 duration-300 ${
                            notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
                            notification.type === 'info' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                            <div className={`mr-3 ${
                                notification.type === 'success' ? 'bg-green-600' : 
                                notification.type === 'info' ? 'bg-blue-600' :
                                'bg-red-600'
                            } text-white p-2 rounded-lg`}>
                                <i className={`fa-solid ${
                                    notification.type === 'success' ? 'fa-circle-check' : 
                                    notification.type === 'info' ? 'fa-circle-info' :
                                    'fa-circle-exclamation'
                                } text-sm`}></i>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold">{notification.message}</p>
                            </div>
                            <button onClick={() => setNotification(null)} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
                                <i className="fa-solid fa-xmark text-xs"></i>
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fa-regular fa-envelope text-gray-400"></i>
                                </div>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8938] focus:border-[#ff8938] outline-none transition-all" placeholder="Enter your email" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-lock text-gray-400"></i>
                                </div>
                                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8938] focus:border-[#ff8938] outline-none transition-all" placeholder="Enter your password" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#ff8938]">
                                    <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-gray-600 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#ff8938] focus:ring-[#ff8938]" />
                                <span className="ml-2">Remember me</span>
                            </label>
                            <a href="#" className="font-semibold text-[#ff8938] hover:text-[#ff0000] transition-colors">Forgot password?</a>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#ff8938] to-[#ff0000] text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50">
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-gray-600">
                        Don't have an account? <Link href="/signup" className="font-bold text-[#ff8938] hover:text-[#ff0000] transition-colors">Sign up</Link>
                    </div>
                </div>

                <div className="w-full md:w-1/2 bg-gradient-to-br from-[#ff8938] to-[#ff0000] p-12 text-white flex flex-col justify-center items-center text-center hidden md:flex">
                    <div className="bg-white/20 p-6 rounded-full mb-8 backdrop-blur-sm">
                        <i className="fa-solid fa-store text-6xl"></i>
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Discover Local Magic</h3>
                    <p className="text-lg text-white/90 max-w-md">Connect with trusted local businesses, read genuine reviews, and support your community.</p>
                </div>
            </div>

            {/* Top-Right Logout Notification */}
            {notification && notification.type === 'logout' && (
                <div className="fixed top-6 right-6 z-[2000] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-gray-800 text-white p-4 rounded-2xl shadow-2xl flex items-center border border-gray-700">
                        <div className="bg-green-500/20 text-green-400 p-2 rounded-xl mr-3">
                            <i className="fa-solid fa-circle-check text-xl"></i>
                        </div>
                        <div>
                            <p className="font-bold text-sm">Goodbye!</p>
                            <p className="text-xs text-gray-400">{notification.message}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
