"use client";
import React, { useEffect, useRef, useState } from 'react';

const MapComponent = ({ 
    baseLat, 
    baseLng, 
    shops, 
    activeId, 
    isGPS, 
    onShopClick, 
    onLocationUpdate, 
    handleMyLocation,
    containerId = "map",
    isVisible = true,
    isLocating = false,
    externalRef = null
}) => {
    const [map, setMap] = useState(null);
    const markersRef = useRef({});
    const centerMarkerRef = useRef(null);
    
    // Floating Search State
    const [locSearch, setLocSearch] = useState('');
    const [locSuggestions, setLocSuggestions] = useState([]);
    const [isLocSearching, setIsLocSearching] = useState(false);

    const handleLocSearch = async (val) => {
        setLocSearch(val);
        if (val.length < 3) { 
            setLocSuggestions([]); 
            return; 
        }
        
        setIsLocSearching(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=5`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            setLocSuggestions(data);
        } catch (e) { 
            console.error("Location search error:", e); 
        } finally { 
            setIsLocSearching(false); 
        }
    };

    const getShopIcon = (shop, isActive) => {
        if (typeof window === 'undefined' || !window.L) return null;
        const tc = shop.trust >= 90 ? '#16a34a' : shop.trust >= 75 ? '#ca8a04' : shop.trust >= 50 ? '#ea580c' : '#dc2626';
        const sz = isActive ? 44 : 36;
        const bg = isActive ? '#e02020' : '#fff';
        const bor = isActive ? '#b01010' : tc;
        const sh = isActive ? '0 0 0 4px rgba(224,32,32,.2),0 4px 14px rgba(0,0,0,.18)' : '0 2px 8px rgba(0,0,0,.14)';

        return window.L.divIcon({
            className: '',
            html: `<div style="width:${sz}px;height:${sz}px;background:${bg};border:2.5px solid ${bor};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${isActive ? 22 : 16}px;box-shadow:${sh};transition:all .3s;z-index:${isActive ? 1000 : 1};">${shop.emoji}</div>`,
            iconSize: [sz, sz],
            iconAnchor: [sz / 2, sz],
            popupAnchor: [0, -(sz + 4)]
        });
    };

    const initializingRef = useRef(false);

    // Map Initialization
    useEffect(() => {
        if (typeof window !== 'undefined' && window.L && !map && !initializingRef.current) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            // If there's an existing internal leaflet id, it means a previous instance wasn't cleaned up
            if (container._leaflet_id) {
                container._leaflet_id = null;
            }

            initializingRef.current = true;
            try {
                const m = window.L.map(containerId, { zoomControl: false, attributionControl: false }).setView([baseLat, baseLng], 14);
                window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(m);
                setMap(m);
                if (externalRef) externalRef.current = m;
            } catch (err) {
                console.error("Map init error:", err);
                initializingRef.current = false;
            }
        }

        return () => {
            if (map) {
                map.remove();
                setMap(null);
                if (externalRef) externalRef.current = null;
                centerMarkerRef.current = null;
                markersRef.current = {};
                initializingRef.current = false;
            }
        };
    }, [containerId, externalRef]);

    useEffect(() => {
        if (map && isVisible) {
            setTimeout(() => { map.invalidateSize(); }, 300);
        }
    }, [map, isVisible]);

    useEffect(() => {
        if (map) { map.flyTo([baseLat, baseLng], 14); }
    }, [map, baseLat, baseLng]);

    // Center Marker (GPS or Search)
    useEffect(() => {
        if (!map || typeof window === 'undefined' || !window.L) return;

        let ic;
        if (isGPS) {
            ic = window.L.divIcon({
                className: '',
                html: `<div class="gps-marker-container"><div class="gps-marker-pulse"></div><div class="gps-marker-dot"></div></div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });
        } else {
            ic = window.L.divIcon({
                className: '',
                html: `<div style="width:18px;height:18px;background:#ff4d4d;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(255,77,77,0.3);display:flex;align-items:center;justify-content:center;"><i class="fa-solid fa-location-crosshairs" style="color:white;font-size:10px;"></i></div>`,
                iconSize: [18, 18],
                iconAnchor: [9, 9]
            });
        }

        if (centerMarkerRef.current) {
            centerMarkerRef.current.setLatLng([baseLat, baseLng]);
            centerMarkerRef.current.setIcon(ic);
        } else {
            centerMarkerRef.current = window.L.marker([baseLat, baseLng], { icon: ic, zIndexOffset: 2000 }).addTo(map).bindPopup(`<div class="popup-name">📍 ${isGPS ? 'Your Location' : 'Search Center'}</div>`);
        }
    }, [map, baseLat, baseLng, isGPS]);

    // Shop Markers
    useEffect(() => {
        if (!map || typeof window === 'undefined' || !window.L) return;

        const currentMarkerIds = new Set(shops.map(s => s.id));

        // Remove old
        Object.keys(markersRef.current).forEach(id => {
            if (!currentMarkerIds.has(Number(id))) {
                markersRef.current[id].remove();
                delete markersRef.current[id];
            }
        });

        // Add/Update
        shops.forEach(shop => {
            const isAct = shop.id === activeId;
            if (!markersRef.current[shop.id]) {
                const m = window.L.marker([shop.lat, shop.lng], { icon: getShopIcon(shop, isAct) }).addTo(map)
                    .bindPopup(`<div class="popup-name">${shop.name}</div><div class="popup-meta">${shop.category} · ${shop.distance}km away</div>`);
                m.on('click', () => onShopClick(shop.id));
                markersRef.current[shop.id] = m;
            } else {
                markersRef.current[shop.id].setIcon(getShopIcon(shop, isAct));
                markersRef.current[shop.id].setZIndexOffset(isAct ? 1000 : 0);
            }
        });
    }, [map, shops, activeId]);

    return (
        <div className="relative w-full h-full">
            {/* Floating Location Search */}
            <div className="absolute top-4 left-4 z-[1000] w-72 sm:w-80">
                <div className="relative group">
                    <div className="flex items-center bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl p-1 transition-all focus-within:ring-2 focus-within:ring-[#ff8938] focus-within:bg-white">
                        <div className="pl-3 pr-2 text-gray-400">
                            <i className={`fa-solid ${isLocSearching ? 'fa-circle-notch fa-spin' : 'fa-location-dot'} text-[#ff8938]`}></i>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search another location..." 
                            value={locSearch}
                            onChange={(e) => handleLocSearch(e.target.value)}
                            className="w-full py-2.5 bg-transparent outline-none text-sm font-medium text-gray-700 placeholder:text-gray-400"
                        />
                        {locSearch && (
                            <button onClick={() => { setLocSearch(''); setLocSuggestions([]); }} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        )}
                    </div>

                    {locSuggestions.length > 0 && (
                        <div className="absolute top-full mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {locSuggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        onLocationUpdate(s.lat, s.lon, s.display_name.split(',')[0]);
                                        setLocSearch('');
                                        setLocSuggestions([]);
                                    }}
                                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 text-left"
                                >
                                    <i className="fa-solid fa-map-pin mt-1 text-gray-400"></i>
                                    <div>
                                        <div className="text-sm font-bold text-gray-800 truncate max-w-[220px]">{s.display_name.split(',')[0]}</div>
                                        <div className="text-[11px] text-gray-500 truncate max-w-[220px]">{s.display_name.split(',').slice(1).join(',')}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div id={containerId} style={{ height: '100%', width: '100%' }}></div>
            
            {isLocating && (
                <div className="absolute inset-0 z-[2000] bg-white/40 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
                    <div className="bg-white px-6 py-4 rounded-2xl shadow-2xl flex flex-col items-center gap-3 border border-gray-100">
                        <div className="w-10 h-10 border-4 border-orange-100 border-t-[#ff8938] rounded-full animate-spin"></div>
                        <span className="text-sm font-bold text-gray-700">Finding your location...</span>
                    </div>
                </div>
            )}
            
            <div className="map-fab">
                <div className="map-btn" title="My Location" onClick={handleMyLocation}><i className="fa-solid fa-location-crosshairs"></i></div>
                <div className="map-btn" title="Zoom In" onClick={() => { if (map) map.zoomIn() }}><i className="fa-solid fa-plus"></i></div>
                <div className="map-btn" title="Zoom Out" onClick={() => { if (map) map.zoomOut() }}><i className="fa-solid fa-minus"></i></div>
            </div>

            <style jsx global>{`
                .gps-marker-container { position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; }
                .gps-marker-dot { width: 14px; height: 14px; background: #2563eb; border: 2.5px solid #fff; border-radius: 50%; box-shadow: 0 0 10px rgba(37,99,235,0.5); z-index: 2; }
                .gps-marker-pulse { position: absolute; width: 100%; height: 100%; background: rgba(37,99,235,0.3); border-radius: 50%; animation: pulse-gps 2s infinite; z-index: 1; }
                @keyframes pulse-gps { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
            `}</style>
        </div>
    );
};

export default MapComponent;
