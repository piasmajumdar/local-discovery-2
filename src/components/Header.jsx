'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login?logout=success';
    };

    if (pathname === '/search') return null;

    return (
        <header className="pt-5 bg-gray-700 text-white border-b border-[#b8a9a9] px-2 relative z-[1000]">
            <nav className="w-11/12 sm:w-10/12 mx-auto flex justify-between items-center pb-5">
                <div>
                    <Link href="/">
                        <h4 className="text-xl sm:text-3xl flex flex-col sm:flex-row font-bold">
                            <span className="text-[red]">Local </span>
                            <span>Discovery</span></h4>
                    </Link>
                </div>
                <div>
                    <ul className="flex items-center gap-6">
                        <li className="hover:text-[#ff8938] transition-colors cursor-pointer text-[18px] hidden md:block">
                            <Link href="/list-your-shop"><i className="fa-solid fa-shop mr-2"></i>List your shop</Link>
                        </li>

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 p-1 pr-3 rounded-full transition-all border border-gray-500"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#ff8938] to-[#ff0000] flex items-center justify-center text-white font-bold overflow-hidden border-2 border-white/20">
                                        {user.photo ? (
                                            <img src={user.photo} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            user.fullName.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <span className="hidden sm:inline font-medium">{user.fullName.split(' ')[0]}</span>
                                    <i className={`fa-solid fa-chevron-down text-xs transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}></i>
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 text-gray-800 border border-gray-100 animate-in fade-in zoom-in duration-200">
                                        <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                            <p className="text-xs text-gray-500">Signed in as</p>
                                            <p className="text-sm font-bold truncate">{user.email}</p>
                                        </div>
                                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                                            <i className="fa-solid fa-gauge-high text-gray-400"></i> Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left"
                                        >
                                            <i className="fa-solid fa-right-from-bracket"></i> Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login">
                                <li className="bg-gradient-to-r from-[#ff8938] to-[#ff0000] text-white font-bold px-6 py-2 hover:shadow-lg transition-all rounded-lg cursor-pointer text-[18px]">
                                    Login
                                </li>
                            </Link>
                        )}
                    </ul>
                </div>
            </nav>
        </header>
    );
}
