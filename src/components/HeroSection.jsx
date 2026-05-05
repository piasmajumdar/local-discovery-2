'use client';
import { useState, useEffect } from 'react';
import { HeroCardSkeleton } from './Skeleton';

const HERO_CARDS = [
    { img: 'https://res.cloudinary.com/dt6mkrgtp/image/upload/v1777936994/categories_img/vegetables.jpg', color: '#3e9f3cc5', title: 'Fresh Vegetables', desc: 'Find nearby vegetable markets and street vendors.' },
    { img: 'https://res.cloudinary.com/dt6mkrgtp/image/upload/v1777936995/categories_img/restaurant.jpg', color: '#9f413cc5', title: 'Search Restaurants', desc: 'Find nearby cafés, tiffin centers, and budget meals.' },
    { img: 'https://res.cloudinary.com/dt6mkrgtp/image/upload/v1777936996/categories_img/medicine.jpg', color: '#3c629fc5', title: 'Find Medical Stores', desc: 'Locate trusted pharmacies and 24×7 medicine shops.' }
];

export default function HeroSection() {
    const [heroIndex, setHeroIndex] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        setMounted(true);
        setWindowWidth(window.innerWidth);

        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        const interval = setInterval(() => {
            if (window.innerWidth < 1024) {
                setHeroIndex(prev => (prev + 1) % HERO_CARDS.length);
            }
        }, 3000);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (!mounted) {
        return (
            <div className="flex gap-2 justify-center lg:justify-end w-full lg:w-auto">
                <HeroCardSkeleton />
                <HeroCardSkeleton />
                <HeroCardSkeleton />
            </div>
        );
    }

    return (
        <div className="flex gap-2 justify-center lg:justify-end w-full lg:w-auto">
            {HERO_CARDS.map((card, i) => {
                const isVisible =
                    windowWidth >= 1024 ||
                    i === heroIndex ||
                    (windowWidth >= 768 && windowWidth < 1024 && (i === heroIndex || i === (heroIndex + 1) % 3));

                return (
                    <div 
                        key={i} 
                        className={`transition-all duration-500 ${isVisible ? 'block' : 'hidden lg:block'} ${windowWidth < 768 ? 'mx-auto' : ''}`}
                    >
                        <a href="#">
                            <div className="h-[300px] w-[200px] rounded-lg text-white p-5 bg-cover bg-center" style={{ backgroundImage: `url(${card.img})` }}>
                                <div className="p-2 rounded-lg" style={{ backgroundColor: card.color }}>
                                    <h3 className="text-2xl font-bold pb-3 leading-tight">{card.title}</h3>
                                    <p className="text-sm">{card.desc}</p>
                                </div>
                            </div>
                        </a>
                    </div>
                );
            })}
        </div>
    );
}
