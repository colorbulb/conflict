import React, { useState } from 'react';
import { Menu, X, Facebook, Twitter, Instagram, Linkedin, GraduationCap, Lock } from 'lucide-react';

export const Header = ({ currentPage, onNavigate, settings }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', value: 'home' },
    { label: 'About', value: 'about' },
    { label: 'Courses', value: 'courses' },
    { label: 'Blog', value: 'blog' },
    { label: 'Contact', value: 'contact' },
  ];

  const handleNavClick = (page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      {/* Top Bar for Socials */}
      <div className="bg-secondary text-slate-400 py-2 text-xs font-medium tracking-wide">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span className="hidden sm:block">Building the Minds of Tomorrow</span>
          <div className="flex gap-4 items-center ml-auto">
            {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-white transition"><Facebook size={14} /></a>}
            {settings.twitterUrl && <a href={settings.twitterUrl} target="_blank" rel="noreferrer" className="hover:text-white transition"><Twitter size={14} /></a>}
            {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-white transition"><Instagram size={14} /></a>}
            {settings.linkedinUrl && <a href={settings.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-white transition"><Linkedin size={14} /></a>}
            <button onClick={() => onNavigate('admin')} className="ml-2 text-slate-500 hover:text-white" title="Admin Login">
              <Lock size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition duration-300">
              <GraduationCap size={24} />
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tighter text-slate-900">
              NEXUS<span className="text-primary">ELITE</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                className={`text-sm font-bold uppercase tracking-wide transition-all duration-200 ${
                  currentPage === item.value || (currentPage === 'blog-post' && item.value === 'blog')
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('enroll')}
              className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5"
            >
              Enroll Now
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-slate-900 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full left-0 shadow-2xl h-screen z-40">
          <div className="flex flex-col p-6 gap-6">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => handleNavClick(item.value)}
                className={`text-left text-xl font-bold p-2 rounded ${
                  currentPage === item.value ? 'text-primary pl-4 border-l-4 border-primary' : 'text-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('enroll')}
              className="bg-primary text-white py-4 rounded-xl font-bold text-lg text-center mt-4 shadow-xl"
            >
              Enroll Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};