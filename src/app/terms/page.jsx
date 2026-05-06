import React from 'react';

export const metadata = {
  title: 'Terms of Service | Local Discovery - Rules for Our Community',
  description: 'Understand the terms and conditions for using Local Discovery. Learn about shop listing rules, user responsibilities, and our commitment to a trusted local marketplace.',
  keywords: 'terms of service, local discovery rules, user agreement, shop listing terms',
};

export default function TermsPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen font-['Inter',sans-serif]">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden bg-[#0f172a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff8938]/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
            Terms of <span className="text-[#ff8938]">Service</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base uppercase tracking-widest font-bold">
            Effective Date: May 2026
          </p>
        </div>
      </section>

      <section className="py-20 max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 md:p-16 border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full translate-x-1/2 -translate-y-1/2 opacity-50"></div>
          
          <article className="prose prose-slate max-w-none space-y-12">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">1</span>
                Acceptance of Terms
              </h2>
              <p className="text-slate-600 leading-relaxed">
                By accessing and using <strong>Local Discovery</strong>, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our application.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">2</span>
                User Responsibilities
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">Users of our platform agree to:</p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Provide accurate and truthful information during registration.</li>
                <li>Submit honest reviews and photos based on real experiences.</li>
                <li>Refrain from using the platform for any illegal or fraudulent activities.</li>
                <li>Respect the privacy and intellectual property of other community members.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">3</span>
                Shop Listings & AI Trust
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Shop owners are responsible for the accuracy of their listings. Local Discovery uses a proprietary <strong>AI-Trust System</strong> to verify listings and assign trust scores. We reserve the right to remove or downgrade any listing that fails our verification process or receives consistent negative community feedback.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">4</span>
                Intellectual Property
              </h2>
              <p className="text-slate-600 leading-relaxed">
                The content on Local Discovery, including our logo, discovery algorithms, and platform design, is the property of Local Discovery and is protected by copyright and trademark laws. User-contributed content (reviews/photos) remains the property of the user, but by posting, you grant us a license to display it on our platform.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">5</span>
                Limitation of Liability
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Local Discovery is a discovery platform and does not guarantee the quality or safety of products/services provided by local shops. We are not liable for any disputes, damages, or losses resulting from your interactions with businesses found through our app.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">6</span>
                Termination
              </h2>
              <p className="text-slate-600 leading-relaxed">
                We reserve the right to terminate or suspend access to our platform immediately, without prior notice, for any user who violates these Terms of Service.
              </p>
            </section>

            <div className="mt-16 p-8 bg-slate-900 rounded-3xl text-center">
              <h3 className="text-white font-bold mb-4">Questions about our terms?</h3>
              <a href="/contact" className="inline-block bg-[#ff8938] text-white px-8 py-3 rounded-xl font-black hover:scale-105 transition-transform shadow-lg">Contact Support</a>
            </div>

          </article>
        </div>
      </section>
    </div>
  );
}
