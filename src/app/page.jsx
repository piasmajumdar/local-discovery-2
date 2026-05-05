import CategoryCard from '@/components/CategoryCard';
import SearchSection from '@/components/SearchSection';
import HeroSection from '@/components/HeroSection';
import { getCategories } from '@/lib/api';

export const metadata = {
    title: 'Local Discovery | Find Shops & Services Near You',
    description: 'Discover local shops, restaurants, pharmacies and more in your community. AI-based local search for everything you need.',
    keywords: 'local discovery, near me, shops, services, Vijayawada, MERN app',
};

export default async function HomePage() {
    const categories = await getCategories();

    return (
        <div>
            {/* Hero & Search Section */}
            <section className="w-11/12 sm:w-10/12 mt-10 mx-auto flex flex-col lg:flex-row gap-10 items-center justify-between px-2">
                <SearchSection />
                <HeroSection />
            </section>

            {/* Categories Section */}
            <section className="w-11/12 sm:w-10/12 mx-auto my-20 grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
                {categories.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl">
                        <p className="text-gray-500 font-medium italic">No categories found. Check back later!</p>
                    </div>
                ) : (
                    categories.map((cat) => (
                        <div key={cat._id || cat.id} className="p-2 border border-[#cbc2c283] rounded-lg bg-gray-50/30">
                            <h2 className="font-bold text-lg py-4 px-2">{cat.section}</h2>
                            <div className="flex flex-wrap gap-6 justify-start p-2">
                                {cat.items.map((item) => (
                                    <CategoryCard
                                        key={item.id}
                                        name={item.name}
                                        image={item.image}
                                        // CategoryCard needs to be able to handle its own navigation or we wrap it
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </section>
        </div>
    );
}
