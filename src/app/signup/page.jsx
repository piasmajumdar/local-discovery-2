'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-12">
            <div className="signup-w-11/12 sm:w-10/12 w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="w-full md:w-1/2 bg-gradient-to-br from-[#ff8938] to-[#ff0000] p-12 text-white flex flex-col justify-center items-center text-center hidden md:flex">
                    <div className="bg-white/20 p-6 rounded-full mb-8 backdrop-blur-sm">
                        <i className="fa-solid fa-users text-6xl"></i>
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Join Our Community</h3>
                    <p className="text-lg text-white/90 max-w-md">Start discovering and supporting the best local businesses in your area today.</p>
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8 text-center md:text-left">
                        <Link href="/" className="inline-block mb-6 text-2xl font-bold">
                            <span className="text-[#ff0000]">Local</span> <span className="text-gray-800">Discovery</span>
                        </Link>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
                        <p className="text-gray-500">Please fill in your details to sign up</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fa-regular fa-user text-gray-400"></i>
                                </div>
                                <input type="text" required value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8938] focus:border-[#ff8938] outline-none transition-all" placeholder="Enter your full name" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fa-regular fa-envelope text-gray-400"></i>
                                </div>
                                <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8938] focus:border-[#ff8938] outline-none transition-all" placeholder="Enter your email" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-lock text-gray-400"></i>
                                </div>
                                <input type={showPassword ? "text" : "password"} required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8938] focus:border-[#ff8938] outline-none transition-all" placeholder="Create a password" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#ff8938]">
                                    <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-lock text-gray-400"></i>
                                </div>
                                <input type={showConfirmPassword ? "text" : "password"} required value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8938] focus:border-[#ff8938] outline-none transition-all" placeholder="Confirm your password" />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#ff8938]">
                                    <i className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center text-sm mt-2">
                            <label className="flex items-center text-gray-600 cursor-pointer">
                                <input type="checkbox" required className="w-4 h-4 rounded border-gray-300 text-[#ff8938] focus:ring-[#ff8938]" />
                                <span className="ml-2">I agree to the <a href="#" className="text-[#ff8938] hover:text-[#ff0000]">Terms of Service</a> & <a href="#" className="text-[#ff8938] hover:text-[#ff0000]">Privacy Policy</a></span>
                            </label>
                        </div>

                        <button type="submit" className="w-full bg-gradient-to-r from-[#ff8938] to-[#ff0000] text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 mt-6">
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8 text-center text-gray-600">
                        Already have an account? <Link href="/login" className="font-bold text-[#ff8938] hover:text-[#ff0000] transition-colors">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
