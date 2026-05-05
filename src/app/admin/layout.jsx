'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
    const pathname = usePathname();

    const navItems = [
        { name: 'Overview', path: '/admin', icon: 'fa-solid fa-chart-pie' },
        { name: 'Pending', path: '/admin/pending', icon: 'fa-solid fa-hourglass-half' },
        { name: 'Total Shops', path: '/admin/shops', icon: 'fa-solid fa-store' },
        { name: 'Users', path: '/admin/users', icon: 'fa-solid fa-users' },
        { name: 'Categories', path: '/admin/categories', icon: 'fa-solid fa-tags' },
    ];

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-gray-900">
            {/* Admin Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#ff8938] rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                            <i className="fa-solid fa-user-shield text-xl"></i>
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-black tracking-tight">Admin Console</h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Platform Management</p>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                        {navItems.map((item) => (
                            <Link 
                                key={item.path} 
                                href={item.path}
                                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${pathname === item.path ? 'bg-white text-[#ff8938] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <Link href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-[#ff8938] transition-colors flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                        <i className="fa-solid fa-arrow-left text-xs"></i> <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                </div>
            </header>

            {/* Mobile Nav */}
            <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex overflow-x-auto gap-2 no-scrollbar">
                {navItems.map((item) => (
                    <Link 
                        key={item.path} 
                        href={item.path}
                        className={`whitespace-nowrap px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${pathname === item.path ? 'bg-[#ff8938] text-white' : 'bg-gray-50 text-gray-400'}`}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>

            <main>{children}</main>
        </div>
    );
}
