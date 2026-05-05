import React from 'react';

const ShopCardDashboard = ({ shop }) => {
    return (
        <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 flex gap-5 items-center hover:shadow-xl hover:border-orange-100 transition-all group">
            {/* Image Section */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 relative">
                <img 
                    src={shop.coverImg || 'https://via.placeholder.com/300?text=No+Image'} 
                    alt={shop.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-lg shadow-sm">
                    <span className="text-[10px]" dangerouslySetInnerHTML={{ __html: shop.emoji }}></span>
                </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="text-lg font-black text-gray-800 truncate tracking-tight">{shop.name}</h4>
                    {shop.isVerifiedByAdmin ? (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                            <i className="fa-solid fa-circle-check"></i> Verified
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                            <i className="fa-solid fa-clock"></i> Pending
                        </span>
                    )}
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded-md">{shop.category}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                        <i className="fa-solid fa-location-dot text-red-400"></i>
                        <span className="truncate max-w-[150px]">{shop.address?.split(',')[0]}</span>
                    </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-0.5">Trust Score</span>
                            <div className="flex items-center gap-1.5">
                                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${shop.trust >= 80 ? 'bg-green-500' : 'bg-orange-400'}`} 
                                        style={{ width: `${shop.trust}%` }}
                                    ></div>
                                </div>
                                <span className="text-[10px] font-black text-gray-800">{shop.trust}%</span>
                            </div>
                         </div>
                    </div>
                    <button className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-800 flex items-center justify-center transition-colors">
                        <i className="fa-solid fa-chevron-right text-xs"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShopCardDashboard;
