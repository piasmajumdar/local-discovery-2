"use client";
import React, { useState, useEffect, useRef, useMemo, memo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SHOPS } from '@/data/shops';

// Helper functions from search.js
const BASE_LAT = 16.492241, BASE_LNG = 80.500429;

function calcRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return +(sum / reviews.length).toFixed(1);
}

function calcDist(lat, lng) {
  const p = 0.017453292519943295;    
  const c = Math.cos;
  const a = 0.5 - c((lat - BASE_LAT) * p)/2 + 
          c(BASE_LAT * p) * c(lat * p) * 
          (1 - c((lng - BASE_LNG) * p))/2;
  return +(12742 * Math.asin(Math.sqrt(a))).toFixed(1);
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
      <span className="pulse" style={{display:'inline-block', width:'6px', height:'7px', background:'#16a34a', borderRadius:'50%', marginRight:'2px'}}></span>
      Open
    </span>
  ) : (
    <span className="badge badge-closed">⛔ Closed</span>
  );
  const wB = shop.warning ? (
    <div className="warn-banner">
      <i className="fa-solid fa-triangle-exclamation" style={{marginTop:'1px', flexShrink:0}}></i>
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
                <span className="badge badge-rating" dangerouslySetInnerHTML={{__html: stars(shop.rating) + ' ' + shop.rating + ' <span style="opacity:.6;font-weight:400">(' + (shop.reviews?.length || 0) + ')</span>'}}></span>
                <span className="badge badge-dist"><i className="fa-solid fa-location-dot"></i> {shop.distance}km</span>
                <span className={`badge ${tbClass(shop.trust)}`}><i className="fa-solid fa-shield-halved"></i> {tLabel(shop.trust)}</span>
            </div>
            <div className="trust-bar-wrap">
                <span className="trust-label">Trust</span>
                <div className="trust-bar">
                    <div className="trust-fill" style={{width: shop.trust + '%', background: tcColor}}></div>
                </div>
                <span className="trust-val" style={{color: tcColor}}>{shop.trust}/100</span>
            </div>
            {wB}
        </div>
    </div>
  );
});

ShopCard.displayName = 'ShopCard';

function SearchContent() {
  const [shops, setShops] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [sortValue, setSortValue] = useState('distance');
  const [activeId, setActiveId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailShop, setDetailShop] = useState(null);
  const [detailTab, setDetailTab] = useState('overview');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  const [productQuery, setProductQuery] = useState('');
  const [cityName, setCityName] = useState('Vijayawada');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewPhotos, setReviewPhotos] = useState([]);
  const searchParams = useSearchParams();
  const mapRef = useRef(null);
  const dMapRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity) setCityName(savedCity);
  }, [searchParams]);

  useEffect(() => {
    // initialize distance and dynamic rating strictly from data
    const s = SHOPS.map(shop => {
      const distance = calcDist(shop.lat, shop.lng);
      const rating = calcRating(shop.reviews);
      return { ...shop, distance, rating };
    });
    setShops(s);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.L && !mapRef.current) {
      mapRef.current = window.L.map('map', { zoomControl: false, attributionControl: false }).setView([BASE_LAT, BASE_LNG], 14);
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(mapRef.current);
      
      const ic = window.L.divIcon({ 
        className: '', 
        html: `<div style="width:16px;height:16px;background:#2563eb;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(37,99,235,.25);"></div>`, 
        iconSize: [16, 16], 
        iconAnchor: [8, 8] 
      });
      window.L.marker([BASE_LAT, BASE_LNG], { icon: ic }).addTo(mapRef.current).bindPopup('<div class="popup-name">📍 You are here</div>');
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, activeFilter, sortValue, shops]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) setIsLightboxOpen(false);
        else if (isDetailOpen) closeDetail();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isDetailOpen, isLightboxOpen]);

  useEffect(() => {
    if (!mapRef.current || typeof window === 'undefined' || !window.L) return;
    
    const currentMarkerIds = new Set(filtered.map(s => s.id));
    
    // Remove markers that are no longer in the filtered list
    Object.keys(markersRef.current).forEach(id => {
      if (!currentMarkerIds.has(Number(id))) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Add or update markers
    filtered.forEach(shop => {
      const isAct = shop.id === activeId;
      if (!markersRef.current[shop.id]) {
        const m = window.L.marker([shop.lat, shop.lng], { icon: sIcon(shop, isAct) }).addTo(mapRef.current);
        m.on('click', () => openDetail(shop.id));
        markersRef.current[shop.id] = m;
      } else {
        markersRef.current[shop.id].setIcon(sIcon(shop, isAct));
        if (isAct) markersRef.current[shop.id].setZIndexOffset(1000);
        else markersRef.current[shop.id].setZIndexOffset(0);
      }
    });
  }, [filtered, activeId]);

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
    setDetailTab('overview');
    setProductQuery('');
    setReviewRating(0);
    setReviewText('');
    setReviewPhotos([]);
    if (mapRef.current) mapRef.current.flyTo([shop.lat, shop.lng], 16, { duration: .8 });
  };

  const submitReview = () => {
    if (!reviewRating) { alert("Please select a rating."); return; }
    if (!reviewText.trim()) { alert("Please write a review."); return; }
    
    const newRev = {
      id: Date.now(),
      name: "You",
      init: "Y",
      date: "Just now",
      rating: reviewRating,
      text: reviewText,
      photos: reviewPhotos
    };

    const updatedShops = shops.map(s => {
      if (s.id === detailShop.id) {
        const newReviews = [newRev, ...s.reviews];
        return {
          ...s,
          reviews: newReviews,
          rating: calcRating(newReviews)
        };
      }
      return s;
    });

    setShops(updatedShops);
    setDetailShop(updatedShops.find(s => s.id === detailShop.id));
    setReviewRating(0);
    setReviewText('');
    setReviewPhotos([]);
    alert("Review submitted successfully!");
  };

  const handleRevPhoto = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setReviewPhotos(prev => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setActiveId(null);
  };

  const openLB = (idx, images) => {
    setLightboxImages(images);
    setLightboxIndex(idx);
    setIsLightboxOpen(true);
  };

  const lbNav = (d) => {
    setLightboxIndex(prev => {
        let n = prev + d;
        if (n < 0) n = lightboxImages.length - 1;
        if (n >= lightboxImages.length) n = 0;
        return n;
    });
  };

  const renderOverview = (shop) => {
    const tColor = tc(shop.trust);
    const aiSec = shop.aiRecommended ? (
      <div className="ai-chip">
        <i className="fa-solid fa-wand-magic-sparkles" style={{marginTop:'1px', flexShrink:0}}></i>
        <div>
          <div>{shop.aiReason}</div>
          <div style={{fontWeight:400, opacity:.75, marginTop:'2px', fontSize:'11px'}}>Evaluated on: price, distance, quality feedback & reliability</div>
        </div>
      </div>
    ) : null;
    const wSec = shop.warning ? (
      <div className="warn-detail">
        <i className="fa-solid fa-triangle-exclamation" style={{marginTop:'1px', flexShrink:0}}></i>
        <div>{shop.warning}</div>
      </div>
    ) : null;
    
    return (
      <>
        <div style={{display:'flex', alignItems:'center', gap:'14px', marginBottom:'14px'}}>
          <div style={{width:'70px', height:'70px', borderRadius:'12px', overflow:'hidden', border:'1.5px solid var(--border2)', flexShrink:0, background:'#f3f4f6'}}>
            {shop.coverImg ? <img src={shop.coverImg} style={{width:'100%', height:'100%', objectFit:'cover'}} alt=""/> : <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%', fontSize:'28px'}}>{shop.emoji}</div>}
          </div>
          <div>
            <div style={{fontFamily:"'Manrope',sans-serif", fontSize:'20px', fontWeight:800, color:'var(--text)'}}>{shop.name}</div>
            <div style={{fontSize:'12px', color:'var(--muted)'}}>{shop.category}</div>
          </div>
        </div>
        {aiSec}
        <div className="tags-row" style={{marginBottom:'12px'}}>
          {shop.isOpen ? 
            <span className="badge badge-open" style={{padding:'4px 10px', fontSize:'12px'}}><span className="pulse" style={{display:'inline-block', width:'7px', height:'7px', background:'#16a34a', borderRadius:'50%', marginRight:'3px'}}></span>Open Now</span> : 
            <span className="badge badge-closed" style={{padding:'4px 10px', fontSize:'12px'}}>⛔ Closed</span>
          }
          <span className="badge badge-rating" style={{padding:'4px 10px', fontSize:'12px'}} dangerouslySetInnerHTML={{__html: stars(shop.rating) + ' ' + shop.rating + ' <span style="opacity:.6;font-weight:400;">(' + (shop.reviews?.length || 0) + ')</span>'}}></span>
          <span className="badge badge-dist" style={{padding:'4px 10px', fontSize:'12px'}}><i className="fa-solid fa-location-dot"></i> {shop.distance}km</span>
          <span className={`badge ${tbClass(shop.trust)}`} style={{padding:'4px 10px', fontSize:'12px'}}><i className="fa-solid fa-shield-halved"></i> {tLabel(shop.trust)}</span>
        </div>
        <div className="trust-bar-wrap" style={{marginBottom:'14px'}}>
          <span className="trust-label" style={{fontSize:'12px'}}>Trust Score</span>
          <div className="trust-bar" style={{height:'5px'}}><div className="trust-fill" style={{width: shop.trust + '%', background: tColor}}></div></div>
          <span className="trust-val" style={{fontSize:'12px', color:tColor}}>{shop.trust}/100 — {tLabel(shop.trust)}</span>
        </div>
        {wSec}
        
        <hr className="divider"/>
        <div className="section-label">Top Products Preview</div>
        <div className="product-grid">
          {(shop.products || []).slice(0, 4).map((p, i) => (
            <div key={i} className="product-card">
              <span className="product-name">{p.name}</span>
              <span className="product-price">{p.price}</span>
            </div>
          ))}
        </div>
        {shop.products && shop.products.length > 4 && (
          <div style={{fontSize:'12px', color:'#ff8938', marginTop:'8px', cursor:'pointer'}} onClick={() => setDetailTab('products')}>
            View all {shop.products.length} products →
          </div>
        )}
      </>
    );
  };

  const renderProducts = (shop) => {
    const f = (shop.products || []).filter(p => p.name.toLowerCase().includes(productQuery.toLowerCase()));
    return (
      <>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px'}}>
          <div style={{fontFamily:"'Manrope',sans-serif", fontSize:'17px', fontWeight:800}}>Products & Services</div>
          <span className="badge badge-dist">{shop.products ? shop.products.length : 0} items</span>
        </div>
        <input 
          type="text" 
          placeholder="Search products…" 
          value={productQuery}
          onChange={(e) => setProductQuery(e.target.value)}
          style={{width:'100%', border:'1.5px solid var(--border2)', borderRadius:'10px', padding:'9px 14px', fontFamily:"'Open Sans',sans-serif", fontSize:'13px', outline:'none', marginBottom:'12px', background:'var(--surface2)', color:'var(--text)'}}
        />
        <div className="product-grid">
          {f.map((p, i) => (
            <div key={i} className="product-card">
              <span className="product-name">{p.name}</span>
              <span className="product-price">{p.price}</span>
            </div>
          ))}
          {f.length === 0 && <div style={{gridColumn:'span 2', textAlign:'center', padding:'20px', color:'var(--muted)', fontSize:'13px'}}>No products match "{productQuery}"</div>}
        </div>
      </>
    );
  };

  const renderPhotos = (shop) => {
    const imgs = shop.images || [];
    return (
      <>
        <div style={{fontFamily:"'Manrope',sans-serif", fontSize:'17px', fontWeight:800, marginBottom:'14px'}}>{shop.name} — {imgs.length} Photo{imgs.length !== 1 ? 's' : ''}</div>
        {!imgs.length ? (
          <div className="gallery-empty"><i className="fa-solid fa-images" style={{fontSize:'32px', color:'var(--border2)'}}></i><span style={{fontSize:'13px', color:'var(--muted)'}}>No photos yet — be the first!</span></div>
        ) : (
          <div className="gallery-grid">
            {imgs.slice(0, 5).map((src, i) => {
              if (i === 0) return <div key={i} className="gallery-main" onClick={() => openLB(0, imgs)}><img src={src} alt="" loading="lazy"/></div>;
              return (
                <div key={i} className="gallery-cell" onClick={() => openLB(i, imgs)}>
                  <img src={src} alt="" loading="lazy"/>
                  {i === 4 && imgs.length > 5 && <div className="gallery-more">+{imgs.length - 5} more</div>}
                </div>
              );
            })}
          </div>
        )}
        <hr className="divider"/>
        <div className="section-label">Upload Your Photos</div>
        <label className="photo-upload-btn" style={{display:'inline-block', padding:'10px 20px', border:'1.5px dashed var(--border2)', borderRadius:'12px', cursor:'pointer', fontSize:'13px', color:'var(--muted)'}}>
          <i className="fa-solid fa-camera"></i> Choose Photos
          <input type="file" accept="image/*" multiple style={{display:'none'}} />
        </label>
      </>
    );
  };

  const renderReviews = (shop) => {
    const rLen = shop.reviews?.length || 0;
    const dist = {
      5: Math.round(rLen * (shop.rating >= 4.5 ? 0.7 : 0.4)),
      4: Math.round(rLen * (shop.rating >= 4.0 ? 0.2 : 0.3)),
      3: Math.round(rLen * 0.05),
      2: Math.round(rLen * 0.03),
      1: Math.round(rLen * 0.02)
    };
    const maxD = Math.max(...Object.values(dist)) || 1;
    return (
      <>
        <div className="review-summary">
          <div style={{textAlign:'center', flexShrink:0}}>
            <div className="rev-big-num">{shop.rating}</div>
            <div className="rev-big-stars" dangerouslySetInnerHTML={{__html: stars(shop.rating, true)}}></div>
            <div className="rev-big-count">{rLen} reviews</div>
          </div>
          <div style={{flex:1}}>
            {[5, 4, 3, 2, 1].map(n => (
              <div className="rev-bar-row" key={n}>
                <div className="rev-bar-label">{n}</div>
                <div className="rev-bar-track"><div className="rev-bar-fill" style={{width: Math.round((dist[n] / maxD) * 100) + '%'}}></div></div>
                <div className="rev-bar-count">{dist[n]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="write-review-box">
          <div className="section-label">Write a Review</div>
          <div className="star-picker">
            {[1, 2, 3, 4, 5].map(n => (
              <span 
                key={n} 
                className={`star-btn ${reviewRating >= n ? 'active' : ''}`} 
                onClick={() => setReviewRating(n)}
                style={{cursor:'pointer', fontSize:'24px', color: reviewRating >= n ? '#fbbf24' : '#e5e7eb'}}
              >
                {reviewRating >= n ? '★' : '☆'}
              </span>
            ))}
          </div>
          <textarea 
            className="review-textarea" 
            placeholder={`Share your experience at ${shop.name}…`}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="3"
            style={{width:'100%', border:'1.5px solid var(--border2)', borderRadius:'10px', padding:'10px', fontSize:'13px', marginTop:'10px', outline:'none', background:'var(--surface2)', color:'var(--text)'}}
          />
          <div style={{marginTop:'10px'}}>
            <label className="photo-upload-btn" style={{display:'inline-block', padding:'8px 16px', border:'1.5px dashed var(--border2)', borderRadius:'10px', cursor:'pointer', fontSize:'12px', color:'var(--muted)'}}>
              <i className="fa-solid fa-camera-retro"></i> Add Photos
              <input type="file" accept="image/*" multiple style={{display:'none'}} onChange={handleRevPhoto} />
            </label>
            <div className="photo-preview-row" style={{display:'flex', gap:'8px', marginTop:'8px', overflowX:'auto'}}>
              {reviewPhotos.map((p, i) => (
                <img key={i} src={p} style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'6px', border:'1px solid var(--border2)'}} alt="" />
              ))}
            </div>
          </div>
          <button className="submit-review-btn" onClick={submitReview} style={{marginTop:'10px', width:'100%', padding:'10px', borderRadius:'10px', background:'var(--grad)', color:'#fff', fontWeight:700, border:'none', cursor:'pointer'}}>
            <i className="fa-solid fa-paper-plane"></i> Submit Review
          </button>
        </div>

        <div className="section-label" style={{marginBottom:'12px'}}>{shop.reviews ? shop.reviews.length : 0} Customer Reviews</div>
        <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
          {shop.reviews.map(r => (
            <div key={r.id} className="review-card">
              <div className="reviewer-row">
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                  <div className="reviewer-avatar" style={{width:'32px', height:'32px', background:'var(--grad)', color:'#fff', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:700}}>{r.init}</div>
                  <div>
                    <div className="reviewer-name" style={{fontSize:'13px', fontWeight:700}}>{r.name}</div>
                    <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                      <div dangerouslySetInnerHTML={{__html: stars(r.rating)}}></div>
                      <span className="reviewer-date" style={{fontSize:'11px', color:'var(--muted)'}}>{r.date}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="review-text" style={{fontSize:'13px', color:'var(--text2)', lineHeight:1.5, marginTop:'8px'}}>{r.text}</div>
              {r.photos && r.photos.length > 0 && (
                <div className="review-photos" style={{display:'flex', gap:'8px', marginTop:'10px', overflowX:'auto'}}>
                  {r.photos.map((ph, pi) => (
                    <img 
                      key={pi} 
                      src={ph} 
                      className="review-photo" 
                      onClick={() => openLB(pi, r.photos)}
                      style={{width:'80px', height:'80px', objectFit:'cover', borderRadius:'8px', cursor:'pointer', border:'1px solid var(--border2)'}} 
                      alt="" 
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
          {shop.reviews.length === 0 && <div style={{textAlign:'center', padding:'40px', color:'var(--muted)'}}>No reviews yet</div>}
        </div>
      </>
    );
  };

  useEffect(() => {
    let timeoutId;
    if (isDetailOpen && detailShop && typeof window !== 'undefined' && window.L) {
        timeoutId = setTimeout(() => {
            try {
                if (dMapRef.current) {
                    dMapRef.current.remove();
                    dMapRef.current = null;
                }
                dMapRef.current = window.L.map('detailMap', { zoomControl: false, attributionControl: false }).setView([detailShop.lat, detailShop.lng], 15);
                window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(dMapRef.current);
                window.L.marker([detailShop.lat, detailShop.lng], { icon: sIcon(detailShop, true) }).addTo(dMapRef.current);
            } catch (err) {
                console.error("Error initializing detail map:", err);
            }
        }, 150);
    }

    return () => {
        if (timeoutId) clearTimeout(timeoutId);
        if (dMapRef.current) {
            dMapRef.current.remove();
            dMapRef.current = null;
        }
    };
  }, [isDetailOpen, detailShop]);

  return (
    <div className="fixed-layout">
      <header>
        <nav className="header-nav">
          <Link href="/" className="logo-text"><span>Local</span> Discovery</Link>
          <div className="hdr-search">
            <input type="search" placeholder="Search for shops, services, or essentials..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button className="hdr-search-btn"><i className="fa-solid fa-magnifying-glass-location"></i></button>
          </div>
          <div className="hdr-right">
            <Link href="/" className="btn-list"><i className="fa-solid fa-shop"></i> List your shop</Link>
            <Link href="/login" className="btn-login">Login</Link>
          </div>
        </nav>
      </header>

      <div className="filter-bar">
        <span className="filter-label">Filter:</span>
        <div className={`pill ${activeFilter === 'open' ? 'active' : ''}`} onClick={() => setActiveFilter('open')}>🟢 Open Now</div>
        <div className={`pill ${activeFilter === 'ai' ? 'active' : ''}`} onClick={() => setActiveFilter('ai')}>✨ AI Recommended</div>
        <div className={`pill ${activeFilter === 'nearby' ? 'active' : ''}`} onClick={() => setActiveFilter('nearby')}>📍 Under 1 km</div>
        <div className={`pill ${activeFilter === 'top' ? 'active' : ''}`} onClick={() => setActiveFilter('top')}>⭐ Top Rated</div>
        <div className={`pill ${activeFilter === 'trusted' ? 'active' : ''}`} onClick={() => setActiveFilter('trusted')}>🛡️ High Trust</div>
        {activeFilter && <div className="pill" onClick={() => setActiveFilter('')} style={{background: 'var(--border)', color: 'var(--text)'}}>✕ Clear</div>}
      </div>

      <div className="main-layout">
        <div className="left-panel" style={{width: '530px'}}>
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
            {filtered.map(shop => (
              <ShopCard 
                key={shop.id} 
                shop={shop} 
                isActive={activeId === shop.id} 
                onClick={() => openDetail(shop.id)} 
              />
            ))}
            {!filtered.length && <div className="no-results"><i className="fa-solid fa-store-slash"></i><p>No shops found. Try adjusting your filters.</p></div>}
          </div>
        </div>
        <div className="right-panel">
          <div id="map" style={{height:'100%', width:'100%', borderRadius:'0'}}></div>
          <div className="map-fab">
            <div className="map-btn" title="My Location" onClick={() => { if(mapRef.current) mapRef.current.setView([BASE_LAT, BASE_LNG], 15) }}><i className="fa-solid fa-location-crosshairs"></i></div>
            <div className="map-btn" title="Zoom In" onClick={() => { if(mapRef.current) mapRef.current.zoomIn() }}><i className="fa-solid fa-plus"></i></div>
            <div className="map-btn" title="Zoom Out" onClick={() => { if(mapRef.current) mapRef.current.zoomOut() }}><i className="fa-solid fa-minus"></i></div>
          </div>
        </div>
      </div>

      <div className={`detail-overlay ${isDetailOpen ? 'show' : ''}`} onClick={(e) => { if (e.target.classList.contains('detail-overlay')) closeDetail(); }}>
        <div className="detail-panel">
          <div className="detail-close" onClick={closeDetail}><i className="fa-solid fa-xmark"></i></div>
          <div className="detail-tabs">
            <button className={`tab-btn ${detailTab === 'overview' ? 'active' : ''}`} onClick={() => setDetailTab('overview')}><i className="fa-solid fa-store"></i> Overview</button>
            <button className={`tab-btn ${detailTab === 'products' ? 'active' : ''}`} onClick={() => setDetailTab('products')}><i className="fa-solid fa-box-open"></i> Products</button>
            <button className={`tab-btn ${detailTab === 'photos' ? 'active' : ''}`} onClick={() => setDetailTab('photos')}><i className="fa-solid fa-images"></i> Photos</button>
            <button className={`tab-btn ${detailTab === 'reviews' ? 'active' : ''}`} onClick={() => setDetailTab('reviews')}><i className="fa-solid fa-star"></i> Reviews</button>
          </div>
          <div className="detail-body">
            <div className="detail-left">
                {detailShop && detailTab === 'overview' && renderOverview(detailShop)}
                {detailShop && detailTab === 'products' && renderProducts(detailShop)}
                {detailShop && detailTab === 'photos' && renderPhotos(detailShop)}
                {detailShop && detailTab === 'reviews' && renderReviews(detailShop)}
            </div>
            <div className="detail-right">
                <div className="section-label">Location</div>
                <div style={{height:'180px', borderRadius:'12px', overflow:'hidden', border:'1.5px solid var(--border2)', marginBottom:'5px'}}>
                    <div id="detailMap" style={{height:'100%', width:'100%'}}></div>
                </div>
                <div style={{fontSize:'12px', color:'var(--muted)', marginTop:'5px', marginBottom:'10px', lineHeight:1.5}}>
                  <i className="fa-solid fa-location-dot" style={{color:'#ff8938', marginRight:'5px'}}></i>
                  {detailShop?.address}
                </div>
                <div style={{display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'15px'}}>
                  <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${detailShop?.lat},${detailShop?.lng}`, '_blank')} className="action-btn btn-primary" style={{flex:1}}><i className="fa-solid fa-diamond-turn-right"></i> Directions</button>
                  <button onClick={() => window.open(`tel:${detailShop?.phone}`)} className="action-btn btn-secondary"><i className="fa-solid fa-phone"></i> Call</button>
                </div>
                
                <hr className="divider" style={{margin:'10px 0'}} />
                <div className="section-label">Hours & Contact</div>
                <div className="info-row"><i className="fa-solid fa-clock"></i><div>{detailShop?.hours}</div></div>
                <div className="info-row"><i className="fa-solid fa-phone"></i><strong>{detailShop?.phone}</strong></div>
                
                <hr className="divider" style={{margin:'10px 0'}} />
                <div className="section-label">Tags</div>
                <div className="tags-row">{detailShop?.tags && detailShop.tags.map((t, i) => <span key={i} className="badge badge-dist">#{t}</span>)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={`lightbox ${isLightboxOpen ? 'show' : ''}`} onClick={(e) => { if (e.target.classList.contains('lightbox')) setIsLightboxOpen(false); }}>
        <button className="lb-close" onClick={() => setIsLightboxOpen(false)}><i className="fa-solid fa-xmark"></i></button>
        <button className="lb-nav lb-prev" onClick={() => lbNav(-1)}><i className="fa-solid fa-chevron-left"></i></button>
        <img src={lightboxImages[lightboxIndex]} alt="" />
        <button className="lb-nav lb-next" onClick={() => lbNav(1)}><i className="fa-solid fa-chevron-right"></i></button>
        <div className="lb-counter">{lightboxIndex + 1} / {lightboxImages.length}</div>
      </div>
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
