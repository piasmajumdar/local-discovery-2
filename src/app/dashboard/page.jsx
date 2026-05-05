'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserProfile } from '@/lib/api';
import ShopCardDashboard from '@/components/ShopCardDashboard';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login?message=login_required';
                return;
            }

            try {
                const data = await getUserProfile(token);
                setUser(data);
            } catch (err) {
                // Token might be invalid or expired
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login?message=session_expired';
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?logout=success';
    };

    const getInitials = (name) => {
        if (!name) return "??";
        const names = name.trim().split(/\s+/);
        if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
        return (names[0].substring(0, 1) + names[names.length - 1].substring(0, 1)).toUpperCase();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-[#ff8938] border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600 font-medium tracking-wide">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-red-100">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button onClick={() => window.location.reload()} className="w-full bg-[#ff8938] text-white font-bold py-3 px-4 rounded-xl hover:bg-[#ff0000] transition-colors">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Cover Header */}
                    <div className="h-32 bg-gradient-to-r from-[#ff8938] to-[#ff0000] relative">
                         <div className="absolute top-6 right-8 flex gap-4">
                            <button onClick={handleLogout} className="bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-white/30 transition-all">
                                <i className="fa-solid fa-right-from-bracket mr-2"></i> Logout
                            </button>
                         </div>
                    </div>
                    
                    <div className="px-8 pb-10">
                        {/* Profile Section */}
                        <div className="relative flex flex-col md:flex-row items-center md:items-end -mt-16 mb-8 gap-6">
                            {/* Avatar */}
                            <div className="relative group">
                                {user?.photo ? (
                                    <img 
                                        src={user.photo} 
                                        alt={user.fullName} 
                                        className="w-32 h-32 rounded-3xl border-4 border-white shadow-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-3xl border-4 border-white shadow-lg bg-gradient-to-br from-[#ff8938] to-[#ff0000] flex items-center justify-center text-4xl font-black text-white">
                                        {getInitials(user?.fullName)}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <i className="fa-solid fa-camera text-white text-xl"></i>
                                </div>
                            </div>
 
                            {/* Name & Role */}
                            <div className="text-center md:text-left flex-1">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">{user?.fullName}</h1>
                                    {user?.role === 'admin' ? (
                                        <span className="bg-yellow-50 text-yellow-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-yellow-200">ADMINISTRATOR</span>
                                    ) : (
                                        <span className="bg-orange-100 text-[#ff8938] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-orange-200">PRO MERCHANT</span>
                                    )}
                                </div>
                                <p className="text-gray-500 font-bold flex items-center justify-center md:justify-start">
                                    <i className="fa-regular fa-envelope mr-2 text-[#ff8938]"></i>
                                    {user?.email}
                                </p>
                            </div>
 
                            {/* Actions */}
                            <div className="flex gap-3">
                                <button className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-all">
                                    Edit Profile
                                </button>
                                <Link href="/list-your-shop" className="px-6 py-2.5 bg-[#ff8938] hover:bg-[#ff0000] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
                                    List Your Shop
                                </Link>
                            </div>
                        </div>
 
                        <hr className="border-gray-100 my-8" />
 
                        {/* Stats Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                                <p className="text-orange-600 text-sm font-bold uppercase tracking-wider mb-1">Listed Shops</p>
                                <h3 className="text-3xl font-bold text-gray-900">{user?.myShops?.length || 0}</h3>
                            </div>
                            <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                                <p className="text-red-600 text-sm font-bold uppercase tracking-wider mb-1">Total Reviews</p>
                                <h3 className="text-3xl font-bold text-gray-900">{user?.myReviews?.length || 0}</h3>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-gray-600 text-sm font-bold uppercase tracking-wider mb-1">Merchant Status</p>
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    {user?.role === 'admin' ? (
                                        <>
                                            <i className="fa-solid fa-shield-crown text-yellow-500"></i>
                                            Platform Administrator
                                        </>
                                    ) : user?.isVerifiedByAdmin ? (
                                        <>
                                            <i className="fa-solid fa-shield-halved text-blue-500"></i>
                                            Verified Partner
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-shield text-gray-300"></i>
                                            Member
                                        </>
                                    )}
                                </h3>
                            </div>
                        </div>
 
                        {/* Listed Shops Section */}
                        <div className="mt-12">
                             <div className="flex items-center justify-between mb-8 px-2">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-800 tracking-tight">Your Business Profile</h3>
                                    <p className="text-sm text-gray-400 font-medium">Manage and track your listed establishments</p>
                                </div>
                                <Link 
                                    href="/list-your-shop" 
                                    className="text-sm font-bold text-[#ff8938] hover:text-[#ff0000] flex items-center gap-2 transition-colors bg-orange-50 px-4 py-2 rounded-xl"
                                >
                                    <i className="fa-solid fa-plus-circle"></i> Add Shop
                                </Link>
                             </div>

                             {user?.myShops?.length > 0 ? (
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                     {user.myShops.map((shop) => (
                                         <ShopCardDashboard key={shop.id} shop={shop} />
                                     ))}
                                 </div>
                             ) : (
                                 <div className="text-center p-16 border-4 border-dashed border-gray-100 rounded-[3rem] bg-gray-50/50">
                                    <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6 text-gray-200">
                                        <i className="fa-solid fa-store text-3xl"></i>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-800">No shops listed yet</h3>
                                    <p className="text-gray-400 font-medium max-w-xs mx-auto mt-2 mb-8 text-sm">Grow your reach by listing your first business on Local Discovery today!</p>
                                    <Link 
                                        href="/list-your-shop" 
                                        className="inline-flex items-center gap-3 bg-gradient-to-r from-[#ff8938] to-[#ff0000] text-white px-10 py-4 rounded-2xl font-black shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-all active:scale-95"
                                    >
                                        List Your First Shop
                                    </Link>
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
