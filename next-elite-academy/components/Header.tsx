import React, { useState } from 'react';
import { Page } from '../types';
import { Menu, X, Facebook, Twitter, Instagram, Linkedin, GraduationCap } from 'lucide-react';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: { label: string; value: Page }[] = [
    { label: 'Home', value: 'home' },
    { label: 'About Us', value: 'about' },
    { label: 'Courses', value: 'courses' },
    { label: 'Blog', value: 'blog' },
    { label: 'Contact', value: 'contact' },
  ];

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar for Socials */}
      <div className="bg-secondary text-slate-300 py-2 text-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span className="hidden sm:block">Empowering Future Leaders in Logic & AI</span>
          <div className="flex gap-4 items-center ml-auto">
            <a href="#" className="hover:text-white transition"><Facebook size={16} /></a>
            <a href="#" className="hover:text-white transition"><Twitter size={16} /></a>
            <a href="#" className="hover:text-white transition"><Instagram size={16} /></a>
            <a href="#" className="hover:text-white transition"><Linkedin size={16} /></a>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer text-primary hover:opacity-90 transition"
            onClick={() => onNavigate('home')}
          >
            <GraduationCap size={32} />
            <span className="text-2xl font-bold tracking-tight text-slate-900">Nexus<span className="text-primary">Academy</span></span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  currentPage === item.value || (currentPage === 'blog-post' && item.value === 'blog')
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-slate-600 hover:text-primary'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('enroll')}
              className="bg-primary text-white px-5 py-2 rounded-full font-semibold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Enroll Now
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-slate-700 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full left-0 shadow-lg">
          <div className="flex flex-col p-4 gap-4">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                className={`text-left text-lg font-medium p-2 rounded ${
                  currentPage === item.value ? 'bg-indigo-50 text-primary' : 'text-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('enroll')}
              className="bg-primary text-white py-3 rounded-lg font-bold text-center mt-2"
            >
              Enroll Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};