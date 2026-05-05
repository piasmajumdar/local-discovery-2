'use client';
import Link from 'next/link';

export default function ErrorState({ 
    code = "404", 
    title = "Page Not Found", 
    message = "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
    showHome = true,
    reset = null
}) {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
                
                {/* Visual Element */}
                <div className="relative inline-block">
                    <div className="text-[150px] md:text-[200px] font-black text-gray-100 leading-none select-none">
                        {code}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center translate-y-4">
                        <div className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-[#ff8938] to-[#ff0000] rounded-full blur-3xl opacity-20 animate-pulse"></div>
                        <i className={`fa-solid ${code === '404' ? 'fa-map-location-dot' : 'fa-triangle-exclamation'} text-5xl md:text-7xl bg-gradient-to-br from-[#ff8938] to-[#ff0000] bg-clip-text text-transparent`}></i>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4 relative z-10">
                    <h1 className="text-3xl md:text-5xl font-black text-gray-800 tracking-tight">
                        {title}
                    </h1>
                    <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    {reset && (
                        <button 
                            onClick={reset}
                            className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-xl"
                        >
                            <i className="fa-solid fa-rotate-right text-sm"></i>
                            Try Again
                        </button>
                    )}
                    {showHome && (
                        <Link 
                            href="/"
                            className="px-8 py-4 bg-white text-gray-800 border-2 border-gray-100 font-bold rounded-2xl hover:border-[#ff8938] hover:text-[#ff8938] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg"
                        >
                            <i className="fa-solid fa-house text-sm"></i>
                            Back to Home
                        </Link>
                    )}
                </div>

                {/* Background Decor */}
                <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 -left-10 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-30"></div>
                    <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-30"></div>
                </div>
            </div>
        </div>
    );
}
