import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

export const Contact = ({ onSubmitLead, settings, content }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitLead) {
      onSubmitLead({
        type: 'contact',
        ...formData
      });
    }
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{content.title}</h1>
          <p className="text-slate-600 text-lg">{content.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="bg-secondary rounded-2xl p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
             {/* Decorative circles */}
             <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary opacity-20 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-accent opacity-10 rounded-full blur-3xl"></div>

            <div>
                <h2 className="text-2xl font-bold mb-10 border-b border-slate-700 pb-6">Contact Information</h2>
                
                <div className="space-y-10 relative z-10">
                <div className="flex items-start group">
                    <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mr-6 group-hover:bg-primary transition duration-300">
                        <MapPin size={24} className="text-white" />
                    </div>
                    <div>
                    <h3 className="font-bold text-lg mb-1">Visit Campus</h3>
                    <p className="text-slate-400">123 Innovation Blvd, Suite 400</p>
                    <p className="text-slate-400">Tech City, CA 94025</p>
                    </div>
                </div>

                <div className="flex items-start group">
                    <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mr-6 group-hover:bg-primary transition duration-300">
                        <Mail size={24} className="text-white" />
                    </div>
                    <div>
                    <h3 className="font-bold text-lg mb-1">Email Us</h3>
                    <p className="text-slate-400">{settings.email}</p>
                    </div>
                </div>

                <div className="flex items-start group">
                    <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mr-6 group-hover:bg-primary transition duration-300">
                        <Phone size={24} className="text-white" />
                    </div>
                    <div>
                    <h3 className="font-bold text-lg mb-1">Call Us</h3>
                    <p className="text-slate-400">{settings.phone}</p>
                    <p className="text-slate-500 text-sm mt-1">Mon-Fri from 8am to 6pm PST</p>
                    </div>
                </div>
                </div>
            </div>

            {/* Fake Map Placeholder */}
            <div className="mt-12 h-48 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 overflow-hidden relative group">
              <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=37.7749,-122.4194&zoom=13&size=600x300&sensor=false')] bg-cover opacity-50 grayscale group-hover:grayscale-0 transition duration-500"></div>
              <span className="text-white font-bold relative z-10 bg-black/50 px-4 py-2 rounded backdrop-blur">View on Google Maps</span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-10">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <Send size={40} />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Message Sent</h3>
                <p className="text-slate-600 text-lg mb-8 max-w-sm">
                  Thank you for reaching out. A member of our admissions team will contact you within 24 hours.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-primary font-bold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Send a Message</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Subject</label>
                  <input 
                    type="text" 
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="Course Inquiry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Message</label>
                  <textarea 
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition shadow-lg flex items-center justify-center gap-2"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
