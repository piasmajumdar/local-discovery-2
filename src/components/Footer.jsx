'use client';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();
    if (pathname === '/search' || pathname === '/login' || pathname === '/signup') return null;

    return (
        <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-16">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand Section */}
                <div>
                    <h2 className="text-2xl font-bold text-white">Local Discovery</h2>
                    <p className="mt-4 text-sm text-gray-400">
                        Find nearby shops, daily essentials, and trusted services instantly.
                        Designed for Indian cities like Vijayawada and beyond.
                    </p>
                </div>
                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/about" className="hover:text-[#ff8938] transition">About Us</a></li>
                        <li><a href="/contact" className="hover:text-[#ff8938] transition">Contact</a></li>
                        <li><a href="/privacy" className="hover:text-[#ff8938] transition">Privacy Policy</a></li>
                        <li><a href="/terms" className="hover:text-[#ff8938] transition">Terms of Service</a></li>
                    </ul>
                </div>
                {/* Categories */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#" className="hover:text-white transition">Food & Dining</a></li>
                        <li><a href="#" className="hover:text-white transition">Health & Medical</a></li>
                        <li><a href="#" className="hover:text-white transition">Education</a></li>
                        <li><a href="#" className="hover:text-white transition">Home Services</a></li>
                    </ul>
                </div>
                {/* Connect */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        Subscribe to get updates on new shops and features.
                    </p>
                    <div className="flex">
                        <input type="email" placeholder="Enter your email" className="w-full px-3 py-2 rounded-l-md bg-gray-800 text-sm focus:outline-none" />
                        <button className="bg-blue-600 px-4 py-2 rounded-r-md hover:bg-blue-700 transition text-sm">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400 relative">
                &copy; <span>{new Date().getFullYear()}</span> Local Discovery. All rights reserved.
                <button id="backToTop" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="absolute right-6 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-2 rounded-full hover:bg-blue-700 transition">
                    ↑
                </button>
            </div>
        </footer>
    );
}
