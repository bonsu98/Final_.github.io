import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, ShieldCheck, Send } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Retrieve customized contact information dynamically
  const contactTitle = localStorage.getItem('peps_contact_title') || 'Contact Us';
  const contactDescription = localStorage.getItem('peps_contact_description') || 'For any questions, product inquiries, or support regarding peptides, feel free to contact us for prompt assistance.';
  const contactAddress = localStorage.getItem('peps_contact_address') || '17 South Terrace, Cowell, SA 5602';
  const contactEmail = localStorage.getItem('peps_order_email') || 'mail@buyswisspeptides.shop';
  const contactPhone = localStorage.getItem('peps_contact_phone') || '+61 488 856 783';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const existing = localStorage.getItem('peps_contact_submissions');
      const list = existing ? JSON.parse(existing) : [];
      const newSubmission = {
        id: `contact-${Date.now()}`,
        name,
        email,
        subject,
        message,
        date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'Unread'
      };
      localStorage.setItem('peps_contact_submissions', JSON.stringify([newSubmission, ...list]));
    } catch (err) {
      console.error('Failed to save contact submission', err);
    }

    // Dispatch to Web3Forms
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: "65a272b7-f7b7-40e5-819b-7fa733cdc5ac",
        name,
        email,
        subject,
        message,
        from_name: "Swiss Peptides System"
      })
    })
    .then(async (response) => {
      const json = await response.json();
      if (response.status === 200) {
        console.log('Web3Forms success:', json.message);
      } else {
        console.error('Web3Forms error:', json.message);
      }
    })
    .catch(err => {
      console.error('Failed to dispatch contact email to Web3Forms:', err);
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 3000);
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen">
      {/* SECTION 1: Parallax Hero Banner */}
      <div 
        className="relative h-[480px] w-full flex items-center justify-center bg-fixed bg-cover bg-center overflow-hidden"
        style={{ 
          backgroundImage: "url('/src/assets/images/contact_us_bg_1780051503388.png')",
        }}
      >
        {/* Dark overlay matching the uploaded reference image perfectly */}
        <div className="absolute inset-0 bg-[#0E1B2C]/65 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 
            style={{ fontSize: '65px' }}
            className="font-montserrat font-bold text-white tracking-tight leading-none text-center select-none"
          >
            {contactTitle}
          </h1>
        </div>
      </div>

      {/* SECTION 2: Replicating User Mockup Layout with Dual Column Info and Form */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-20 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Contact Us Text and Details */}
          <div className="space-y-8">
            <div className="space-y-4 font-sans text-left">
              <h2 className="text-4xl font-extrabold text-[#0B1E33] tracking-tight">
                {contactTitle}
              </h2>
              <p className="text-[14px] text-[#4A5568] leading-relaxed max-w-sm">
                {contactDescription}
              </p>
            </div>

            {/* List of Coordinates with Custom Styling matching the mockup */}
            <div className="space-y-5 pt-4 text-gray-700 font-sans text-left">
              <div className="flex items-center gap-4">
                <div className="text-[#0B1E33] shrink-0">
                  <MapPin className="w-[18px] h-[18px]" />
                </div>
                <span className="text-[14px] font-normal text-gray-600 leading-snug">
                  {contactAddress}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-[#0B1E33] shrink-0">
                  <Mail className="w-[18px] h-[18px]" />
                </div>
                <span className="text-[14px] font-normal text-gray-600 leading-snug select-all">
                  {contactEmail}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-[#0B1E33] shrink-0">
                  <Phone className="w-[18px] h-[18px]" />
                </div>
                <span className="text-[14px] font-normal text-gray-600 leading-snug">
                  {contactPhone}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Submission Form matching mockup styling */}
          <div className="font-sans">
            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-lg text-center space-y-3">
                <span className="text-3xl inline-block">📬</span>
                <h4 className="font-bold text-emerald-950">Message Sent Successfully</h4>
                <p className="text-xs text-emerald-600 max-w-md mx-auto leading-relaxed">
                  Thank you for contacting us. We will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Your Name */}
                <div className="space-y-1.5">
                  <label className="text-[14px] font-semibold text-gray-800">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#DE5246] focus:border-[#DE5246] transition-all"
                    placeholder=""
                  />
                </div>

                {/* Your Email */}
                <div className="space-y-1.5">
                  <label className="text-[14px] font-semibold text-gray-800">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#DE5246] focus:border-[#DE5246] transition-all"
                    placeholder=""
                  />
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-[14px] font-semibold text-gray-800">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#DE5246] focus:border-[#DE5246] transition-all"
                    placeholder=""
                  />
                </div>

                {/* Your Message */}
                <div className="space-y-1.5">
                  <label className="text-[14px] font-semibold text-gray-800">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#DE5246] focus:border-[#DE5246] transition-all resize-none"
                    placeholder=""
                  />
                </div>

                {/* Submit button precisely matching exact prompt color block and rounding */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#DE5246] hover:bg-[#C13D32] text-white text-[12px] font-bold tracking-widest uppercase rounded-md transition-colors cursor-pointer active:scale-98 shadow-sm"
                  >
                    SEND MESSAGE
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
