'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { reverseGeocode } from '@/lib/api';

export default function SearchSection() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState('Vijayawada');
    const [coords, setCoords] = useState({ lat: 16.492241, lng: 80.500429 });
    const [locationInput, setLocationInput] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const savedCity = localStorage.getItem("selectedCity");
        const savedLat = localStorage.getItem("selectedLat");
        const savedLng = localStorage.getItem("selectedLng");
        
        if (savedCity) setSelectedCity(savedCity);
        if (savedLat && savedLng) {
            setCoords({ lat: parseFloat(savedLat), lng: parseFloat(savedLng) });
        } else {
            // Auto-detect on first landing if no saved location
            useLocation();
        }
    }, []);

    // Fetch suggestions as user types
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (locationInput.trim().length > 2) {
                setIsSearching(true);
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}&limit=5&addressdetails=1`);
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    const data = await res.json();
                    setSuggestions(data);
                } catch (err) {
                    console.error("Search error", err);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSuggestions([]);
            }
        };

        fetchSuggestions();
    }, [locationInput]);

    const goToSearch = () => {
        if (searchQuery.trim()) {
            const url = `/search?q=${encodeURIComponent(searchQuery.trim())}&lat=${coords.lat}&lng=${coords.lng}`;
            router.push(url);
        }
    };

    const handleEnter = (e) => {
        if (e.key === 'Enter') goToSearch();
    };

    const selectLocation = (name, lat, lon) => {
        const shortName = name.split(',')[0];
        setSelectedCity(shortName);
        setCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
        localStorage.setItem("selectedCity", shortName);
        localStorage.setItem("selectedLat", lat);
        localStorage.setItem("selectedLng", lon);
        setCityDropdownOpen(false);
        setLocationInput('');
    };

    const useLocation = () => {
        if (!navigator.geolocation) return;
        
        setSelectedCity("...");
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const data = await reverseGeocode(latitude, longitude);
                const city = data.address.city || data.address.town || data.address.village || data.address.suburb || "Detected Location";
                selectLocation(city, latitude, longitude);
            } catch (error) {
                setSelectedCity("Vijayawada");
            }
        }, () => {
            setSelectedCity("Vijayawada");
        });
    };

    return (
        <section className="bg-gray-50/50 py-12 md:py-20 px-4 rounded-md" onClick={() => setCityDropdownOpen(false)}>
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Title Section */}
                <div className="text-center space-y-3">
                    <h3 className="manrope text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                        What are you looking for today?
                    </h3>
                    <p className="manrope text-gray-500 text-lg md:text-xl font-medium">
                        Find verified local shops and services near you...
                    </p>
                </div>

                {/* Unified Search Bar */}
                <div className="bg-white p-2 sm:p-3 rounded-[2rem] shadow-2xl shadow-gray-200/50 flex flex-col md:flex-row items-center gap-2 border border-gray-100">

                    {/* Location Dropdown */}
                    <div className="relative w-full md:w-auto" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                            className="flex items-center justify-center gap-1 px-4 md:px-2 py-3.5 w-full md:w-16 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all text-gray-700 font-black group shadow-sm border border-gray-100/50"
                            title={selectedCity}
                        >
                            <i className="fa-solid fa-location-dot text-[#ff8938] flex-shrink-0 text-sm"></i>
                            <span className="md:hidden truncate flex-1 text-left text-sm">{selectedCity}</span>
                            <span className="hidden md:inline text-sm uppercase tracking-tighter">{selectedCity.substring(0, 2)}</span>
                        </button>

                        {cityDropdownOpen && (
                            <div className="absolute left-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] p-3 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                                
                                {/* Active Selection Header */}
                                <div className="px-3 py-2 bg-orange-50/50 rounded-xl mb-3 border border-orange-100">
                                    <div className="text-[10px] uppercase tracking-widest text-orange-400 font-black mb-1">Active Location</div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                        <i className="fa-solid fa-location-dot text-[#ff8938]"></i>
                                        <span className="truncate">{selectedCity}</span>
                                    </div>
                                </div>

                                {/* Location Search Input */}
                                <div className="relative mb-3">
                                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                                    <input 
                                        type="text"
                                        placeholder="Search city or area..."
                                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm focus:ring-2 focus:ring-[#ff8938]/20 transition-all"
                                        value={locationInput}
                                        onChange={(e) => setLocationInput(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        autoFocus
                                    />
                                </div>

                                {/* Current Location Button */}
                                <button 
                                    onClick={useLocation} 
                                    className="w-full px-4 py-3 rounded-xl hover:bg-blue-50 text-blue-600 font-bold cursor-pointer flex items-center gap-3 text-xs transition-colors mb-2"
                                >
                                    <i className="fa-solid fa-location-crosshairs"></i>
                                    Use My Current Location
                                </button>

                                <div className="border-t border-gray-50 my-2"></div>

                                {/* Results / Suggestions */}
                                <div className="max-h-60 overflow-y-auto space-y-1">
                                    {isSearching ? (
                                        <div className="p-4 text-center text-gray-400">
                                            <i className="fa-solid fa-circle-notch animate-spin mr-2"></i> Searching...
                                        </div>
                                    ) : suggestions.length > 0 ? (
                                        suggestions.map((item, idx) => (
                                            <div 
                                                key={idx}
                                                onClick={() => selectLocation(item.display_name, item.lat, item.lon)}
                                                className="p-3 rounded-xl hover:bg-orange-50 cursor-pointer group transition-all"
                                            >
                                                <div className="text-xs font-bold text-gray-700 group-hover:text-[#ff8938] truncate">
                                                    {item.display_name.split(',')[0]}
                                                </div>
                                                <div className="text-[10px] text-gray-400 truncate">
                                                    {item.display_name.split(',').slice(1).join(',')}
                                                </div>
                                            </div>
                                        ))
                                    ) : locationInput.length > 2 ? (
                                        <div className="p-4 text-center text-gray-400 text-xs">No locations found</div>
                                    ) : (
                                        <div className="p-4 text-center text-gray-400 text-[11px]">Type to search for any place...</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Vertical Divider (Desktop only) */}
                    <div className="hidden md:block w-px h-8 bg-gray-200 mx-1"></div>

                    {/* Search Input Area */}
                    <div className="relative flex-1 w-full group">
                        <input
                            type="search"
                            className="w-full pl-2 pr-2 py-2 md:py-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 font-semibold text-sm md:text-base"
                            placeholder="Search for shops, services, or essentials..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleEnter}
                        />
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={goToSearch}
                        className="w-full md:w-auto px-5 py-4 bg-gradient-to-r from-[#ff8938] to-[#ff0000] text-white font-black rounded-2xl shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
                    >
                        <i className="fa-solid fa-magnifying-glass text-lg"></i>
                    </button>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap justify-center items-center gap-3 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                    <span className="text-gray-400 text-xs font-black mr-2 uppercase tracking-[0.2em]">Picks:</span>

                    <button onClick={() => { setSearchQuery('Vegetables'); goToSearch(); }} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 hover:bg-emerald-100 hover:shadow-sm transition-all font-bold cursor-pointer text-sm">
                        <i className="fa-solid fa-leaf"></i> Vegetables
                    </button>

                    <button onClick={() => { setSearchQuery('Restaurants'); goToSearch(); }} className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-700 rounded-full border border-rose-100 hover:bg-rose-100 hover:shadow-sm transition-all font-bold cursor-pointer text-sm">
                        <i className="fa-solid fa-utensils"></i> Restaurants
                    </button>

                    <button onClick={() => { setSearchQuery('Medical'); goToSearch(); }} className="flex items-center gap-2 px-5 py-2.5 bg-sky-50 text-sky-700 rounded-full border border-sky-100 hover:bg-sky-100 hover:shadow-sm transition-all font-bold cursor-pointer text-sm">
                        <i className="fa-solid fa-house-medical"></i> Medical Stores
                    </button>

                    <button onClick={() => { setSearchQuery(''); goToSearch(); }} className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-full border border-gray-200 hover:bg-gray-200 hover:shadow-sm transition-all font-bold cursor-pointer text-sm">
                        <i className="fa-solid fa-ellipsis"></i> More
                    </button>
                </div>
            </div>
        </section>
    );
}
