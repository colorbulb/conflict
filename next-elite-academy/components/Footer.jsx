import React from 'react';
import { Lock } from 'lucide-react';

export const Footer = ({ onNavigate, settings }) => {
  return (
    <footer className="bg-secondary text-slate-400 py-16 border-t border-slate-800 z-10 relative">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <h3 className="text-white text-2xl font-bold tracking-tight mb-6">NEXUS<span className="text-primary">ELITE</span></h3>
          <p className="text-sm leading-relaxed mb-6">
            Empowering the next generation of leaders through rigorous training in Logic, Debate, and Artificial Intelligence.
          </p>
          <div className="flex gap-4">
            {settings.facebookUrl && <a href={settings.facebookUrl} className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center hover:bg-primary hover:text-white transition cursor-pointer">FB</a>}
            {settings.instagramUrl && <a href={settings.instagramUrl} className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center hover:bg-primary hover:text-white transition cursor-pointer">IG</a>}
            {settings.linkedinUrl && <a href={settings.linkedinUrl} className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center hover:bg-primary hover:text-white transition cursor-pointer">LI</a>}
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Navigation</h4>
          <ul className="space-y-3 text-sm">
            <li><button onClick={() => onNavigate('home')} className="hover:text-white transition">Home</button></li>
            <li><button onClick={() => onNavigate('about')} className="hover:text-white transition">About Us</button></li>
            <li><button onClick={() => onNavigate('courses')} className="hover:text-white transition">Our Courses</button></li>
            <li><button onClick={() => onNavigate('blog')} className="hover:text-white transition">Blog & Insights</button></li>
            <li><button onClick={() => onNavigate('contact')} className="hover:text-white transition">Contact Us</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Programs</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Logic & Reasoning</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Competitive Debate</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Advanced English</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> AI & Python</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6">Admissions</h4>
          <address className="not-italic text-sm space-y-4">
            <p>123 Innovation Blvd, Suite 400<br/>Tech City, CA 94025</p>
            <p className="text-white font-medium">{settings.email}</p>
            <p className="text-white font-medium">{settings.phone}</p>
          </address>
          
          <div className="mt-8">
             <button 
               onClick={() => onNavigate('admin')} 
               className="flex items-center gap-2 text-xs text-slate-600 hover:text-white transition"
             >
               <Lock size={12} /> Staff / Admin Portal
             </button>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-600">
        &copy; {new Date().getFullYear()} Nexus Elite Academy. All rights reserved.
      </div>
    </footer>
  );
};