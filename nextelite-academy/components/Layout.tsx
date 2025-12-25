import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, MenuItem } from '../types';
import { useLanguage } from './LanguageContext';
import ChatWidget from './ChatWidget';
import { Menu, X, Globe, UserCog, ChevronDown } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  trialSettings: any;
  logoUrl?: string;
  menuItems?: MenuItem[];
  onBookingClick: () => void;
  onAdminClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, trialSettings, logoUrl, menuItems = [], onBookingClick, onAdminClick }) => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  
  // Get breakpoint from settings, default to 'md'
  const breakpoint = trialSettings?.menuBreakpoint || 'md';
  
  // Generate responsive classes based on breakpoint
  const desktopClass = `hidden ${breakpoint}:flex`;
  const mobileClass = breakpoint === 'sm' ? 'flex' : breakpoint === 'md' ? 'md:hidden' : breakpoint === 'lg' ? 'lg:hidden' : 'xl:hidden';

  // Build menu structure from menuItems or fallback to default
  const navLinks = useMemo(() => {
    if (menuItems && menuItems.length > 0) {
      // Filter visible items and sort by order
      const visibleItems = menuItems
        .filter(item => item.visible)
        .sort((a, b) => a.order - b.order);
      
      // Build hierarchy
      const buildMenuTree = (items: MenuItem[]): MenuItem[] => {
        const parentMap = new Map<string, MenuItem>();
        const rootItems: MenuItem[] = [];
        
        items.forEach(item => {
          const menuItem: MenuItem = { ...item, children: [] };
          parentMap.set(item.id, menuItem);
          
          if (item.parentId) {
            const parent = parentMap.get(item.parentId);
            if (parent) {
              if (!parent.children) parent.children = [];
              parent.children.push(menuItem);
            }
          } else {
            rootItems.push(menuItem);
          }
        });
        
        return rootItems.sort((a, b) => a.order - b.order);
      };
      
      return buildMenuTree(visibleItems);
    }
    
    // Fallback to default menu
    return [
      { id: 'courses', label: t.nav[Section.COURSES], path: '/courses', type: 'custom' as const, target: '/courses', order: 0, visible: true },
      { id: 'blog', label: t.nav[Section.BLOG], path: '/blog', type: 'custom' as const, target: '/blog', order: 1, visible: true },
      { id: 'instructors', label: t.nav[Section.INSTRUCTORS], path: '/instructors', type: 'custom' as const, target: '/instructors', order: 2, visible: true },
      { id: 'gallery', label: t.nav[Section.GALLERY], path: '/gallery', type: 'custom' as const, target: '/gallery', order: 3, visible: true },
      { id: 'about', label: t.nav[Section.ABOUT], path: '/about', type: 'custom' as const, target: '/about', order: 4, visible: true },
      { id: 'contact', label: t.nav[Section.CONTACT], path: '/contact', type: 'custom' as const, target: '/contact', order: 5, visible: true },
    ];
  }, [menuItems, t]);

  const getMenuPath = (item: MenuItem): string => {
    if (item.type === 'link') return item.target;
    if (item.type === 'page') return `/${item.target}`;
    return item.target; // custom route
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setOpenSubmenu(null);
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
              {navLinks.map((item) => {
                const hasSubmenu = item.children && item.children.length > 0;
                const path = getMenuPath(item);
                
                const handleMouseEnter = () => {
                  if (closeTimeout) {
                    clearTimeout(closeTimeout);
                    setCloseTimeout(null);
                  }
                  if (hasSubmenu) {
                    setOpenSubmenu(item.id);
                  }
                };
                
                const handleMouseLeave = () => {
                  const timeout = setTimeout(() => {
                    setOpenSubmenu(null);
                  }, 200); // 200ms delay before closing
                  setCloseTimeout(timeout);
                };
                
                return (
                  <div
                    key={item.id}
                    className="relative group"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {hasSubmenu ? (
                      <button className="text-gray-800 hover:text-brand-blue font-semibold transition-colors flex items-center gap-1">
                        {item.label}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    ) : (
                      <Link
                        to={path}
                        className="text-gray-800 hover:text-brand-blue font-semibold transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                    {/* Submenu Dropdown */}
                    {hasSubmenu && openSubmenu === item.id && (
                      <div
                        className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                      >
                        {item.children!.map((child) => (
                          <Link
                            key={child.id}
                            to={getMenuPath(child)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-blue transition-colors"
                            onClick={() => {
                              setOpenSubmenu(null);
                              if (closeTimeout) {
                                clearTimeout(closeTimeout);
                                setCloseTimeout(null);
                              }
                            }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              
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
                {navLinks.map((item) => {
                  const hasSubmenu = item.children && item.children.length > 0;
                  const path = getMenuPath(item);
                  const isSubmenuOpen = openSubmenu === item.id;
                  
                  return (
                    <div key={item.id} className="w-full">
                      <button
                        onClick={() => {
                          if (hasSubmenu) {
                            setOpenSubmenu(isSubmenuOpen ? null : item.id);
                          } else {
                            handleNavClick(path);
                          }
                        }}
                        className="block px-3 py-3 rounded-md text-base font-medium text-gray-800 hover:text-brand-blue hover:bg-gray-50 w-full text-center active:bg-gray-100 flex items-center justify-center gap-2"
                      >
                        {item.label}
                        {hasSubmenu && (
                          <ChevronDown className={`w-4 h-4 transition-transform ${isSubmenuOpen ? 'rotate-180' : ''}`} />
                        )}
                      </button>
                      
                      {/* Mobile Submenu */}
                      {hasSubmenu && isSubmenuOpen && (
                        <div className="pl-4 space-y-1 mt-1">
                          {item.children!.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => handleNavClick(getMenuPath(child))}
                              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-brand-blue hover:bg-gray-50 w-full text-left"
                            >
                              {child.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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

