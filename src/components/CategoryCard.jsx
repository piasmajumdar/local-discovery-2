import React from 'react';

export default function CategoryCard({ name, image, onClick }) {
    return (
        <div 
            onClick={onClick}
            className="h-[120px] w-[120px] text-center border border-[#a29b9b83] rounded-lg flex justify-center items-center hover:shadow-md cursor-pointer transition-all hover:-translate-y-1 bg-white"
        >
            <div>
                <img src={image} alt={name} className="w-20 h-20 mx-auto object-contain p-1" />
                <p className="font-semibold text-[#5f5f5f] text-sm mt-1">{name}</p>
            </div>
        </div>
    );
}
