import React from 'react';
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact Local Discovery | We are Here to Help You',
  description: 'Have a question about a local shop or need support with your listing? Contact the Local Discovery team today. We are committed to empowering our community.',
  keywords: 'contact local discovery, support, business inquiry, local shop help',
};

export default function ContactPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen font-['Inter',sans-serif]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-[#0f172a]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff8938]/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 font-['Plus_Jakarta_Sans',sans-serif] tracking-tight">
            Let's <span className="text-[#ff8938]">Connect</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Have a question, feedback, or a business inquiry? Our team is here to ensure your local discovery experience is seamless and rewarding.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Sidebar */}
          <div className="space-y-8">
            <div className="p-8 bg-white rounded-[2rem] shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#ff8938] mb-6">
                <i className="fa-solid fa-envelope-open-text text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">General Support</h3>
              <p className="text-sm text-slate-500 mb-4">Have a question about a shop or your account?</p>
              <p className="text-[#ff8938] font-bold">Use the secure form below</p>
            </div>

            <div className="p-8 bg-white rounded-[2rem] shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <i className="fa-solid fa-briefcase text-xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Partnerships</h3>
              <p className="text-sm text-slate-500 mb-4">Looking to grow your business with us?</p>
              <p className="text-blue-600 font-bold">Submit a business inquiry below</p>
            </div>

            <div className="p-8 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff8938]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
               <h3 className="text-xl font-bold mb-4 relative z-10">Follow Our Journey</h3>
               <div className="flex gap-4 relative z-10">
                 <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#ff8938] transition-colors"><i className="fa-brands fa-x-twitter"></i></a>
                 <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#ff8938] transition-colors"><i className="fa-brands fa-instagram"></i></a>
                 <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#ff8938] transition-colors"><i className="fa-brands fa-linkedin-in"></i></a>
               </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
               <div className="mb-10">
                 <h2 className="text-3xl font-black text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] mb-4">Send us a Message</h2>
                 <p className="text-slate-500 text-sm">We typically respond within 24-48 business hours.</p>
               </div>
               
               <ContactForm />

            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-12 font-['Plus_Jakarta_Sans',sans-serif]">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="p-6 bg-white rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-2">How do I list my shop?</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Simply click on "List Your Business" in the footer and follow the intuitive 3-step verification process.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-2">Is Local Discovery free?</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Searching and discovering is 100% free. Basic business listings are also currently free for a limited time!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
