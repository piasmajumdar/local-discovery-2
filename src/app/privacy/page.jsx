import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Local Discovery - Your Data Security is Our Priority',
  description: 'Read the Local Discovery Privacy Policy to understand how we collect, use, and protect your data while you explore the best local shops and products.',
  keywords: 'privacy policy, data security, local discovery terms, secure business listings',
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen font-['Inter',sans-serif]">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden bg-[#0f172a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff8938]/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
            Privacy <span className="text-[#ff8938]">Policy</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base uppercase tracking-widest font-bold">
            Last Updated: May 2026
          </p>
        </div>
      </section>

      <section className="py-20 max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 md:p-16 border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full translate-x-1/2 -translate-y-1/2"></div>
          
          <article className="prose prose-slate max-w-none space-y-12">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-orange-100 text-[#ff8938] rounded-lg flex items-center justify-center text-sm">1</span>
                Introduction
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Welcome to <strong>Local Discovery</strong>. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website and use our local marketplace services.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-orange-100 text-[#ff8938] rounded-lg flex items-center justify-center text-sm">2</span>
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2">Personal Information</h4>
                  <p className="text-sm text-slate-500">When you register, we collect your name, email address, and account credentials to provide a personalized experience.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2">Shop & Review Data</h4>
                  <p className="text-sm text-slate-500">We store the shop details you list and the reviews/photos you contribute to build our community-driven trust system.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2">Location Data</h4>
                  <p className="text-sm text-slate-500">To show you "nearby" shops, we process your approximate location data with your explicit consent.</p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-orange-100 text-[#ff8938] rounded-lg flex items-center justify-center text-sm">3</span>
                How We Use Your Data
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">Your information helps us maintain a secure and reliable marketplace:</p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>To verify shop listings through our AI-trust algorithm.</li>
                <li>To facilitate communication between community members.</li>
                <li>To protect our platform from bots and fraudulent activity.</li>
                <li>To improve our "trivial item" discovery engine.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-orange-100 text-[#ff8938] rounded-lg flex items-center justify-center text-sm">4</span>
                Data Security
              </h2>
              <p className="text-slate-600 leading-relaxed">
                We implement industry-standard security measures, including the <strong>Anti-Spam Fortress</strong> for communications and encrypted database storage, to prevent unauthorized access, disclosure, or alteration of your personal data.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                <span className="w-8 h-8 bg-orange-100 text-[#ff8938] rounded-lg flex items-center justify-center text-sm">5</span>
                Your Rights
              </h2>
              <p className="text-slate-600 leading-relaxed">
                You have the right to access, update, or request the deletion of your personal information at any time. You can manage your profile settings directly through your dashboard or contact our support team for assistance.
              </p>
            </section>

            <div className="mt-16 p-8 bg-slate-900 rounded-3xl text-center">
              <h3 className="text-white font-bold mb-4">Have questions about our Privacy Policy?</h3>
              <a href="/contact" className="inline-block bg-[#ff8938] text-white px-8 py-3 rounded-xl font-black hover:scale-105 transition-transform shadow-lg">Contact Legal Team</a>
            </div>

          </article>
        </div>
      </section>
    </div>
  );
}
