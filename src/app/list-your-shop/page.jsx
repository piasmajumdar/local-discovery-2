'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ListYourShop() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
            // Redirect to login if not authenticated
            router.push('/login?message=login_required');
        } else {
            setUser(JSON.parse(storedUser));
            setLoading(false);
        }
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <i className="fa-solid fa-circle-notch fa-spin text-4xl text-[#ff8938] mb-4"></i>
                    <p className="text-gray-600 font-medium">Verifying your session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumbs */}
                <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/" className="hover:text-[#ff8938]">Home</Link>
                    <i className="fa-solid fa-chevron-right text-[10px]"></i>
                    <span className="text-gray-800 font-medium">List Your Shop</span>
                </nav>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gradient-to-r from-[#ff8938] to-[#ff0000] p-10 text-white text-center">
                        <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                            <i className="fa-solid fa-shop text-4xl"></i>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Welcome, {user.fullName}!</h1>
                        <p className="text-white/80">Ready to put your business on the map?</p>
                    </div>

                    <div className="p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">You have access!</h2>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                This is the **List Your Shop** demo page. Since you are logged in, you can see this content. 
                                In the next step, we will implement the form to collect your shop's details.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                    <p className="text-orange-800 font-bold text-sm mb-1">Authenticated</p>
                                    <p className="text-orange-600 text-xs line-clamp-1">{user.email}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                    <p className="text-green-800 font-bold text-sm mb-1">User ID</p>
                                    <p className="text-green-600 text-xs">#{user.userId}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 text-center">
                    <Link href="/" className="text-gray-500 hover:text-gray-800 flex items-center justify-center gap-2 transition-colors">
                        <i className="fa-solid fa-arrow-left"></i> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
