import React from 'react';

export const metadata = {
  title: 'About Local Discovery | The Entire Local Market at Your Fingertips',
  description: 'Find every nearby shop and every local product instantly. Local Discovery puts the entire marketplace in your pocket with AI-driven trust and real-time accessibility.',
  keywords: 'local marketplace, find nearby shops, local product search, community commerce, local inventory discovery',
};

export default function AboutPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen font-['Inter',sans-serif]">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-[#0f172a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff8938]/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
            The Entire Local Market, Right at Your <span className="text-[#ff8938]">Fingertips</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Local Discovery brings every nearby shop and every local product into one unified experience. Our mission is to put the entire marketplace in your pocket, making local shopping faster, smarter, and more reliable than ever before.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 bg-orange-100 text-[#ff8938] rounded-full text-xs font-black uppercase tracking-widest">
              Our Mission
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              Every Shop, Every Product, One App
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Finding what you need locally shouldn't be a scavenger hunt. We've aggregated the whole market into our app so you can browse inventories, check availability, and discover hidden gems in your neighborhood without ever leaving your home.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-[#ff8938] flex-shrink-0">
                  <i className="fa-solid fa-shield-check text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Verified Reliability</h3>
                  <p className="text-sm text-slate-500">Every shop undergoes a rigorous AI-driven trust evaluation.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                  <i className="fa-solid fa-microchip text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">AI-Powered Insights</h3>
                  <p className="text-sm text-slate-500">Helping you find the best value through data-driven recommendations.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
             <div className="aspect-square bg-gradient-to-tr from-[#ff8938] to-[#ff5f38] rounded-[3rem] rotate-3 opacity-10 absolute inset-0"></div>
             <div className="relative bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100">
                <h3 className="text-5xl font-black text-[#ff8938] mb-4">98%</h3>
                <p className="text-slate-900 font-bold text-xl mb-6">Of users find their go-to local services through our platform.</p>
                <div className="space-y-6">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#ff8938] w-[98%]"></div>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                    <span>Trust Satisfaction</span>
                    <span className="text-slate-800">Excellent</span>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* The AI Factor - SEO Focused */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6 font-['Plus_Jakarta_Sans',sans-serif]">The Local Discovery <span className="text-[#ff8938]">Difference</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto">We don't just list shops; we analyze community feedback and service history to build a transparent marketplace.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-800/50 rounded-3xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
              <i className="fa-solid fa-brain text-[#ff8938] text-3xl mb-6"></i>
              <h3 className="text-xl font-bold mb-4">Algorithmic Trust</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Our proprietary algorithm calculates a "Trust Score" for every business, factoring in verification status, user feedback, and service consistency.</p>
            </div>
            <div className="p-8 bg-slate-800/50 rounded-3xl border border-slate-700/50 hover:bg-slate-800 transition-colors md:translate-y-8">
              <i className="fa-solid fa-magnifying-glass-location text-[#ff8938] text-3xl mb-6"></i>
              <h3 className="text-xl font-bold mb-4">Finding the "Unfindable"</h3>
              <p className="text-slate-400 text-sm leading-relaxed">We capture the trivial, essential items that major search engines and apps ignore. Whether it's a specific local spice or a niche hardware tool, if it's in your neighborhood, you'll find it here.</p>
            </div>
            <div className="p-8 bg-slate-800/50 rounded-3xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
              <i className="fa-solid fa-handshake-angle text-[#ff8938] text-3xl mb-6"></i>
              <h3 className="text-xl font-bold mb-4">Business Empowerment</h3>
              <p className="text-slate-400 text-sm leading-relaxed">We provide local entrepreneurs with the digital tools they need to reach their audience without the complexity of traditional digital marketing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <article className="prose prose-slate max-w-none">
            <h2 className="text-4xl font-black text-slate-900 mb-8 font-['Plus_Jakarta_Sans',sans-serif]">Why Local Discovery Matters in 2026</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              In an era of mass-produced goods and globalized services, the value of a trusted local merchant has never been higher. <strong>Local Discovery</strong> is built on the belief that community-centric commerce is the backbone of a sustainable economy. We specialize in indexing the "trivial" details—the small, essential items that can't be found on any other search engine or application.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Our application provides what others don't: a direct link to the physical shelves of your neighborhood. Whether you are looking for a highly-rated <strong>pharmacy</strong>, a <strong>trusted restaurant</strong>, or a <strong>niche product</strong> that other apps don't even list, our platform ensures you find exactly what you need at your fingertips.
            </p>
            <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100 flex items-center gap-6 flex-col md:flex-row">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-quote-left text-3xl text-[#ff8938]"></i>
              </div>
              <blockquote className="text-slate-800 font-bold text-xl italic leading-relaxed">
                "Our goal is to ensure that every great local business has the platform to be seen, and every consumer has the confidence to choose them."
              </blockquote>
            </div>
          </article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-r from-[#ff8938] to-[#ff0000] rounded-[3rem] p-12 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <h2 className="text-3xl md:text-5xl font-black mb-6 relative z-10 font-['Plus_Jakarta_Sans',sans-serif]">Ready to Explore Your Community?</h2>
            <p className="text-white/80 mb-10 text-lg max-w-2xl mx-auto relative z-10 font-medium">
              Join thousands of users and businesses in building a more connected and trusted local marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <a href="/search" className="bg-white text-[#ff0000] px-10 py-4 rounded-full font-black hover:bg-slate-50 transition-colors shadow-lg">Start Discovering</a>
              <a href="/list-your-shop" className="bg-slate-900/20 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-full font-black hover:bg-white/10 transition-colors">List Your Business</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
