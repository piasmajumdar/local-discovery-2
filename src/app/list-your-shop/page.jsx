'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { reverseGeocode } from '@/lib/api';

export default function ListYourShop() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category: 'Restaurant',
        emoji: '&#127978;',
        phone: '',
        hours: '10:00 AM – 10:00 PM',
        address: '',
        lat: 16.5062, // Default Vijayawada
        lng: 80.6480,
        tags: [],
        products: [{ name: '', price: '' }],
        coverImg: '',
        images: [''],
    });

    const [tagInput, setTagInput] = useState('');
    const [showMapModal, setShowMapModal] = useState(false);
    const [showEmojiModal, setShowEmojiModal] = useState(false);
    const [notification, setNotification] = useState(null);
    const [mapSearchQuery, setMapSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const locateTimeoutRef = useRef(null);

    const EMOJI_LIST = [
        { char: '🍽️', code: '&#127869;', cat: 'Food' }, { char: '🍴', code: '&#127860;', cat: 'Food' }, { char: '🍕', code: '&#127829;', cat: 'Food' }, { char: '☕', code: '&#9749;', cat: 'Food' },
        { char: '💊', code: '&#128138;', cat: 'Health' }, { char: '🏥', code: '&#127973;', cat: 'Health' }, { char: '🩺', code: '&#129658;', cat: 'Health' }, { char: '🧴', code: '&#129524;', cat: 'Health' },
        { char: '🛒', code: '&#128722;', cat: 'Shop' }, { char: '🛍️', code: '&#128093;', cat: 'Shop' }, { char: '🍎', code: '&#127822;', cat: 'Shop' }, { char: '👗', code: '&#128087;', cat: 'Shop' },
        { char: '✂️', code: '&#9986;', cat: 'Service' }, { char: '💅', code: '&#128133;', cat: 'Service' }, { char: '💻', code: '&#128187;', cat: 'Service' }, { char: '📱', code: '&#128241;', cat: 'Service' },
        { char: '🏪', code: '&#127978;', cat: 'Store' }, { char: '🏬', code: '&#127974;', cat: 'Store' }, { char: '🔨', code: '&#128296;', cat: 'Store' }, { char: '📚', code: '&#128218;', cat: 'Store' }
    ];

    const selectEmoji = (e) => {
        setFormData({ ...formData, emoji: e.code });
        setShowEmojiModal(false);
    };

    // Map Search Suggestion Logic
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (mapSearchQuery.length < 3) {
                setSuggestions([]);
                return;
            }
            setIsSearching(true);
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearchQuery)}&limit=5&addressdetails=1`);
                const data = await res.json();
                setSuggestions(data);
            } catch (err) {
                console.error("Suggestion fetch failed", err);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 500);
        return () => clearTimeout(timeoutId);
    }, [mapSearchQuery]);

    const selectSuggestion = (s) => {
        const nLat = parseFloat(s.lat);
        const nLon = parseFloat(s.lon);
        mapRef.current.flyTo([nLat, nLon], 17);
        markerRef.current.setLatLng([nLat, nLon]);
        setFormData(prev => ({ ...prev, lat: nLat, lng: nLon, address: s.display_name }));
        setSuggestions([]);
        setMapSearchQuery(s.display_name);
    };

    // Authentication Check
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (!storedUser || !token) {
            router.push('/login?message=login_required');
        } else {
            setUser(JSON.parse(storedUser));
            setLoading(false);
        }
    }, [router]);

    // Keyboard Support (ESC to close modal)
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') setShowMapModal(false);
        };
        if (showMapModal) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => window.removeEventListener('keydown', handleEsc);
    }, [showMapModal]);

    // Map Initialization
    useEffect(() => {
        if (showMapModal && typeof window !== 'undefined' && window.L) {
            // Small timeout to ensure DOM is ready for the map
            setTimeout(() => {
                if (!mapRef.current) {
                    mapRef.current = window.L.map('map-picker').setView([formData.lat, formData.lng], 15);
                    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(mapRef.current);

                    markerRef.current = window.L.marker([formData.lat, formData.lng], { draggable: true }).addTo(mapRef.current);

                    const updateLocation = async (lat, lng) => {
                        setFormData(prev => ({ ...prev, lat, lng }));
                        try {
                            const data = await reverseGeocode(lat, lng);
                            if (data && data.display_name) {
                                setFormData(prev => ({ ...prev, address: data.display_name }));
                            }
                        } catch (err) {
                            console.error("Geocoding failed", err);
                        }
                    };

                    // AUTO-LOCATE ON OPEN
                    if (navigator.geolocation) {
                        setIsLocating(true);
                        navigator.geolocation.getCurrentPosition(async (pos) => {
                            const { latitude, longitude } = pos.coords;
                            if (mapRef.current && markerRef.current) {
                                mapRef.current.flyTo([latitude, longitude], 17);
                                markerRef.current.setLatLng([latitude, longitude]);
                                updateLocation(latitude, longitude);
                            }
                            setIsLocating(false);
                        }, (err) => {
                            console.warn("Auto-locate failed or denied, using default coordinates.", err);
                            setIsLocating(false);
                        }, { timeout: 10000 });
                    }

                    mapRef.current.on('click', (e) => {
                        const { lat, lng } = e.latlng;
                        markerRef.current.setLatLng([lat, lng]);
                        updateLocation(lat, lng);
                    });

                    markerRef.current.on('dragend', (e) => {
                        const { lat, lng } = e.target.getLatLng();
                        updateLocation(lat, lng);
                    });
                }
            }, 100);
        }
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [showMapModal]);

    // Handlers
    const addTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim().toLowerCase())) {
                setFormData({ ...formData, tags: [...formData.tags, tagInput.trim().toLowerCase()] });
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
    };

    const handleProductChange = (index, field, value) => {
        const newProducts = [...formData.products];
        newProducts[index][field] = value;
        setFormData({ ...formData, products: newProducts });
    };

    const addProductField = () => {
        setFormData({ ...formData, products: [...formData.products, { name: '', price: '' }] });
    };

    const removeProductField = (index) => {
        const newProducts = formData.products.filter((_, i) => i !== index);
        setFormData({ ...formData, products: newProducts });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.address) {
            setNotification({ type: 'error', message: "Please select your shop location on the map before submitting." });
            setTimeout(() => setNotification(null), 4000);
            setShowMapModal(true);
            return;
        }

        const finalData = {
            ...formData,
            id: Math.floor(Math.random() * 10000), // Demo ID
            trust: 50, // Initial trust score
            aiRecommended: false,
            reviews: [],
            location: {
                type: "Point",
                coordinates: [formData.lng, formData.lat]
            },
            createdAt: new Date().toISOString(),
            userId: user.userId
        };

        console.log("=== NEW SHOP DATA SUBMISSION (DEMO) ===");
        console.log(JSON.stringify(finalData, null, 2));
        alert("Success! Check the browser console (F12) to see the shop data JSON.");
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 relative">
            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[5000] w-[90%] max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className={`flex items-center p-4 rounded-2xl shadow-2xl border ${
                        notification.type === 'success' 
                        ? 'bg-green-50 text-green-800 border-green-100' 
                        : 'bg-red-50 text-red-800 border-red-100'
                    }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                        } text-white`}>
                            <i className={`fa-solid ${notification.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold">{notification.message}</p>
                        </div>
                        <button onClick={() => setNotification(null)} className="ml-2 text-gray-400 hover:text-gray-600">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#ff8938] to-[#ff0000] pt-16 pb-32 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-black text-white mb-4">List Your Business</h1>
                    <p className="text-white/80 text-lg">Connect with your local community and grow your brand.</p>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 -mt-24">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="p-8 md:p-12 space-y-10">

                        {/* Section 1: Basic Info */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-orange-100 text-[#ff8938] rounded-xl flex items-center justify-center font-bold">1</div>
                                <h2 className="text-2xl font-bold text-gray-800">Basic Information</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Shop Name *</label>
                                    <input
                                        type="text" required
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff8938] outline-none transition-all"
                                        placeholder="e.g. Vijayawada Junction Restaurant"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Category *</label>
                                    <select
                                        value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff8938] outline-none transition-all bg-white"
                                    >
                                        <option>Restaurant</option>
                                        <option>Pharmacy</option>
                                        <option>Grocery</option>
                                        <option>Salon & Spa</option>
                                        <option>Electronics</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Emoji Icon (Click to pick) *</label>
                                    <div
                                        onClick={() => setShowEmojiModal(true)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-[#ff8938] transition-all cursor-pointer flex items-center justify-between group bg-white hover:border-[#ff8938]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                                <span dangerouslySetInnerHTML={{ __html: formData.emoji }}></span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-500 font-mono">{formData.emoji}</span>
                                        </div>
                                        <i className="fa-solid fa-face-smile text-gray-400 group-hover:text-[#ff8938]"></i>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ff8938] outline-none transition-all"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Section: Media */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center font-bold">
                                    <i className="fa-solid fa-camera-retro"></i>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Shop Photos</h2>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Upload Zone */}
                                <div className="relative border-2 border-dashed border-gray-200 hover:border-pink-400 rounded-3xl p-10 transition-all group bg-gray-50/50">
                                    <input 
                                        type="file" 
                                        multiple 
                                        accept="image/*"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files);
                                            if (files.length > 0) {
                                                const newPreviews = files.map(file => URL.createObjectURL(file));
                                                const updatedImages = [...formData.images.filter(img => img !== ''), ...newPreviews];
                                                setFormData({
                                                    ...formData,
                                                    coverImg: updatedImages[0],
                                                    images: updatedImages
                                                });
                                            }
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto text-pink-500 group-hover:scale-110 transition-transform">
                                            <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-gray-700">Upload Shop Images</p>
                                            <p className="text-sm text-gray-400">PNG, JPG or WebP (Max 5MB each)</p>
                                        </div>
                                        <div className="pt-2">
                                            <span className="bg-pink-100 text-pink-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">Browse Files</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Preview Grid */}
                                {formData.images.length > 0 && formData.images[0] !== '' && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        {formData.images.map((src, idx) => (
                                            <div 
                                                key={idx} 
                                                draggable
                                                onDragStart={(e) => e.dataTransfer.setData('draggedIdx', idx)}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={(e) => {
                                                    const draggedIdx = parseInt(e.dataTransfer.getData('draggedIdx'));
                                                    const updatedImages = [...formData.images];
                                                    const [draggedItem] = updatedImages.splice(draggedIdx, 1);
                                                    updatedImages.splice(idx, 0, draggedItem);
                                                    setFormData({
                                                        ...formData,
                                                        images: updatedImages,
                                                        coverImg: updatedImages[0]
                                                    });
                                                }}
                                                className={`relative rounded-2xl overflow-hidden group aspect-square shadow-sm border-2 cursor-move active:scale-95 transition-all ${idx === 0 ? 'border-pink-500 ring-4 ring-pink-500/10' : 'border-white hover:border-pink-200'}`}
                                            >
                                                <img src={src} className="w-full h-full object-cover pointer-events-none" alt={`Preview ${idx}`} />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                    <i className="fa-solid fa-arrows-up-down-left-right text-white text-xl"></i>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const newImgs = formData.images.filter((_, i) => i !== idx);
                                                        setFormData({
                                                            ...formData,
                                                            images: newImgs,
                                                            coverImg: newImgs[0] || ''
                                                        });
                                                    }}
                                                    className="absolute top-2 right-2 w-8 h-8 bg-red-600/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all z-20 pointer-events-auto shadow-lg"
                                                >
                                                    <i className="fa-solid fa-trash-can text-xs"></i>
                                                </button>
                                                {idx === 0 && (
                                                    <div className="absolute top-2 left-2">
                                                        <span className="bg-pink-500 text-white text-[8px] font-black px-2 py-1 rounded-md shadow-lg uppercase tracking-tighter">Main Cover</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Section 2: Location */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">2</div>
                                <h2 className="text-2xl font-bold text-gray-800">Shop Location</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Address (Auto-detected from map) *</label>
                                        <textarea
                                            rows="2" required readOnly
                                            value={formData.address}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600 outline-none cursor-not-allowed"
                                            placeholder="Please click 'Pick on Map' to set your address..."
                                        />
                                    </div>
                                    <div className="md:w-48 flex items-end pb-1">
                                        <button
                                            type="button"
                                            onClick={() => setShowMapModal(true)}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            <i className="fa-solid fa-map-location-dot"></i>
                                            Pick on Map
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-4 text-xs text-gray-500 font-medium">
                                    <span>Lat: {formData.lat.toFixed(6)}</span>
                                    <span>Lng: {formData.lng.toFixed(6)}</span>
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Section 3: Tags & Hours */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-bold">3</div>
                                <h2 className="text-2xl font-bold text-gray-800">Tags & Hours</h2>
                            </div>
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Shop Tags (Press Enter to add)</label>
                                    <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-xl bg-gray-50 min-h-[50px]">
                                        {formData.tags.map(tag => (
                                            <span key={tag} className="bg-white border border-purple-200 text-purple-700 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2">
                                                #{tag}
                                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 text-xs mt-0.5">×</button>
                                            </span>
                                        ))}
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={e => setTagInput(e.target.value)}
                                            onKeyDown={addTag}
                                            placeholder={formData.tags.length === 0 ? "e.g. biriyani, delivery, premium..." : ""}
                                            className="bg-transparent outline-none flex-1 min-w-[120px] text-sm py-1"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-gray-700">Opening Hours</label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={formData.hours === '24 Hours'}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFormData({ ...formData, hours: '24 Hours' });
                                                        } else {
                                                            setFormData({ ...formData, hours: '10:00 AM – 10:00 PM' });
                                                        }
                                                    }}
                                                />
                                                <div className={`w-10 h-5 bg-gray-200 rounded-full transition-colors ${formData.hours === '24 Hours' ? 'bg-green-500' : ''}`}></div>
                                                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${formData.hours === '24 Hours' ? 'translate-x-5' : ''}`}></div>
                                            </div>
                                            <span className="text-xs font-bold text-gray-500 group-hover:text-gray-800 transition-colors">Open 24/7</span>
                                        </label>
                                    </div>

                                    {formData.hours !== '24 Hours' && (
                                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="space-y-2">
                                                <p className="text-[10px] uppercase font-bold text-gray-400 ml-1">Opening Time</p>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <i className="fa-regular fa-clock text-gray-400"></i>
                                                    </div>
                                                    <input
                                                        type="time"
                                                        defaultValue="10:00"
                                                        onClick={(e) => {
                                                            try { e.target.showPicker(); } catch (err) { }
                                                        }}
                                                        onChange={(e) => {
                                                            const time = e.target.value;
                                                            const [h, m] = time.split(':');
                                                            const ampm = h >= 12 ? 'PM' : 'AM';
                                                            const hour = h % 12 || 12;
                                                            const formatted = `${hour}:${m} ${ampm}`;
                                                            const currentClose = formData.hours.split(' – ')[1] || '10:00 PM';
                                                            setFormData({ ...formData, hours: `${formatted} – ${currentClose}` });
                                                        }}
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm font-medium cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] uppercase font-bold text-gray-400 ml-1">Closing Time</p>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <i className="fa-solid fa-moon text-gray-400"></i>
                                                    </div>
                                                    <input
                                                        type="time"
                                                        defaultValue="22:00"
                                                        onClick={(e) => {
                                                            try { e.target.showPicker(); } catch (err) { }
                                                        }}
                                                        onChange={(e) => {
                                                            const time = e.target.value;
                                                            const [h, m] = time.split(':');
                                                            const ampm = h >= 12 ? 'PM' : 'AM';
                                                            const hour = h % 12 || 12;
                                                            const formatted = `${hour}:${m} ${ampm}`;
                                                            const currentOpen = formData.hours.split(' – ')[0] || '10:00 AM';
                                                            setFormData({ ...formData, hours: `${currentOpen} – ${formatted}` });
                                                        }}
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm font-medium cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Section 4: Products */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center font-bold">4</div>
                                    <h2 className="text-2xl font-bold text-gray-800">Products / Services</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={addProductField}
                                    className="text-[#ff8938] font-bold hover:text-[#ff0000] text-sm flex items-center gap-1"
                                >
                                    <i className="fa-solid fa-circle-plus"></i> Add More
                                </button>
                            </div>
                            <div className="space-y-4">
                                {formData.products.map((p, index) => (
                                    <div key={index} className="flex gap-4 items-end animate-in fade-in slide-in-from-right-2 duration-200">
                                        <div className="flex-1 space-y-2">
                                            <label className="text-[10px] uppercase font-bold text-gray-400">Item Name</label>
                                            <input
                                                type="text"
                                                value={p.name} onChange={e => handleProductChange(index, 'name', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                                placeholder="e.g. Golden Fried Mushroom"
                                            />
                                        </div>
                                        <div className="w-32 space-y-2">
                                            <label className="text-[10px] uppercase font-bold text-gray-400">Price</label>
                                            <input
                                                type="text"
                                                value={p.price} onChange={e => handleProductChange(index, 'price', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                                placeholder="e.g. ₹280"
                                            />
                                        </div>
                                        {formData.products.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeProductField(index)}
                                                className="p-3.5 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="pt-6">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#ff8938] to-[#ff0000] text-white text-xl font-black py-5 rounded-2xl shadow-2xl hover:shadow-orange-500/30 transform hover:-translate-y-1 transition-all duration-300 active:scale-95"
                            >
                                <i className="fa-solid fa-cloud-arrow-up mr-2"></i>
                                Submit Shop for Review
                            </button>
                            <p className="text-center text-gray-400 text-xs mt-4">By submitting, you agree to our merchant terms of service.</p>
                        </div>

                    </div>
                </form>
            </main>

            {/* Map Modal */}
            {showMapModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Pin Shop Location</h3>
                                <p className="text-xs text-gray-500">Search for your place or drag the marker to the exact spot</p>
                            </div>
                            <button onClick={() => setShowMapModal(false)} className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="relative flex-1">
                            {/* Map Container */}
                            <div id="map-picker" className="h-full w-full"></div>

                            {/* Locating Overlay */}
                            {isLocating && (
                                <div className="absolute inset-0 z-[4000] bg-white/40 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
                                    <div className="bg-white/90 p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4 border border-white">
                                        <div className="relative">
                                            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <i className="fa-solid fa-location-crosshairs text-blue-600 animate-pulse"></i>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-800 font-black tracking-tight">Locating your shop...</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Checking GPS Signal</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Custom Map Search Bar */}
                            <div className="absolute top-4 left-4 right-4 z-[3000] flex gap-2 pointer-events-none">
                                <div className="flex-1 max-w-md pointer-events-auto">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <i className="fa-solid fa-magnifying-glass text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search for a place or landmark..."
                                            value={mapSearchQuery}
                                            onChange={(e) => setMapSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-white border-none rounded-xl shadow-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />

                                        {/* Suggestions Dropdown */}
                                        {suggestions.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[4000]">
                                                {suggestions.map((s, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => selectSuggestion(s)}
                                                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-none transition-colors"
                                                    >
                                                        <div className="flex gap-3">
                                                            <i className="fa-solid fa-location-dot text-gray-400 mt-1"></i>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-800 line-clamp-1">{s.display_name.split(',')[0]}</p>
                                                                <p className="text-[10px] text-gray-500 line-clamp-1">{s.display_name}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {isSearching && (
                                            <div className="absolute right-3 top-3 text-blue-500 animate-spin">
                                                <i className="fa-solid fa-circle-notch"></i>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!navigator.geolocation) { alert("Geolocation not supported"); return; }
                                        navigator.geolocation.getCurrentPosition(async (pos) => {
                                            const { latitude, longitude } = pos.coords;
                                            mapRef.current.flyTo([latitude, longitude], 17);
                                            markerRef.current.setLatLng([latitude, longitude]);
                                            setFormData(prev => ({ ...prev, lat: latitude, lng: longitude }));
                                            const data = await reverseGeocode(latitude, longitude);
                                            if (data) setFormData(prev => ({ ...prev, address: data.display_name }));
                                        }, () => alert("Location access denied"));
                                    }}
                                    className="pointer-events-auto bg-white hover:bg-gray-50 text-blue-600 w-12 h-12 rounded-xl shadow-xl flex items-center justify-center transition-all active:scale-90 border border-blue-100"
                                    title="Locate Me"
                                >
                                    <i className="fa-solid fa-crosshairs text-lg"></i>
                                </button>
                            </div>

                            {/* Help Badge */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[3000] pointer-events-none">
                                <div className="bg-black/70 text-white px-4 py-2 rounded-full text-[10px] font-bold backdrop-blur-md uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    Drag marker to refine exact spot
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white border-t flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Confirmed Address</p>
                                <div className="text-sm font-bold text-gray-700 flex items-start gap-2">
                                    <i className="fa-solid fa-location-dot text-red-500 mt-1"></i>
                                    <span className="line-clamp-2">{formData.address || "Please select a location..."}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowMapModal(false)}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black py-4 px-12 rounded-2xl shadow-xl hover:shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                            >
                                Confirm Location
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Emoji Modal */}
            {showEmojiModal && (
                <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800">Choose Shop Icon</h3>
                            <button onClick={() => setShowEmojiModal(false)} className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            <div className="grid grid-cols-4 gap-4">
                                {EMOJI_LIST.map((e, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => selectEmoji(e)}
                                        className="aspect-square bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
                                    >
                                        <span className="text-2xl" dangerouslySetInnerHTML={{ __html: e.code }}></span>
                                        <span className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter">{e.cat}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 bg-orange-50 border-t border-orange-100 text-center">
                            <p className="text-[10px] text-orange-600 font-bold uppercase">The HTML Code will be saved automatically</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
