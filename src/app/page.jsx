'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState('Vijayawada');
    const [heroIndex, setHeroIndex] = useState(0);

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
            <section className="container mt-10 mx-auto flex flex-col lg:flex-row gap-10 items-center justify-between px-2">
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
                    {[
                        { img: '/image/vegetables.jpg', color: '#3e9f3cc5', title: 'Fresh Vegetables', desc: 'Find nearby vegetable markets and street vendors.' },
                        { img: '/image/restaurant.jpg', color: '#9f413cc5', title: 'Search Restaurants', desc: 'Find nearby cafés, tiffin centers, and budget meals.' },
                        { img: '/image/medicine.jpg', color: '#3c629fc5', title: 'Find Medical Stores', desc: 'Locate trusted pharmacies and 24×7 medicine shops.' }
                    ].map((card, i) => {
                        const isVisible = !mounted ? (i === 0) : (
                            window.innerWidth >= 1024 || 
                            i === heroIndex || 
                            (window.innerWidth >= 768 && window.innerWidth < 1024 && (i === heroIndex || i === (heroIndex+1)%3))
                        );
                        return (
                            <div key={i} className={`transition-all duration-500 ${ isVisible ? 'block' : 'hidden lg:block' } ${!mounted || window.innerWidth < 768 ? 'mx-auto' : ''}`}>
                                <a href="#">
                                    <div className="h-[300px] w-[200px] rounded-lg text-white p-5 bg-cover bg-center" style={{backgroundImage: `url(${card.img})`}}>
                                        <div className="p-2 rounded-lg" style={{backgroundColor: card.color}}>
                                            <h3 className="text-2xl font-bold pb-3">{card.title}</h3>
                                            <p>{card.desc}</p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        );
                    })}
                </div>
            </section>
            
            


    {/* Categories */}
    <section className="container mx-auto my-20 grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
        {/* food section */}
        <div className="food-daily-needs p-2 border border-[#cbc2c283] rounded-lg">
            <h2 className="font-bold text-lg py-4">Food & Daily Needs</h2>

            <div className="card-container flex flex-wrap gap-8">
                {/* card */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/restaurant-2.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Restaurants</p>
                        </div>
                    </div>
                </a>
                {/* card */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/tiffin.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Tiffin Centers</p>
                        </div>
                    </div>
                </a>
                {/* card */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/street-food-2.png" alt="" className="w-20 h-20 mx-auto rounded-lg" />
                            <p className="font-semibold text-[#5f5f5f]">Street Food</p>
                        </div>
                    </div>
                </a>
                {/* card */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/cafe.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Cafés</p>
                        </div>
                    </div>
                </a>
                {/* card */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/bakery.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Bakeries</p>
                        </div>
                    </div>
                </a>
                {/* card */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/sweet-2.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Sweet Shops</p>
                        </div>
                    </div>
                </a>
                {/* card */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/juice.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Juice Centers</p>
                        </div>
                    </div>
                </a>
                {/* card */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/tea.webp" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Tea Stalls</p>
                        </div>
                    </div>
                </a>
                {/* card */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/grocery-2.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Grocery Stores</p>
                        </div>
                    </div>
                </a>
                {/* card */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/supermarket.jpg" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Supermarkets</p>
                        </div>
                    </div>
                </a>
                {/* card */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/vegetables.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Vegetables</p>
                        </div>
                    </div>
                </a>
                {/* card */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/fruit-shop.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Fresh Fruits</p>
                        </div>
                    </div>
                </a>
                {/* card */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/dairy.webp" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Dairy Shops</p>
                        </div>
                    </div>
                </a>
                {/* card */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/meat-3.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Meat Shops</p>
                        </div>
                    </div>
                </a>
                {/* card */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/fish.jpg" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Fish Markets</p>
                        </div>
                    </div>
                </a>
            </div>
        </div>

        {/*Useful Categories*/}
        <div className="useful-shops p-2 border border-[#cbc2c283] rounded-lg">
            <h2 className="font-bold text-lg py-4">Useful Categories</h2>

            <div className="card-container flex flex-wrap gap-8">
                {/* Xerox & Printing */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Xerox.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Xerox & Printing</p>
                        </div>
                    </div>
                </a>

                {/* Tailors */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Tailors.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Tailors</p>
                        </div>
                    </div>
                </a>

                {/* Key Makers */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Keymakers.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Key Makers</p>
                        </div>
                    </div>
                </a>

                {/* Shoe Repair */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Shoe_repair.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Shoe Repair</p>
                        </div>
                    </div>
                </a>

                {/* Ironing Services */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Ironing_services.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Ironing Services</p>
                        </div>
                    </div>
                </a>

                {/* Gas Agencies */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Gas.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Gas Agencies</p>
                        </div>
                    </div>
                </a>

                {/* ATM Nearby */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/atm.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">ATM Nearby</p>
                        </div>
                    </div>
                </a>

                {/* Internet Café */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Internet_cafe.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Internet Café</p>
                        </div>
                    </div>
                </a>

                {/* Recharge Shops */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Recharges.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Recharge Shops</p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
        {/*Living & Accommodation */}
        <div className="living-accommodation p-2 border border-[#cbc2c283] rounded-lg">
            <h2 className="font-bold text-lg py-4">Living & Accommodation</h2>

            <div className="card-container flex flex-wrap gap-8">
                {/* PG/Hostels */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Hostels.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">PG/Hostels</p>
                        </div>
                    </div>
                </a>

                {/* Rental Rooms */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Rent.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Rental Rooms</p>
                        </div>
                    </div>
                </a>

                {/* Apartments for Rent */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/apartments.png" alt="" className="w-15 h-15 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Apartments for Rent</p>
                        </div>
                    </div>
                </a>

                {/* Estate Agents */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Estates.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Estate Agents</p>
                        </div>
                    </div>
                </a>

                {/* Home Decor */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Home_Decors.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Home Decor</p>
                        </div>
                    </div>
                </a>

                {/* Furniture Stores */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Furniture_Stores.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Furniture Stores</p>
                        </div>
                    </div>
                </a>

                {/* Interior Designers */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Interior_Desgner.png" alt="" className="w-15 h-15 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Interior Designers</p>
                        </div>
                    </div>
                </a>

                {/* House Cleaning */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/House_Cleaning.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">House Cleaning</p>
                        </div>
                    </div>
                </a>

                {/* Water Suppliers */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Water_Suppliers.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Water Suppliers</p>
                        </div>
                    </div>
                </a>

            </div>
        </div>
        {/*Health & Medical */}
        <div className="health-medical p-2 border border-[#cbc2c283] rounded-lg">
            <h2 className="font-bold text-lg py-4">Health & Medical</h2>

            <div className="card-container flex flex-wrap gap-8">
                {/* Hospitals */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Hospitals.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Hospitals</p>
                        </div>
                    </div>
                </a>

                {/* Clinics */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Clinics.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Clinics</p>
                        </div>
                    </div>
                </a>

                {/* Medical Stores */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Medical_Stores.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Medical Stores</p>
                        </div>
                    </div>
                </a>

                {/* Dentists */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Dentists.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Dentists</p>
                        </div>
                    </div>
                </a>

                {/* Diagnostic Labs */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Diagnostic_labs.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Diagnostic Labs</p>
                        </div>
                    </div>
                </a>

                {/* Physiotherapy */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Physiotheraphy.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Physiotherapy</p>
                        </div>
                    </div>
                </a>

                {/* Eye Clinics */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Eye_clinics.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f55f5f]">Eye Clinics</p>
                        </div>
                    </div>
                </a>

                {/* Veterinary Clinics */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Veternary_clinics.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Veterinary Clinics</p>
                        </div>
                    </div>
                </a>


            </div>
        </div>
        {/* Education & Career */}
        <div className="education p-2 border border-[#cbc2c283] rounded-lg">
            <h2 className="font-bold text-lg py-4">Education & Career</h2>

            <div className="card-container flex flex-wrap gap-8">
                {/* Schools */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/School.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Schools</p>
                        </div>
                    </div>
                </a>

                {/* Colleges */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Colleges.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Colleges</p>
                        </div>
                    </div>
                </a>

                {/* Coaching Centers */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Colleges.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Coaching Centers</p>
                        </div>
                    </div>
                </a>

                {/* Tuition Classes */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Tution.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Tuition Classes</p>
                        </div>
                    </div>
                </a>

                {/* Driving Schools */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Driving_schools.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Driving Schools</p>
                        </div>
                    </div>
                </a>

                {/* Study Abroad Consultants */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/abroad.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Study Abroad Consultants</p>
                        </div>
                    </div>
                </a>

                {/* Computer Training */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Computer_training.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Computer Training</p>
                        </div>
                    </div>
                </a>

                {/* Libraries */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Libraries.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Libraries</p>
                        </div>
                    </div>
                </a>
            </div>
        </div>


        {/* Repair & Services */}
        <div className="repair-services p-2 border border-[#cbc2c283] rounded-lg">
            <h2 className="font-bold text-lg py-4">Repair & Services</h2>

            <div className="card-container flex flex-wrap gap-8">
                {/* Mobile Repair */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Mobile_Repair.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Mobile Repair</p>
                        </div>
                    </div>
                </a>

                {/* Laptop Repair */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Laptop_Repair.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Laptop Repair</p>
                        </div>
                    </div>
                </a>

                {/* Electricians */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Electricians.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Electricians</p>
                        </div>
                    </div>
                </a>

                {/* Plumbers */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Plumbers.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Plumbers</p>
                        </div>
                    </div>
                </a>

                {/* Car Repair */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Car_repair.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Car Repair</p>
                        </div>
                    </div>
                </a>

                {/* Bike Service */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Bike_services.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Bike Service</p>
                        </div>
                    </div>
                </a>

                {/* AC Repair */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/ac_repair.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">AC Repair</p>
                        </div>
                    </div>
                </a>

                {/* Laundry Services */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Laundry_Services.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Laundry Services</p>
                        </div>
                    </div>
                </a>

            </div>
        </div>


        {/* Events & Miscellaneous */}
        <div className="events-manager p-2 border border-[#cbc2c283] rounded-lg">
            <h2 className="font-bold text-lg py-4">Events & Miscellaneous</h2>

            <div className="card-container flex flex-wrap gap-8">
                {/* Event Organisers */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Events.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Event Organisers</p>
                        </div>
                    </div>
                </a>

                {/* Wedding Planning */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Wedding.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Wedding Planning</p>
                        </div>
                    </div>
                </a>

                {/* Rent & Hire */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Rent.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Rent & Hire</p>
                        </div>
                    </div>
                </a>

                {/* Packagers & Movers */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Packers and_movers.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Packagers & Movers</p>
                        </div>
                    </div>
                </a>

                {/* Courier Services */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Courier.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Courier Services</p>
                        </div>
                    </div>
                </a>

                {/* Photographers */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Photographers.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Photographers</p>
                        </div>
                    </div>
                </a>

                {/* Gym */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Gym.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Gym</p>
                        </div>
                    </div>
                </a>

                {/* Pet Shops */}
                <a href="">
                    <div
                        className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md">
                        <div>
                            <img src="/image/png/Pet_shops.png" alt="" className="w-20 h-20 mx-auto" />
                            <p className="font-semibold text-[#5f5f5f]">Pet Shops</p>
                        </div>
                    </div>
                </a>

            </div>
        </div>



    </section>


    
            
        </div>
    );
}
