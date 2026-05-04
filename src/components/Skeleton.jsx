import React from 'react';

export const CategorySkeleton = () => (
    <div className="h-[120px] w-[120px] rounded-lg border border-gray-100 bg-white flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mb-2"></div>
        <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
    </div>
);

export const CategorySectionSkeleton = () => (
    <div className="p-2 border border-gray-100 rounded-lg bg-gray-50/30 w-full">
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse m-4"></div>
        <div className="flex flex-wrap gap-6 p-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <CategorySkeleton key={i} />
            ))}
        </div>
    </div>
);

export const ShopCardSkeleton = () => (
    <div className="w-full p-4 border border-gray-100 rounded-2xl bg-white shadow-sm mb-4">
        <div className="flex gap-4">
            <div className="w-32 h-32 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="flex-1 space-y-3">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex gap-2">
                    <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    </div>
);

export const HeroCardSkeleton = () => (
    <div className="h-[300px] w-[200px] rounded-lg bg-gray-200 animate-pulse flex flex-col justify-end p-5 shadow-sm">
        <div className="p-2 rounded-lg bg-gray-300/50 space-y-3">
            <div className="h-8 w-full bg-gray-300 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
        </div>
    </div>
);
