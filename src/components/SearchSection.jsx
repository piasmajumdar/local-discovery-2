'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { reverseGeocode } from '@/lib/api';

export default function SearchSection() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState('Vijayawada');

    useEffect(() => {
        const savedCity = localStorage.getItem("selectedCity");
        if (savedCity) setSelectedCity(savedCity);
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
                const data = await reverseGeocode(lat, lon);
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
            <h3 className="manrope my-5 text-[2rem] font-semibold">What are you looking for today?</h3>
            <p className="manrope my-5 text-[1.2rem]">Find what you need near you...</p>
            <div className="flex flex-wrap gap-1 items-center">
                <input 
                    placeholder="Search for shops, services, or essentials..." 
                    type="search" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    onKeyDown={handleEnter} 
                    className="border-2 border-[#5b5454] w-60 lg:w-100 h-15 rounded-md shadow-md p-2" 
                />

                <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setCityDropdownOpen(!cityDropdownOpen)} className="flex items-center gap-2 px-4 py-2 ml-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none text-gray-800">
                        <span>{selectedCity}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>

                    {cityDropdownOpen && (
                        <div className="absolute left-0 sm:left-auto lg:-right-8 mt-2 ml-2.5 w-56 bg-white border rounded-lg shadow-lg z-50 text-gray-800">
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
                <button onClick={goToSearch} className="text-lg py-2 px-5 ml-2 text-white font-semibold cursor-pointer bg-linear-to-r from-[#ff8938] to-[#ff0000] rounded-md shadow-lg">
                    Search <i className="fa-solid fa-magnifying-glass-location"></i>
                </button>
            </div>
        </div>
    );
}
