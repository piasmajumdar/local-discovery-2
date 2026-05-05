"use client";
import React, { useState, useEffect, useRef, useMemo, memo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getNearbyShops } from '@/lib/api';
import { ShopCardSkeleton } from '@/components/Skeleton';
import ShopDetailModal from '@/components/ShopDetailModal';

// Helper functions from search.js
function calcRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return +(sum / reviews.length).toFixed(1);
}

function calcDist(lat, lng, baseLat, baseLng) {
  const p = 0.017453292519943295;
  const c = Math.cos;
  const a = 0.5 - c((lat - baseLat) * p) / 2 +
    c(baseLat * p) * c(lat * p) *
    (1 - c((lng - baseLng) * p)) / 2;
  return +(12742 * Math.asin(Math.sqrt(a))).toFixed(1);
}

function isShopOpen(hours) {
  if (!hours || hours === "24 Hours" || hours.includes("24x7")) return true;
  try {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const parts = hours.split(/[–-]/);
    if (parts.length !== 2) return true;
    const parseTime = (t) => {
      const match = t.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return null;
      let h = parseInt(match[1]), m = parseInt(match[2]), ampm = match[3].toUpperCase();
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    };
    const start = parseTime(parts[0]), end = parseTime(parts[1]);
    if (start === null || end === null) return true;
    return end < start ? (currentTime >= start || currentTime <= end) : (currentTime >= start && currentTime <= end);
  } catch (e) { return true; }
}

function sIcon(shop, isActive) {
  if (typeof window === 'undefined' || !window.L) return null;
  const tc = shop.trust >= 90 ? '#16a34a' : shop.trust >= 75 ? '#ca8a04' : shop.trust >= 50 ? '#ea580c' : '#dc2626';
  const sz = isActive ? 44 : 36, bg = isActive ? '#e02020' : '#fff', bor = isActive ? '#b01010' : '#d1d5db';
  const sh = isActive ? '0 0 0 4px rgba(224,32,32,.2),0 4px 14px rgba(0,0,0,.18)' : '0 2px 8px rgba(0,0,0,.14)';

  return window.L.divIcon({
    className: '',
    html: `<div style="width:${sz}px;height:${sz}px;background:${bg};border:2.5px solid ${bor};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${isActive ? 22 : 16}px;box-shadow:${sh};transition:all .3s;">${shop.emoji}</div>`,
    iconSize: [sz, sz],
    iconAnchor: [sz / 2, sz],
    popupAnchor: [0, -(sz + 4)]
  });
}

function stars(r, large = false) {
  const sz = large ? '16px' : '11px';
  let h = '';
  for (let i = 1; i <= 5; i++) {
    const col = r >= i ? '#f59e0b' : r >= i - 0.5 ? '#f59e0b' : '#d1d5db';
    const ic = r >= i ? 'fa-solid fa-star' : r >= i - 0.5 ? 'fa-solid fa-star-half-stroke' : 'fa-regular fa-star';
    h += `<i class="${ic}" style="color:${col};font-size:${sz};margin-right:${large ? '4px' : '2px'};"></i>`;
  }
  return h;
}

function tLabel(score) {
  if (score >= 90) return "Verified & Top Rated";
  if (score >= 75) return "Trusted Local Business";
  if (score >= 50) return "Needs More Reviews";
  return "Caution Suggested";
}

function tc(score) {
  if (score >= 90) return "#16a34a";
  if (score >= 75) return "#ca8a04";
  if (score >= 50) return "#ea580c";
  return "#dc2626";
}

function tbClass(score) {
  if (score >= 90) return "badge-trust-high";
  if (score >= 75) return "badge-trust-med";
  return "badge-trust-low";
}

const ShopCard = memo(({ shop, isActive, onClick }) => {
  const tcColor = tc(shop.trust);
  const openB = shop.isOpen ? (
    <span className="badge badge-open">
      <span className="pulse" style={{ display: 'inline-block', width: '6px', height: '7px', background: '#16a34a', borderRadius: '50%', marginRight: '2px' }}></span>
      Open
    </span>
  ) : (
    <span className="badge badge-closed">⛔ Closed</span>
  );
  const wB = shop.warning ? (
    <div className="warn-banner">
      <i className="fa-solid fa-triangle-exclamation" style={{ marginTop: '1px', flexShrink: 0 }}></i>
      {shop.warning}
    </div>
  ) : null;

  return (
    <div id={`card-${shop.id}`} className={`shop-card ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className="shop-img">
        {shop.coverImg ? <img src={shop.coverImg} loading="lazy" alt="" /> : <span>{shop.emoji}</span>}
      </div>
      <div className="shop-info">
        <div className="shop-name-row">
          <div className="shop-name">{shop.name}</div>
          {openB}
        </div>
        <div className="shop-sub">
          {shop.category} · {shop.address.split(',')[0]}
        </div>
        <div className="tags-row">
          {shop.aiRecommended && <span className="badge badge-ai">✨ AI Pick</span>}
          <span className="badge badge-rating" dangerouslySetInnerHTML={{ __html: stars(shop.rating) + ' ' + shop.rating + ' <span style="opacity:.6;font-weight:400">(' + (shop.reviews?.length || 0) + ')</span>' }}></span>
          <span className="badge badge-dist"><i className="fa-solid fa-location-dot"></i> {shop.distance}km</span>
          <span className={`badge ${tbClass(shop.trust)}`}><i className="fa-solid fa-shield-halved"></i> {tLabel(shop.trust)}</span>
        </div>
        <div className="trust-bar-wrap">
          <span className="trust-label">Trust</span>
          <div className="trust-bar">
            <div className="trust-fill" style={{ width: shop.trust + '%', background: tcColor }}></div>
          </div>
          <span className="trust-val" style={{ color: tcColor }}>{shop.trust}/100</span>
        </div>
        {wB}
      </div>
    </div>
  );
});

import MapComponent from '@/components/MapComponent';

function SearchContent() {
  const searchParams = useSearchParams();
  const urlLat = searchParams.get('lat');
  const urlLng = searchParams.get('lng');

  const BASE_LAT = urlLat ? parseFloat(urlLat) : 16.492241;
  const BASE_LNG = urlLng ? parseFloat(urlLng) : 80.500429;

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [sortValue, setSortValue] = useState('distance');
  const [activeId, setActiveId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailShop, setDetailShop] = useState(null);

  const [cityName, setCityName] = useState('Vijayawada');
  const [reviewPhotos, setReviewPhotos] = useState([]);

  // Location/Map State
  const [isGPS, setIsGPS] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const mapRef = useRef(null);
  const router = useRouter();

  const handleLocationUpdate = (lat, lng, name, stayGPS = false) => {
    const params = new URLSearchParams(window.location.search);
    params.set('lat', lat);
    params.set('lng', lng);
    if (name) {
      params.set('city', name);
      setCityName(name);
      localStorage.setItem('selectedCity', name);
    }
    localStorage.setItem('userLat', lat);
    localStorage.setItem('userLng', lng);
    setIsGPS(stayGPS);
    router.push(`/search?${params.toString()}`);
  };

  const handleMyLocation = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const name = data.address.city || data.address.town || data.address.village || data.address.suburb || "Current Location";
          setIsGPS(true);
          handleLocationUpdate(latitude, longitude, name, true);
        } catch (e) {
          handleLocationUpdate(latitude, longitude, "My Location", true);
        } finally {
          setIsLocating(false);
        }
      }, (err) => {
        console.error(err);
        setIsLocating(false);
      }, { timeout: 10000 });
    }
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
    const cityParam = searchParams.get('city');
    if (cityParam) setCityName(cityParam);
    else {
      const savedCity = localStorage.getItem('selectedCity');
      if (savedCity) setCityName(savedCity);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchShops() {
      setLoading(true);
      try {
        const data = await getNearbyShops(BASE_LAT, BASE_LNG);
        const s = data.map(shop => {
          const distance = calcDist(shop.lat, shop.lng, BASE_LAT, BASE_LNG);
          const rating = calcRating(shop.reviews);
          const isOpen = isShopOpen(shop.hours);
          return { ...shop, distance, rating, isOpen };
        });
        setShops(s);
      } catch (e) {
        console.error("Failed to fetch shops:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchShops();
  }, [BASE_LAT, BASE_LNG]);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, activeFilter, sortValue, shops]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isMapModalOpen) {
        setIsMapModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isMapModalOpen]);

  const applyFilters = () => {
    let f = [...shops];
    const q = searchQuery.toLowerCase().trim();

    if (q) {
      f = f.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.tags && s.tags.some(t => t.toLowerCase().includes(q))) ||
        (s.products && s.products.some(p => p.name.toLowerCase().includes(q)))
      );
    }

    if (activeFilter === 'open') f = f.filter(s => s.isOpen);
    else if (activeFilter === 'ai') f = f.filter(s => s.aiRecommended);
    else if (activeFilter === 'nearby') f = f.filter(s => s.distance <= 1.0);
    else if (activeFilter === 'top') f = f.filter(s => s.rating >= 4.5);
    else if (activeFilter === 'trusted') f = f.filter(s => s.trust >= 85);

    if (sortValue === 'distance') f.sort((a, b) => a.distance - b.distance);
    else if (sortValue === 'rating') f.sort((a, b) => b.rating - a.rating);
    else if (sortValue === 'trust') f.sort((a, b) => b.trust - a.trust);

    setFiltered(f);
  };

  const openDetail = (id) => {
    const shop = shops.find(s => s.id === id);
    if (!shop) return;
    setDetailShop(shop);
    setIsDetailOpen(true);
    setActiveId(id);
    if (mapRef.current) mapRef.current.flyTo([shop.lat, shop.lng], 16, { duration: .8 });
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setActiveId(null);
  };

  const handleUpdateShop = (shopId, newReview) => {
    const updatedShops = shops.map(s => {
      if (s.id === shopId) {
        const newReviews = [newReview, ...(s.reviews || [])];
        return {
          ...s,
          reviews: newReviews,
          rating: calcRating(newReviews)
        };
      }
      return s;
    });
    setShops(updatedShops);
    setDetailShop(updatedShops.find(s => s.id === shopId));
  };

  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("User parse error", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login?logout=success';
  };


  return (
    <div className="fixed-layout">
      <header>
        <nav className="header-nav">
          <Link href="/" className="text-2xl sm:text-3xl flex flex-col sm:flex-row font-bold no-underline flex-shrink-0">
            <span className="text-[red]">Local </span>
            <span className="text-white ml-0 sm:ml-1">Discovery</span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 justify-center px-4 max-w-[500px]">
            <div className="hdr-search">
              <input
                type="search"
                placeholder="Search for shops, services, or essentials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="hdr-search-btn"><i className="fa-solid fa-magnifying-glass-location"></i></button>
            </div>
          </div>

          <div className="hdr-right flex-shrink-0" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link href="/list-your-shop" className="btn-list flex items-center">
              <i className="fa-solid fa-shop"></i>
              <span className="hidden md:inline ml-2">List a shop</span>
            </Link>

            {user ? (
              <div className="relative" style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface2)', border: '1.5px solid var(--border2)', padding: '4px 8px', borderRadius: '30px', cursor: 'pointer' }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--grad)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, overflow: 'hidden' }}>
                    {user.photo ? <img src={user.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <i className={`fa-solid fa-chevron-down`} style={{ fontSize: '10px', color: 'var(--muted)', transition: 'transform 0.3s', transform: isMenuOpen ? 'rotate(180deg)' : 'none' }}></i>
                </button>

                {isMenuOpen && (
                  <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '10px', width: '200px', background: 'var(--surface)', border: '1.5px solid var(--border2)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '8px 0', zIndex: 2000 }}>
                    <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border2)', marginBottom: '5px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Signed in as</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.fullName}</div>
                    </div>
                    {user.role === 'admin' && (
                      <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: '#ff8938', fontSize: '13px', textDecoration: 'none', fontWeight: 700, borderBottom: '1px solid var(--border2)' }} className="hover:bg-orange-50">
                        <i className="fa-solid fa-user-shield"></i> Admin Panel
                      </Link>
                    )}
                    <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: 'var(--text)', fontSize: '13px', textDecoration: 'none' }} className="hover:bg-gray-100">
                      <i className="fa-solid fa-gauge-high" style={{ color: 'var(--muted)' }}></i> Dashboard
                    </Link>
                    <div
                      onClick={handleLogout}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: '#dc2626', fontSize: '13px', cursor: 'pointer' }}
                      className="hover:bg-red-50"
                    >
                      <i className="fa-solid fa-right-from-bracket"></i> Log Out
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn-login">Login</Link>
            )}
          </div>
        </nav>
      </header>

      <div className="bg-white border-b border-gray-200 px-4 py-3 md:hidden">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <input
              type="search"
              placeholder="Search for shops, services, or essentials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#ff8938] focus:bg-white outline-none transition-all shadow-sm group-hover:border-gray-300"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="fa-solid fa-magnifying-glass-location text-gray-400 group-focus-within:text-[#ff8938] transition-colors"></i>
            </div>
            <button className="absolute right-2 top-2 bg-gradient-to-r from-[#ff8938] to-[#ff0000] text-white h-10 px-6 rounded-xl font-bold shadow-md hover:shadow-lg active:scale-95 transition-all">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <span className="filter-label">Filter:</span>
        <div className={`pill ${activeFilter === 'open' ? 'active' : ''}`} onClick={() => setActiveFilter('open')}>🟢 Open Now</div>
        <div className={`pill ${activeFilter === 'ai' ? 'active' : ''}`} onClick={() => setActiveFilter('ai')}>✨ AI Recommended</div>
        <div className={`pill ${activeFilter === 'nearby' ? 'active' : ''}`} onClick={() => setActiveFilter('nearby')}>📍 Under 1 km</div>
        <div className={`pill ${activeFilter === 'top' ? 'active' : ''}`} onClick={() => setActiveFilter('top')}>⭐ Top Rated</div>
        <div className={`pill ${activeFilter === 'trusted' ? 'active' : ''}`} onClick={() => setActiveFilter('trusted')}>🛡️ High Trust</div>
        {activeFilter && <div className="pill" onClick={() => setActiveFilter('')} style={{ background: 'var(--border)', color: 'var(--text)' }}>✕ Clear</div>}
      </div>

      <div className="main-layout w-full">
        <div className="left-panel w-full md:w-[530px] flex-1 md:flex-none grow">
          <div className="panel-header">
            <div className="result-count">
              <span>{filtered.length}</span> shops near {cityName}
            </div>
            <select className="sort-select" value={sortValue} onChange={(e) => setSortValue(e.target.value)}>
              <option value="distance">📍 By Distance</option>
              <option value="rating">⭐ By Rating</option>
              <option value="trust">🛡️ By Trust</option>
            </select>
          </div>
          <div className="shop-list">
            {loading ? (
              <div className="flex flex-col gap-2 p-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <ShopCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                {filtered.map(shop => (
                  <ShopCard
                    key={shop.id}
                    shop={shop}
                    isActive={activeId === shop.id}
                    onClick={() => openDetail(shop.id)}
                  />
                ))}
                {!filtered.length && <div className="no-results"><i className="fa-solid fa-store-slash"></i><p>No shops found. Try adjusting your filters.</p></div>}
              </>
            )}
          </div>
        </div>
        <div className="right-panel hidden md:block">
          <MapComponent
            baseLat={BASE_LAT}
            baseLng={BASE_LNG}
            shops={filtered}
            activeId={activeId}
            isGPS={isGPS}
            onShopClick={(id) => openDetail(id)}
            onLocationUpdate={handleLocationUpdate}
            handleMyLocation={handleMyLocation}
            containerId="desktop-map"
            externalRef={mapRef}
            isVisible={true}
            isLocating={isLocating}
          />
        </div>
      </div>

      {/* Mobile Map FAB */}
      <button
        onClick={() => setIsMapModalOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-[1001] bg-gradient-to-r from-[#ff8938] to-[#ff0000] text-white flex items-center gap-2 px-6 py-3.5 rounded-full font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all"
      >
        <i className="fa-solid fa-map-location-dot"></i>
        <span>View Map</span>
      </button>

      {/* Persistent Mobile Map Modal (Slide-up) */}
      <div
        className={`md:hidden fixed inset-0 z-[2000] bg-white flex flex-col transition-transform duration-500 ease-out ${isMapModalOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white shadow-sm shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#ff8938]">
              <i className="fa-solid fa-map"></i>
            </div>
            <span className="font-bold text-gray-800">Explore Area</span>
          </div>
          <button
            onClick={() => setIsMapModalOpen(false)}
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="flex-1 relative">
          <MapComponent
            baseLat={BASE_LAT}
            baseLng={BASE_LNG}
            shops={filtered}
            activeId={activeId}
            isGPS={isGPS}
            onShopClick={(id) => { openDetail(id); setIsMapModalOpen(false); }}
            onLocationUpdate={handleLocationUpdate}
            handleMyLocation={handleMyLocation}
            containerId="mobile-modal-map"
            externalRef={mapRef}
            isVisible={isMapModalOpen}
            isLocating={isLocating}
          />
        </div>
      </div>

      <ShopDetailModal isOpen={isDetailOpen} shop={detailShop} onClose={closeDetail} onUpdateShop={handleUpdateShop} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading Search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
