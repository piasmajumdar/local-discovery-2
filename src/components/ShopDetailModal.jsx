"use client";
import React, { useState, useEffect, useRef } from 'react';
import { postReview } from '@/lib/api';

function calcRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return +(sum / reviews.length).toFixed(1);
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

export default function ShopDetailModal({ isOpen, shop, onClose, onUpdateShop }) {
  const [detailTab, setDetailTab] = useState('overview');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [productQuery, setProductQuery] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewPhotos, setReviewPhotos] = useState([]);
  const [reviewFiles, setReviewFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewStatus, setReviewStatus] = useState(null); // null, 'submitting', 'success', 'error'
  const [user, setUser] = useState(null);

  const dMapRef = useRef(null);

  useEffect(() => {
    if (isOpen && shop) {
      setDetailTab('overview');
      setProductQuery('');
      setReviewPhotos([]);
      setReviewFiles([]);
      setIsSubmitting(false);

      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
      
      if (typeof window !== 'undefined' && window.L) {
        setTimeout(() => {
          if (!dMapRef.current) {
            dMapRef.current = window.L.map('detailMap', { zoomControl: false, attributionControl: false }).setView([shop.lat, shop.lng], 16);
            window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(dMapRef.current);
            window.L.marker([shop.lat, shop.lng]).addTo(dMapRef.current);
          } else {
            dMapRef.current.flyTo([shop.lat, shop.lng], 16, { animate: false });
            dMapRef.current.eachLayer(layer => {
              if (layer instanceof window.L.Marker) {
                layer.setLatLng([shop.lat, shop.lng]);
              }
            });
          }
        }, 100);
      }
    }

    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, shop, onClose]);

  if (!shop) return null;

  const submitReview = async () => {
    if (!user) { alert("Please login to submit a review."); return; }
    if (!reviewRating) { setReviewStatus('error'); return; }
    if (!reviewText.trim()) { setReviewStatus('error'); return; }

    setIsSubmitting(true);
    setReviewStatus('submitting');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('rating', reviewRating);
      formData.append('text', reviewText);
      
      reviewFiles.forEach(file => {
        formData.append('photos', file);
      });

      const result = await postReview(token, shop.id, formData);

      if (result.success) {
        if (onUpdateShop) {
          onUpdateShop(shop.id, result.review);
        }
        setReviewRating(0);
        setReviewText('');
        setReviewPhotos([]);
        setReviewFiles([]);
        setReviewStatus('success');
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
      setReviewStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotosOnlyUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!user) { window.location.href = '/login'; return; }
    if (files.length === 0) return;

    setReviewStatus('submitting');
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('rating', 5); // Default rating for gallery contributions
      formData.append('text', "Added photos to the gallery"); 
      
      files.forEach(file => {
        formData.append('photos', file);
      });

      const result = await postReview(token, shop.id, formData);

      if (result.success) {
        if (onUpdateShop) {
          onUpdateShop(shop.id, result.review);
        }
        setReviewStatus('success');
      }
    } catch (err) {
      console.error("Gallery upload error:", err);
      setReviewStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevPhoto = (e) => {
    const files = Array.from(e.target.files);
    setReviewFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setReviewPhotos(prev => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
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

  const renderOverview = () => {
    const tColor = tc(shop.trust);
    const aiSec = shop.aiRecommended ? (
      <div className="ai-chip">
        <i className="fa-solid fa-wand-magic-sparkles" style={{ marginTop: '1px', flexShrink: 0 }}></i>
        <div>
          <div>{shop.aiReason}</div>
          <div style={{ fontWeight: 400, opacity: .75, marginTop: '2px', fontSize: '11px' }}>Evaluated on: price, distance, quality feedback & reliability</div>
        </div>
      </div>
    ) : null;
    const wSec = shop.warning ? (
      <div className="warn-detail">
        <i className="fa-solid fa-triangle-exclamation" style={{ marginTop: '1px', flexShrink: 0 }}></i>
        <div>{shop.warning}</div>
      </div>
    ) : null;

    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid var(--border2)', flexShrink: 0, background: '#f3f4f6' }}>
            {shop.coverImg ? <img src={shop.coverImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '28px' }}>{shop.emoji}</div>}
          </div>
          <div>
            <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: '20px', fontWeight: 800, color: 'var(--text)' }}>{shop.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{shop.category}</div>
          </div>
        </div>
        {aiSec}
        <div className="tags-row" style={{ marginBottom: '12px' }}>
          {shop.isOpen ?
            <span className="badge badge-open" style={{ padding: '4px 10px', fontSize: '12px' }}><span className="pulse" style={{ display: 'inline-block', width: '7px', height: '7px', background: '#16a34a', borderRadius: '50%', marginRight: '3px' }}></span>Open Now</span> :
            <span className="badge badge-closed" style={{ padding: '4px 10px', fontSize: '12px' }}>⛔ Closed</span>
          }
          <span className="badge badge-rating" style={{ padding: '4px 10px', fontSize: '12px' }} dangerouslySetInnerHTML={{ __html: stars(shop.rating) + ' ' + shop.rating + ' <span style="opacity:.6;font-weight:400;">(' + (shop.reviews?.length || 0) + ')</span>' }}></span>
          <span className="badge badge-dist" style={{ padding: '4px 10px', fontSize: '12px' }}><i className="fa-solid fa-location-dot"></i> {shop.distance}km</span>
          <span className={`badge ${tbClass(shop.trust)}`} style={{ padding: '4px 10px', fontSize: '12px' }}><i className="fa-solid fa-shield-halved"></i> {tLabel(shop.trust)}</span>
        </div>
        <div className="trust-bar-wrap" style={{ marginBottom: '14px' }}>
          <span className="trust-label" style={{ fontSize: '12px' }}>Trust Score</span>
          <div className="trust-bar" style={{ height: '5px' }}><div className="trust-fill" style={{ width: shop.trust + '%', background: tColor }}></div></div>
          <span className="trust-val" style={{ fontSize: '12px', color: tColor }}>{shop.trust}/100 — {tLabel(shop.trust)}</span>
        </div>
        {wSec}

        <hr className="divider" />
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
          <div style={{ fontSize: '12px', color: '#ff8938', marginTop: '8px', cursor: 'pointer' }} onClick={() => setDetailTab('products')}>
            View all {shop.products.length} products →
          </div>
        )}
      </>
    );
  };

  const renderProducts = () => {
    const f = (shop.products || []).filter(p => p.name.toLowerCase().includes(productQuery.toLowerCase()));
    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: '17px', fontWeight: 800 }}>Products & Services</div>
          <span className="badge badge-dist">{shop.products ? shop.products.length : 0} items</span>
        </div>
        <input
          type="text"
          placeholder="Search products…"
          value={productQuery}
          onChange={(e) => setProductQuery(e.target.value)}
          style={{ width: '100%', border: '1.5px solid var(--border2)', borderRadius: '10px', padding: '9px 14px', fontFamily: "'Open Sans',sans-serif", fontSize: '13px', outline: 'none', marginBottom: '12px', background: 'var(--surface2)', color: 'var(--text)' }}
        />
        <div className="product-grid">
          {f.map((p, i) => (
            <div key={i} className="product-card">
              <span className="product-name">{p.name}</span>
              <span className="product-price">{p.price}</span>
            </div>
          ))}
          {f.length === 0 && <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '20px', color: 'var(--muted)', fontSize: '13px' }}>No products match "{productQuery}"</div>}
        </div>
      </>
    );
  };

  const renderPhotos = () => {
    const imgs = shop.images || [];
    return (
      <div style={{ position: 'relative', minHeight: '300px' }}>
        {reviewStatus && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-white/95 backdrop-blur-sm animate-in fade-in duration-300 rounded-2xl">
                <div className="text-center space-y-4">
                    {reviewStatus === 'submitting' && (
                        <div className="animate-in zoom-in-95 duration-300">
                            <div className="w-12 h-12 border-4 border-[#ff8938] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-gray-800 font-bold text-sm">Uploading to Gallery...</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Optimizing Quality</p>
                        </div>
                    )}
                    {reviewStatus === 'success' && (
                        <div className="animate-in zoom-in-95 duration-500">
                            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                                <i className="fa-solid fa-check"></i>
                            </div>
                            <h3 className="text-lg font-black text-gray-800">Photos Added!</h3>
                            <p className="text-xs text-gray-500 mb-4">Your contributions are now live.</p>
                            <button 
                                onClick={() => setReviewStatus(null)}
                                className="px-6 py-2 bg-gray-900 text-white rounded-full font-bold text-xs hover:scale-105 transition-all shadow-lg"
                            >
                                Awesome!
                            </button>
                        </div>
                    )}
                    {reviewStatus === 'error' && (
                        <div className="animate-in zoom-in-95 duration-300">
                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                            </div>
                            <h3 className="text-lg font-black text-gray-800">Upload Failed</h3>
                            <p className="text-xs text-gray-500 mb-4">Please try again.</p>
                            <button 
                                onClick={() => setReviewStatus(null)}
                                className="px-6 py-2 bg-red-600 text-white rounded-full font-bold text-xs shadow-lg"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}

        <div style={{ fontFamily: "'Manrope',sans-serif", fontSize: '17px', fontWeight: 800, marginBottom: '14px' }}>{shop.name} — {imgs.length} Photo{imgs.length !== 1 ? 's' : ''}</div>
        {!imgs.length ? (
          <div className="gallery-empty"><i className="fa-solid fa-images" style={{ fontSize: '32px', color: 'var(--border2)' }}></i><span style={{ fontSize: '13px', color: 'var(--muted)' }}>No photos yet — be the first!</span></div>
        ) : (
          <div className="gallery-grid">
            {imgs.slice(0, 5).map((src, i) => {
              if (i === 0) return <div key={i} className="gallery-main" onClick={() => openLB(0, imgs)}><img src={src} alt="" loading="lazy" /></div>;
              return (
                <div key={i} className="gallery-cell" onClick={() => openLB(i, imgs)}>
                  <img src={src} alt="" loading="lazy" />
                  {i === 4 && imgs.length > 5 && <div className="gallery-more">+{imgs.length - 5} more</div>}
                </div>
              );
            })}
          </div>
        )}
        <hr className="divider" />
        <div className="section-label">Upload Your Photos</div>
        
        {!user ? (
          <div style={{ textAlign: 'center', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
             <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>Log in to contribute photos to this shop's gallery.</p>
             <button 
              onClick={() => window.location.href='/login'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
             >
               Login to Upload
             </button>
          </div>
        ) : (
          <label className="photo-upload-btn" style={{ display: 'inline-block', padding: '12px 24px', border: '2px dashed var(--border2)', borderRadius: '15px', cursor: 'pointer', fontSize: '13px', color: 'var(--muted)', width: '100%', textAlign: 'center', background: 'var(--surface2)', transition: 'all' }}>
            <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '20px', marginBottom: '5px', display: 'block', color: '#ff8938' }}></i>
            <span style={{ fontWeight: 700 }}>Choose Photos to Contribution</span>
            <p style={{ fontSize: '10px', marginTop: '4px', opacity: 0.6 }}>Max 5MB each (JPG, PNG, WebP)</p>
            <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handlePhotosOnlyUpload} />
          </label>
        )}
      </div>
    );
  };

  const renderReviews = () => {
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
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div className="rev-big-num">{shop.rating}</div>
            <div className="rev-big-stars" dangerouslySetInnerHTML={{ __html: stars(shop.rating, true) }}></div>
            <div className="rev-big-count">{rLen} reviews</div>
          </div>
          <div style={{ flex: 1 }}>
            {[5, 4, 3, 2, 1].map(n => (
              <div className="rev-bar-row" key={n}>
                <div className="rev-bar-label">{n}</div>
                <div className="rev-bar-track"><div className="rev-bar-fill" style={{ width: Math.round((dist[n] / maxD) * 100) + '%' }}></div></div>
                <div className="rev-bar-count">{dist[n]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="write-review-box" style={{ position: 'relative', overflow: 'hidden', minHeight: '150px' }}>
          {reviewStatus && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-white/95 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="text-center space-y-4">
                    {reviewStatus === 'submitting' && (
                        <div className="animate-in zoom-in-95 duration-300">
                            <div className="w-12 h-12 border-4 border-[#ff8938] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-gray-800 font-bold text-sm">Uploading Feedback...</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Securing Photos</p>
                        </div>
                    )}
                    {reviewStatus === 'success' && (
                        <div className="animate-in zoom-in-95 duration-500">
                            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                                <i className="fa-solid fa-check"></i>
                            </div>
                            <h3 className="text-lg font-black text-gray-800">Review Posted!</h3>
                            <p className="text-xs text-gray-500 mb-4">Your experience is now live.</p>
                            <button 
                                onClick={() => setReviewStatus(null)}
                                className="px-6 py-2 bg-gray-900 text-white rounded-full font-bold text-xs hover:scale-105 transition-all shadow-lg"
                            >
                                Great!
                            </button>
                        </div>
                    )}
                    {reviewStatus === 'error' && (
                        <div className="animate-in zoom-in-95 duration-300">
                            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                            </div>
                            <h3 className="text-lg font-black text-gray-800">Submission Error</h3>
                            <p className="text-xs text-gray-500 mb-4">Please check your internet or rating.</p>
                            <button 
                                onClick={() => setReviewStatus(null)}
                                className="px-6 py-2 bg-red-600 text-white rounded-full font-bold text-xs shadow-lg"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
          )}

          {!user ? (
            <div style={{ textAlign: 'center', padding: '20px', background: '#fff7ed', borderRadius: '12px', border: '1px solid #ffedd5' }}>
               <i className="fa-solid fa-lock text-orange-400 mb-2" style={{ fontSize: '20px' }}></i>
               <p style={{ fontSize: '13px', fontWeight: 700, color: '#9a3412' }}>Login Required</p>
               <p style={{ fontSize: '12px', color: '#c2410c', marginBottom: '10px' }}>Please log in to share your experience and photos.</p>
               <button 
                onClick={() => window.location.href='/login'}
                style={{ padding: '6px 16px', background: '#ea580c', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
               >
                 Login Now
               </button>
            </div>
          ) : (
            <>
              <div className="section-label">Write a Review</div>
              <div className="star-picker">
                {[1, 2, 3, 4, 5].map(n => (
                  <span
                    key={n}
                    className={`star-btn ${reviewRating >= n ? 'active' : ''}`}
                    onClick={() => setReviewRating(n)}
                    style={{ cursor: 'pointer', fontSize: '24px', color: reviewRating >= n ? '#fbbf24' : '#e5e7eb' }}
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
                style={{ width: '100%', border: '1.5px solid var(--border2)', borderRadius: '10px', padding: '10px', fontSize: '13px', marginTop: '10px', outline: 'none', background: 'var(--surface2)', color: 'var(--text)' }}
              />
              <div style={{ marginTop: '10px' }}>
                <label className="photo-upload-btn" style={{ display: 'inline-block', padding: '8px 16px', border: '1.5px dashed var(--border2)', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', color: 'var(--muted)' }}>
                  <i className="fa-solid fa-camera-retro"></i> Add Photos
                  <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleRevPhoto} />
                </label>
                <div className="photo-preview-row" style={{ display: 'flex', gap: '8px', marginTop: '8px', overflowX: 'auto' }}>
                  {reviewPhotos.map((p, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={p} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border2)' }} alt="" />
                      <button 
                        onClick={() => {
                          setReviewPhotos(prev => prev.filter((_, idx) => idx !== i));
                          setReviewFiles(prev => prev.filter((_, idx) => idx !== i));
                        }}
                        style={{ position: 'absolute', top: '-5px', right: '-5px', width: '16px', height: '16px', background: 'red', color: 'white', borderRadius: '50%', fontSize: '10px', border: 'none', cursor: 'pointer' }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                className="submit-review-btn" 
                onClick={submitReview} 
                disabled={isSubmitting}
                style={{ marginTop: '10px', width: '100%', padding: '10px', borderRadius: '10px', background: isSubmitting ? '#ccc' : 'var(--grad)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}
              >
                {isSubmitting ? (
                  <><i className="fa-solid fa-circle-notch fa-spin"></i> Posting...</>
                ) : (
                  <><i className="fa-solid fa-paper-plane"></i> Submit Review</>
                )}
              </button>
            </>
          )}
        </div>

        <div className="section-label" style={{ marginBottom: '12px' }}>{shop.reviews ? shop.reviews.length : 0} Customer Reviews</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {shop.reviews && shop.reviews.map(r => (
            <div key={r.id} className="review-card">
              <div className="reviewer-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="reviewer-avatar" style={{ width: '32px', height: '32px', background: 'var(--grad)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>{r.init}</div>
                  <div>
                    <div className="reviewer-name" style={{ fontSize: '13px', fontWeight: 700 }}>{r.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', color: '#f59e0b' }} dangerouslySetInnerHTML={{ __html: stars(r.rating) }}></span>
                      <span style={{ fontSize: '11px', color: 'var(--muted)' }}>• {r.date}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="review-text">{r.text}</div>
              {r.photos && r.photos.length > 0 && (
                <div className="review-photos" style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  {r.photos.map((p, i) => <img key={i} src={p} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} alt="" />)}
                </div>
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <div className={`detail-overlay z-[5000] ${isOpen ? 'show' : ''}`} onClick={(e) => { if (e.target.classList.contains('detail-overlay')) onClose(); }}>
        <div className="detail-panel">
          <div className="detail-close" onClick={onClose}><i className="fa-solid fa-xmark"></i></div>
          <div className="detail-tabs">
            <button className={`tab-btn ${detailTab === 'overview' ? 'active' : ''}`} onClick={() => setDetailTab('overview')}><i className="fa-solid fa-store"></i> Overview</button>
            <button className={`tab-btn ${detailTab === 'products' ? 'active' : ''}`} onClick={() => setDetailTab('products')}><i className="fa-solid fa-box-open"></i> Products</button>
            <button className={`tab-btn ${detailTab === 'photos' ? 'active' : ''}`} onClick={() => setDetailTab('photos')}><i className="fa-solid fa-images"></i> Photos</button>
            <button className={`tab-btn ${detailTab === 'reviews' ? 'active' : ''}`} onClick={() => setDetailTab('reviews')}><i className="fa-solid fa-star"></i> Reviews</button>
          </div>
          <div className="detail-body">
            <div className="detail-left">
              {detailTab === 'overview' && renderOverview()}
              {detailTab === 'products' && renderProducts()}
              {detailTab === 'photos' && renderPhotos()}
              {detailTab === 'reviews' && renderReviews()}
            </div>
            <div className="detail-right">
              <div className="section-label">Location</div>
              <div style={{ height: '180px', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid var(--border2)', marginBottom: '5px' }}>
                <div id="detailMap" style={{ height: '100%', width: '100%' }}></div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '5px', marginBottom: '10px', lineHeight: 1.5 }}>
                <i className="fa-solid fa-location-dot" style={{ color: '#ff8938', marginRight: '5px' }}></i>
                {shop.address}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '15px' }}>
                <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`, '_blank')} className="action-btn btn-primary" style={{ flex: 1 }}><i className="fa-solid fa-diamond-turn-right"></i> Directions</button>
                <button onClick={() => window.open(`tel:${shop.phone}`)} className="action-btn btn-secondary"><i className="fa-solid fa-phone"></i> Call</button>
              </div>

              <hr className="divider" style={{ margin: '10px 0' }} />
              <div className="section-label">Hours & Contact</div>
              <div className="info-row"><i className="fa-solid fa-clock"></i><div>{shop.hours}</div></div>
              <div className="info-row"><i className="fa-solid fa-phone"></i><strong>{shop.phone}</strong></div>

              <hr className="divider" style={{ margin: '10px 0' }} />
              <div className="section-label">Tags</div>
              <div className="tags-row">{shop.tags && shop.tags.map((t, i) => <span key={i} className="badge badge-dist">#{t}</span>)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={`lightbox z-[6000] ${isLightboxOpen ? 'show' : ''}`} onClick={(e) => { if (e.target.classList.contains('lightbox')) setIsLightboxOpen(false); }}>
        <button className="lb-close" onClick={() => setIsLightboxOpen(false)}><i className="fa-solid fa-xmark"></i></button>
        <button className="lb-nav lb-prev" onClick={() => lbNav(-1)}><i className="fa-solid fa-chevron-left"></i></button>
        <img src={lightboxImages[lightboxIndex]} alt="" />
        <button className="lb-nav lb-next" onClick={() => lbNav(1)}><i className="fa-solid fa-chevron-right"></i></button>
        <div className="lb-counter">{lightboxIndex + 1} / {lightboxImages.length}</div>
      </div>
    </>
  );
}
