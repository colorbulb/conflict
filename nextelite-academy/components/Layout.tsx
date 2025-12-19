import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from '../types';
import { useLanguage } from './LanguageContext';
import ChatWidget from './ChatWidget';
import { Menu, X, Globe, UserCog } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  trialSettings: any;
  logoUrl?: string;
  onBookingClick: () => void;
  onAdminClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, trialSettings, logoUrl, onBookingClick, onAdminClick }) => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: t.nav[Section.COURSES], path: '/courses' },
    { label: t.nav[Section.BLOG], path: '/blog' },
    { label: t.nav[Section.INSTRUCTORS], path: '/instructors' },
    { label: t.nav[Section.GALLERY], path: '/gallery' },
    { label: t.nav[Section.ABOUT], path: '/about' },
    { label: t.nav[Section.CONTACT], path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="fixed w-full z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link 
              to="/"
              className="flex-shrink-0 flex items-center gap-3 group"
            >
              {logoUrl && (
                <img 
                  src={logoUrl} 
                  alt="NextElite Academy Logo" 
                  className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <span className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-orange to-brand-blue group-hover:scale-105 transition-transform duration-300 inline-block">
                NextElite Academy
              </span>
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6 items-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className="text-gray-800 hover:text-brand-blue font-semibold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Language Switcher */}
              <button 
                onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                className="flex items-center space-x-1 text-gray-700 hover:text-brand-blue border border-gray-300 rounded-full px-3 py-1 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-bold uppercase">{language}</span>
              </button>

              {trialSettings.enabled ? (
                <button 
                  onClick={onBookingClick}
                  className="bg-brand-blue text-white px-6 py-2 rounded-full font-bold hover:bg-brand-purple transition-all hover:scale-105 shadow-md hover:shadow-lg"
                >
                  {t.nav.enroll}
                </button>
              ) : (
                <button disabled className="bg-gray-300 text-white px-6 py-2 rounded-full font-bold cursor-not-allowed">
                   Full
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
               <button 
                onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                className="flex items-center space-x-1 text-gray-700 border border-gray-300 rounded-full px-3 py-1"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-bold uppercase">{language}</span>
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-b border-gray-100 shadow-xl overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3 flex flex-col items-center">
                {navLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className="block px-3 py-3 rounded-md text-base font-medium text-gray-800 hover:text-brand-blue hover:bg-gray-50 w-full text-center active:bg-gray-100"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      {children}

      {/* Footer */}
      <footer className="bg-brand-purple text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-3xl font-display font-bold text-white mb-4 block">NextElite Academy</span>
          <p className="mb-8 max-w-lg mx-auto text-gray-400">{t.footer.desc}</p>
          <div className="flex justify-center space-x-6 mb-8 text-sm font-semibold">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <button onClick={onAdminClick} className="hover:text-white transition-colors flex items-center gap-1">
                 <UserCog className="w-3 h-3" /> {t.footer.admin}
              </button>
          </div>
          <p className="text-sm">{t.footer.rights}</p>
        </div>
      </footer>

      {/* AI Chatbot Widget */}
      <ChatWidget />
    </div>
  );
};

export default Layout;

