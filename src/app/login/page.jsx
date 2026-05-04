'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="login-container w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8 text-center md:text-left">
                        <Link href="/" className="inline-block mb-6 text-2xl font-bold">
                            <span className="text-[#ff0000]">Local</span> <span className="text-gray-800">Discovery</span>
                        </Link>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                        <p className="text-gray-500">Enter your details to access your account</p>
                    </div>

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

                        <button type="submit" className="w-full bg-gradient-to-r from-[#ff8938] to-[#ff0000] text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
                            Sign In
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
        </div>
    );
}
