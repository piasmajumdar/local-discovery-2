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
    const [loading, setLoading] = useState(false);
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [otp, setOtp] = useState('');
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setLoading(true);
        setErrors({});
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setIsOtpStep(true);
                setNotification({ type: 'success', message: "OTP sent to your email!" });
                setTimeout(() => setNotification(null), 3000);
            } else {
                if (data.error && data.error.toLowerCase().includes('email')) {
                    setErrors({ email: data.error });
                } else {
                    alert(data.error || "Signup failed");
                }
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("Failed to contact backend.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    otp: otp
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setNotification({ type: 'success', message: "Verification successful! Redirecting..." });
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                setNotification({ type: 'error', message: data.error || "Verification failed" });
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

                    {/* Notification Toast */}
                    {notification && (
                        <div className={`mb-6 flex items-center p-4 rounded-xl shadow-md transition-all transform animate-in fade-in slide-in-from-top-2 duration-300 ${
                            notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                            <div className={`mr-3 ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white p-2 rounded-lg`}>
                                <i className={`fa-solid ${notification.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'} text-sm`}></i>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold">{notification.message}</p>
                            </div>
                            <button onClick={() => setNotification(null)} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
                                <i className="fa-solid fa-xmark text-xs"></i>
                            </button>
                        </div>
                    )}

                    {!isOtpStep ? (
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
                                    <input type="email" required value={formData.email} onChange={e => {
                                        setFormData({ ...formData, email: e.target.value });
                                        if (errors.email) setErrors({ ...errors, email: null });
                                    }} className={`w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#ff8938] focus:border-[#ff8938] outline-none transition-all`} placeholder="Enter your email" />
                                </div>
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <i className="fa-solid fa-circle-exclamation mr-1"></i>
                                        {errors.email}
                                    </p>
                                )}
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

                            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#ff8938] to-[#ff0000] text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 mt-6 disabled:opacity-50">
                                {loading ? "Sending OTP..." : "Create Account"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="text-center mb-6">
                                <div className="bg-orange-100 text-[#ff8938] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fa-solid fa-shield-halved text-2xl"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Verify Your Email</h3>
                                <p className="text-gray-500 mt-2">We've sent a 6-digit code to <br /><span className="font-semibold text-gray-700">{formData.email}</span></p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Enter OTP Code</label>
                                <input 
                                    type="text" 
                                    maxLength="6"
                                    required 
                                    value={otp} 
                                    onChange={e => setOtp(e.target.value)} 
                                    className="w-full text-center text-2xl tracking-[1em] font-bold py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff8938] focus:border-[#ff8938] outline-none transition-all" 
                                    placeholder="000000" 
                                />
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#ff8938] to-[#ff0000] text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50">
                                {loading ? "Verifying..." : "Verify & Complete Signup"}
                            </button>

                            <button type="button" onClick={() => setIsOtpStep(false)} className="w-full text-gray-500 text-sm hover:text-gray-700 transition-colors">
                                ← Back to Sign Up
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center text-gray-600">
                        Already have an account? <Link href="/login" className="font-bold text-[#ff8938] hover:text-[#ff0000] transition-colors">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
