'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CategoryCard from '@/components/CategoryCard';
import { CategorySectionSkeleton, HeroCardSkeleton } from '@/components/Skeleton';

export default function HomePage() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState('Vijayawada');
    const [heroIndex, setHeroIndex] = useState(0);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedCity = localStorage.getItem("selectedCity");
        if (savedCity) setSelectedCity(savedCity);
        const interval = setInterval(() => {
            if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                setHeroIndex(prev => (prev + 1) % 3);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const goToSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleEnter = (e) => {
        if (e.key === 'Enter') goToSearch();
    };

    const selectCity = (city) => {
        setSelectedCity(city);
        localStorage.setItem("selectedCity", city);
        setCityDropdownOpen(false);
    };

    const useLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }
        setSelectedCity("Detecting...");
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
                const data = await response.json();
                const city = data.address.city || data.address.town || data.address.village || "Unknown";
                selectCity(city);
            } catch (error) {
                selectCity("Vijayawada");
            }
        }, () => {
            alert("Location permission denied");
            selectCity("Vijayawada");
        });
    };

    return (
        <div onClick={() => setCityDropdownOpen(false)}>
            <section className="w-11/12 sm:w-10/12 mt-10 mx-auto flex flex-col lg:flex-row gap-10 items-center justify-between px-2">
                <div>
                    <h3 className="manrope my-5 text-[2rem] font-semibold">What are you looking for today?</h3>
                    <p className="manrope my-5 text-[1.2rem]">Find what you need near you...</p>
                    <div className="flex flex-wrap gap-1 items-center">
                        <input placeholder="Search for shops, services, or essentials..." type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleEnter} className="border-2 border-[#5b5454] w-60 lg:w-100 h-15 rounded-md shadow-md p-2" />

                        <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => setCityDropdownOpen(!cityDropdownOpen)} className="flex items-center gap-2 px-4 py-2 ml-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none">
                                <span>{selectedCity}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            </button>

                            {cityDropdownOpen && (
                                <div className="absolute left-0 sm:left-auto lg:-right-8 mt-2 ml-2.5 w-56 bg-white border rounded-lg shadow-lg z-50">
                                    <div className="py-1 ml-[5px]">
                                        {['Vijayawada', 'Amaravathi', 'Guntur', 'Visakhapatnam', 'Hyderabad'].map(c => (
                                            <div key={c} onClick={() => selectCity(c)} className="city-item px-4 py-2 hover:bg-gray-100 cursor-pointer">{c}</div>
                                        ))}
                                        <hr />
                                        <div onClick={useLocation} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-blue-600 font-medium"><i className="fa-solid fa-location-crosshairs"></i> Use Current Location</div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button onClick={goToSearch} className="text-lg py-2 px-5 ml-2 text-white font-semibold cursor-pointer bg-linear-to-r from-[#ff8938] to-[#ff0000] rounded-md shadow-lg">Search <i className="fa-solid fa-magnifying-glass-location"></i></button>
                    </div>
                </div>

                <div className="flex gap-2 justify-center lg:justify-end w-full lg:w-auto">
                    {!mounted ? (
                        <>
                            <HeroCardSkeleton />
                            <HeroCardSkeleton />
                            <HeroCardSkeleton />
                        </>
                    ) : (
                        [
                            { img: 'https://res.cloudinary.com/dt6mkrgtp/image/upload/v1777936994/categories_img/vegetables.jpg', color: '#3e9f3cc5', title: 'Fresh Vegetables', desc: 'Find nearby vegetable markets and street vendors.' },
                            { img: 'https://res.cloudinary.com/dt6mkrgtp/image/upload/v1777936995/categories_img/restaurant.jpg', color: '#9f413cc5', title: 'Search Restaurants', desc: 'Find nearby cafés, tiffin centers, and budget meals.' },
                            { img: 'https://res.cloudinary.com/dt6mkrgtp/image/upload/v1777936996/categories_img/medicine.jpg', color: '#3c629fc5', title: 'Find Medical Stores', desc: 'Locate trusted pharmacies and 24×7 medicine shops.' }
                        ].map((card, i) => {
                            const isVisible =
                                window.innerWidth >= 1024 ||
                                i === heroIndex ||
                                (window.innerWidth >= 768 && window.innerWidth < 1024 && (i === heroIndex || i === (heroIndex + 1) % 3));

                            return (
                                <div key={i} className={`transition-all duration-500 ${isVisible ? 'block' : 'hidden lg:block'} ${window.innerWidth < 768 ? 'mx-auto' : ''}`}>
                                    <a href="#">
                                        <div className="h-[300px] w-[200px] rounded-lg text-white p-5 bg-cover bg-center" style={{ backgroundImage: `url(${card.img})` }}>
                                            <div className="p-2 rounded-lg" style={{ backgroundColor: card.color }}>
                                                <h3 className="text-2xl font-bold pb-3">{card.title}</h3>
                                                <p>{card.desc}</p>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            {/* Categories Section */}
            <section className="w-11/12 sm:w-10/12 mx-auto my-20 grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
                {loading ? (
                    <>
                        <CategorySectionSkeleton />
                        <CategorySectionSkeleton />
                    </>
                ) : (
                    categories.map((cat) => (
                        <div key={cat.id} className="p-2 border border-[#cbc2c283] rounded-lg bg-gray-50/30">
                            <h2 className="font-bold text-lg py-4 px-2">{cat.section}</h2>
                            <div className="flex flex-wrap gap-6 justify-start p-2">
                                {cat.items.map((item) => (
                                    <CategoryCard
                                        key={item.id}
                                        name={item.name}
                                        image={item.image}
                                        onClick={() => router.push(`/search?q=${encodeURIComponent(item.name)}`)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </section>

        </div>
    );
}
