import React from 'react';
import { Page } from '../types';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-secondary text-slate-300 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <h3 className="text-white text-xl font-bold mb-4">Nexus Academy</h3>
          <p className="text-sm leading-relaxed">
            Cultivating critical thinkers and innovators for tomorrow's challenges through Logic, Debate, and Artificial Intelligence.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => onNavigate('home')} className="hover:text-primary transition">Home</button></li>
            <li><button onClick={() => onNavigate('about')} className="hover:text-primary transition">About Us</button></li>
            <li><button onClick={() => onNavigate('courses')} className="hover:text-primary transition">Our Courses</button></li>
            <li><button onClick={() => onNavigate('blog')} className="hover:text-primary transition">Blog & News</button></li>
            <li><button onClick={() => onNavigate('contact')} className="hover:text-primary transition">Contact</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Courses</h4>
          <ul className="space-y-2 text-sm">
            <li>Logic & Reasoning</li>
            <li>Competitive Debate</li>
            <li>Advanced English</li>
            <li>AI & Programming</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Contact Us</h4>
          <address className="not-italic text-sm space-y-2">
            <p>123 Education Lane</p>
            <p>Innovation City, ST 90210</p>
            <p className="mt-2">Phone: (555) 123-4567</p>
            <p>Email: info@nexusacademy.edu</p>
          </address>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-10 pt-6 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Nexus Academy. All rights reserved.
      </div>
    </footer>
  );
};