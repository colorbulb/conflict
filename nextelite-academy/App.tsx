import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, useParams, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Section, Course, AppData, ThemeColors, TrialSettings, Submission, BlogPost, Instructor, CustomPage, MenuItem } from './types';
import { INITIAL_DATA, ICONS } from './constants';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { translations as initialTranslations } from './translations';
import { 
  getAppData,
  saveThemeColors,
  saveTrialSettings,
  getTranslations,
  saveTranslations,
  savePageContent,
  getLookupLists,
  saveLookupLists,
  saveCourse,
  saveBlogPost,
  saveInstructor,
  saveCustomPages,
  saveMenuItems
} from './firebase/db.js';
import FloatingShape from './components/FloatingShape';
import CourseCard from './components/CourseCard';
import CourseDetail from './components/CourseDetail';
import ContactForm from './components/ContactForm';
import AdminLogin from './components/AdminLogin';
import CMSDashboard from './components/CMSDashboard';
import BookingModal from './components/BookingModal';
import BlogList from './components/BlogList';
import BlogPostDetail from './components/BlogPostDetail';
import Layout from './components/Layout';

interface AppContentProps {
  translations: typeof initialTranslations;
  onUpdateTranslations: (translations: typeof initialTranslations) => void;
}

const AppContent: React.FC<AppContentProps> = ({ translations, onUpdateTranslations }) => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for the application data - loaded from Firestore
  const [db, setDb] = useState<{ en: AppData; zh: AppData }>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(true);
  
  // Admin State - Check localStorage for persistent session
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('adminLoggedIn') === 'true';
  });
  const isAdminRoute = location.pathname.startsWith('/adminbn');
  
  // Persist login state to localStorage
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('adminLoggedIn', 'true');
    } else {
      localStorage.removeItem('adminLoggedIn');
    }
  }, [isLoggedIn]);

  // Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Load data from Firestore on mount and when language changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [enData, zhData] = await Promise.all([
          getAppData('en'),
          getAppData('zh')
        ]);

        // Normalize courses: ensure ageGroup is array and icon is string
        const normalizeCourses = (courses: any[]) => {
          if (!courses || !Array.isArray(courses)) return [];
          return courses.map(course => ({
            ...course,
            ageGroup: Array.isArray(course.ageGroup) ? course.ageGroup : (course.ageGroup ? [course.ageGroup] : []),
            icon: typeof course.icon === 'string' ? course.icon : 'coding'
          }));
        };
        
        // Always merge with existing data, never completely replace
        setDb(prev => ({
          en: {
            courses: normalizeCourses(enData?.courses || prev.en.courses || []),
            instructors: enData?.instructors || prev.en.instructors || [],
            blogPosts: enData?.blogPosts || prev.en.blogPosts || [],
            themeColors: (enData?.themeColors && Object.keys(enData.themeColors).length)
              ? enData.themeColors
              : (prev.en.themeColors || INITIAL_DATA.en.themeColors),
            trialSettings: (enData?.trialSettings && Object.keys(enData.trialSettings).length)
              ? enData.trialSettings
              : (prev.en.trialSettings || INITIAL_DATA.en.trialSettings),
            submissions: enData?.submissions || prev.en.submissions || [],
            pageContent: enData?.pageContent || prev.en.pageContent || INITIAL_DATA.en.pageContent,
            lookupLists: enData?.lookupLists || prev.en.lookupLists || INITIAL_DATA.en.lookupLists,
            customPages: enData?.customPages || prev.en.customPages || [],
            menuItems: enData?.menuItems || prev.en.menuItems || []
          },
          zh: {
            courses: normalizeCourses(zhData?.courses || prev.zh.courses || []),
            instructors: zhData?.instructors || prev.zh.instructors || [],
            blogPosts: zhData?.blogPosts || prev.zh.blogPosts || [],
            themeColors: (zhData?.themeColors && Object.keys(zhData.themeColors).length)
              ? zhData.themeColors
              : (prev.zh.themeColors || INITIAL_DATA.zh.themeColors),
            trialSettings: (zhData?.trialSettings && Object.keys(zhData.trialSettings).length)
              ? zhData.trialSettings
              : (prev.zh.trialSettings || INITIAL_DATA.zh.trialSettings),
            submissions: zhData?.submissions || prev.zh.submissions || [],
            pageContent: zhData?.pageContent || prev.zh.pageContent || INITIAL_DATA.zh.pageContent,
            lookupLists: zhData?.lookupLists || prev.zh.lookupLists || INITIAL_DATA.zh.lookupLists,
            customPages: zhData?.customPages || prev.zh.customPages || [],
            menuItems: zhData?.menuItems || prev.zh.menuItems || []
          }
        }));
      } catch (error) {
        console.error('Error loading data from Firestore:', error);
        // Fallback to INITIAL_DATA if Firestore fails
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [language]); // Reload when language changes

  // Helper to get current data based on language
  const currentData = db[language];

  // Helper to map icon string to ReactNode
  const getCourseWithIcon = (course: Course) => ({
    ...course,
    icon: typeof course.icon === 'string' ? ICONS[course.icon as keyof typeof ICONS] : course.icon
  });

  // Apply Theme Colors to CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    const colors = currentData.themeColors;
    root.style.setProperty('--color-brand-yellow', colors.yellow);
    root.style.setProperty('--color-brand-orange', colors.orange);
    root.style.setProperty('--color-brand-blue', colors.blue);
    root.style.setProperty('--color-brand-green', colors.green);
    root.style.setProperty('--color-brand-purple', colors.purple);
  }, [currentData.themeColors]);

  const handleUpdateCourse = async (course: Course) => {
    try {
      // Persist to Firestore first
      await saveCourse(course, language);
      
      // Then update local state
      setDb(prev => {
          const langData = prev[language];
          const exists = langData.courses.find(c => c.id === course.id);
          const newCourses = exists 
              ? langData.courses.map(c => c.id === course.id ? course : c)
              : [...langData.courses, course];
          
          return {
              ...prev,
              [language]: {
                  ...langData,
                  courses: newCourses
              }
          };
      });
    } catch (err) {
      console.error('Error saving course:', err);
      alert('Error saving course. Please try again.');
    }
  };

  const handleUpdateInstructor = async (instructor: Instructor) => {
    try {
      // Persist to Firestore first
      await saveInstructor(instructor, language);
      
      // Then update local state
      setDb(prev => {
        const langData = prev[language];
        const exists = langData.instructors.find(i => i.id === instructor.id);
        const newInstructors = exists 
            ? langData.instructors.map(i => i.id === instructor.id ? instructor : i)
            : [...langData.instructors, instructor];
        
        return {
            ...prev,
            [language]: {
                ...langData,
                instructors: newInstructors
            }
        };
      });
    } catch (err) {
      console.error('Error saving instructor:', err);
      alert('Error saving instructor. Please try again.');
    }
  };

  const handleUpdateBlog = async (updatedPosts: BlogPost[]) => {
      try {
        // Save all posts to Firestore
        await Promise.all(updatedPosts.map(post => saveBlogPost(post, language)));
        
        // Then update local state
        setDb(prev => ({
            ...prev,
            [language]: {
                ...prev[language],
                blogPosts: updatedPosts
            }
        }));
      } catch (err) {
        console.error('Error saving blog posts:', err);
        alert('Error saving blog posts. Please try again.');
      }
  };

  const handleUpdateTheme = (colors: ThemeColors) => {
      setDb(prev => ({
          en: { ...prev.en, themeColors: colors },
          zh: { ...prev.zh, themeColors: colors }
      }));

      // Persist to Firestore for both languages
      saveThemeColors(colors, 'en').catch(err => console.error('Error saving theme colors (en):', err));
      saveThemeColors(colors, 'zh').catch(err => console.error('Error saving theme colors (zh):', err));
  };

  const handleUpdateTrial = (settings: TrialSettings) => {
      setDb(prev => ({
          en: { ...prev.en, trialSettings: settings },
          zh: { ...prev.zh, trialSettings: settings }
      }));

      // Persist to Firestore for both languages
      saveTrialSettings(settings, 'en').catch(err => console.error('Error saving trial settings (en):', err));
      saveTrialSettings(settings, 'zh').catch(err => console.error('Error saving trial settings (zh):', err));
  };

  const handleUpdatePageContent = (pageContent: typeof INITIAL_DATA.en.pageContent) => {
      setDb(prev => ({
          ...prev,
          [language]: {
              ...prev[language],
              pageContent
          }
      }));

      // Persist homepage content for current language
      savePageContent(pageContent, language).catch(err => console.error('Error saving page content:', err));
  };

  const handleUpdateLookupLists = (lookupLists: typeof INITIAL_DATA.en.lookupLists) => {
      setDb(prev => ({
          ...prev,
          [language]: {
              ...prev[language],
              lookupLists
          }
      }));

      // Persist lookup lists for current language
      saveLookupLists(lookupLists, language).catch(err => console.error('Error saving lookup lists:', err));
  };

  const handleUpdateCustomPages = async (pages: CustomPage[]) => {
      console.log('handleUpdateCustomPages called with', pages.length, 'pages');
      setDb(prev => ({
          ...prev,
          [language]: {
              ...prev[language],
              customPages: pages
          }
      }));

      try {
          await saveCustomPages(pages, language);
          alert('Custom pages saved successfully!');
      } catch (err) {
          console.error('Error saving custom pages:', err);
          alert('Error saving custom pages: ' + (err instanceof Error ? err.message : String(err)));
      }
  };

  const handleUpdateMenuItems = async (items: MenuItem[]) => {
      console.log('handleUpdateMenuItems called with', items.length, 'items');
      setDb(prev => ({
          ...prev,
          [language]: {
              ...prev[language],
              menuItems: items
          }
      }));

      try {
          await saveMenuItems(items, language);
          // Don't show alert for every menu item change (it's called on blur)
      } catch (err) {
          console.error('Error saving menu items:', err);
          alert('Error saving menu items: ' + (err instanceof Error ? err.message : String(err)));
      }
  };

  const handleSubmission = (data: Omit<Submission, 'id' | 'status'>) => {
    const newSubmission: Submission = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: 'new'
    };

    setDb(prev => ({
      en: { ...prev.en, submissions: [newSubmission, ...prev.en.submissions] },
      zh: { ...prev.zh, submissions: [newSubmission, ...prev.zh.submissions] }
    }));
  };

  // Show loading state while fetching from Firestore
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
          <p className="text-gray-900 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // If Admin Mode is active
  if (isAdminRoute) {
      if (!isLoggedIn) {
          return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
      }
      
      // Extract tab from URL (e.g., /adminbn/courses -> 'courses')
      const urlTab = location.pathname.split('/')[2] || 'courses';
      const validTabs = ['courses', 'blog', 'instructors', 'settings', 'inquiries', 'translations', 'homepage', 'lookups', 'pages', 'menu'];
      const initialTab = validTabs.includes(urlTab) ? urlTab as typeof validTabs[number] : 'courses';
      
      return (
          <CMSDashboard 
            courses={currentData.courses} 
            instructors={currentData.instructors}
            blogPosts={currentData.blogPosts}
            themeColors={currentData.themeColors}
            trialSettings={currentData.trialSettings}
            submissions={currentData.submissions}
            translations={translations}
            pageContent={currentData.pageContent || INITIAL_DATA[language].pageContent}
            lookupLists={currentData.lookupLists || INITIAL_DATA[language].lookupLists}
            customPages={currentData.customPages || []}
            menuItems={currentData.menuItems || []}
            onUpdateCourse={handleUpdateCourse}
            onUpdateInstructor={handleUpdateInstructor}
            onUpdateTheme={handleUpdateTheme}
            onUpdateTrial={handleUpdateTrial}
            onUpdateBlog={handleUpdateBlog}
            onUpdateTranslations={onUpdateTranslations}
            onUpdatePageContent={handleUpdatePageContent}
            onUpdateLookupLists={handleUpdateLookupLists}
            onUpdateCustomPages={handleUpdateCustomPages}
            onUpdateMenuItems={handleUpdateMenuItems}
            initialTab={initialTab}
            onLogout={() => { 
              setIsLoggedIn(false);
              localStorage.removeItem('adminLoggedIn');
              navigate('/'); 
            }}
          />
      );
  }

  // Helper function to get background sizing classes and styles (shared across pages)
  const getBackgroundStyles = (section: 'hero' | 'programs' | 'mentors' | 'gallery' | 'contact' | 'about', isVideo: boolean) => {
    const pageContent = currentData.pageContent || INITIAL_DATA[language].pageContent;
    const sizing = pageContent.backgroundSizing?.[section] || 'default';
    
    if (isVideo) {
      switch (sizing) {
        case 'width':
          return { className: 'absolute inset-0 w-full h-auto object-contain opacity-10', style: {} };
        case 'height':
          return { className: 'absolute inset-0 h-full w-auto object-contain opacity-10', style: {} };
        default:
          return { className: 'absolute inset-0 w-full h-full object-cover opacity-10', style: {} };
      }
    } else {
      switch (sizing) {
        case 'width':
          return { 
            className: 'absolute inset-0 opacity-10',
            style: { 
              backgroundSize: '100% auto',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'left center'
            }
          };
        case 'height':
          return { 
            className: 'absolute inset-0 opacity-10',
            style: { 
              backgroundSize: 'auto 100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center top'
            }
          };
        default:
          return { 
            className: 'absolute inset-0 bg-cover bg-center opacity-10',
            style: {}
          };
      }
    }
  };

  // Home Page Component
  const HomePage = () => {
    const pageContent = currentData.pageContent || INITIAL_DATA[language].pageContent;
    
    return (
      <>
        {/* Background Shapes */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <FloatingShape color="bg-brand-yellow" size="400px" top="-100px" left="-100px" delay={0} />
          <FloatingShape color="bg-brand-blue" size="300px" top="40%" left="80%" delay={2} />
          <FloatingShape color="bg-brand-green" size="250px" top="80%" left="10%" delay={4} />
        </div>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 text-center bg-slate-50 overflow-hidden">
          {/* Optional Hero Background (image or video) */}
          {pageContent.backgrounds?.hero && (
            pageContent.backgrounds.hero.toLowerCase().endsWith('.mp4') ? (
              <video
                {...getBackgroundStyles('hero', true)}
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={pageContent.backgrounds.hero} type="video/mp4" />
              </video>
            ) : (
              <div
                {...getBackgroundStyles('hero', false)}
                style={{ ...getBackgroundStyles('hero', false).style, backgroundImage: `url(${pageContent.backgrounds.hero})` }}
              />
            )
          )}

          <div className="max-w-5xl mx-auto relative">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-display font-bold text-gray-900 mb-6 leading-tight"
            >
              {pageContent.hero.titleLine1} <br/>
              <span className="text-brand-orange">{pageContent.hero.titleLine2}</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-900 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              {pageContent.hero.subtitle}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <button 
                onClick={() => navigate('/courses')}
                className="bg-brand-blue text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:bg-brand-purple transition-all transform hover:-translate-y-1"
              >
                {pageContent.hero.exploreButton}
              </button>
              
              {currentData.trialSettings.enabled ? (
                <button 
                  onClick={() => setIsBookingModalOpen(true)}
                  className="bg-white text-brand-orange border-2 border-brand-orange px-8 py-4 rounded-full font-bold text-lg shadow-sm hover:bg-orange-50 transition-all transform hover:-translate-y-1"
                >
                  {pageContent.hero.trialButton}
                </button>
              ) : (
                <button 
                  disabled
                  className="bg-gray-200 text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-full font-bold text-lg cursor-not-allowed"
                >
                  Class Full
                </button>
              )}
            </motion.div>
            
            {currentData.trialSettings.enabled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-6 text-sm font-semibold text-white bg-brand-green inline-block px-4 py-1 rounded-full border border-brand-green/80"
              >
                {currentData.trialSettings.message} ({currentData.trialSettings.slotsAvailable} slots left)
              </motion.div>
            )}
          </div>
        </section>

        {/* Courses Section */}
        <section id={Section.COURSES} className="py-20 relative bg-white overflow-hidden">
          {/* Optional Programs Background */}
          {pageContent.backgrounds?.programs && (
            pageContent.backgrounds.programs.toLowerCase().endsWith('.mp4') ? (
              <video
                {...getBackgroundStyles('programs', true)}
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={pageContent.backgrounds.programs} type="video/mp4" />
              </video>
            ) : (
              <div
                {...getBackgroundStyles('programs', false)}
                style={{ ...getBackgroundStyles('programs', false).style, backgroundImage: `url(${pageContent.backgrounds.programs})` }}
              />
            )
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">{pageContent.sections.programs.heading}</h2>
              <p className="text-gray-900 max-w-2xl mx-auto text-lg">{pageContent.sections.programs.subheading}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentData.courses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={getCourseWithIcon(course)} 
                />
              ))}
            </div>
          </div>
        </section>

        {/* Instructors Section */}
        <section id={Section.INSTRUCTORS} className="py-20 bg-slate-50 relative overflow-hidden">
          {/* Optional Mentors Background */}
          {pageContent.backgrounds?.mentors && (
            pageContent.backgrounds.mentors.toLowerCase().endsWith('.mp4') ? (
              <video
                {...getBackgroundStyles('mentors', true)}
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={pageContent.backgrounds.mentors} type="video/mp4" />
              </video>
            ) : (
              <div
                {...getBackgroundStyles('mentors', false)}
                style={{ ...getBackgroundStyles('mentors', false).style, backgroundImage: `url(${pageContent.backgrounds.mentors})` }}
              />
            )
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">{pageContent.sections.mentors.heading}</h2>
              <p className="text-gray-900 text-lg">{pageContent.sections.mentors.subheading}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {currentData.instructors && currentData.instructors.length > 0 ? (
                currentData.instructors.map((instructor, idx) => (
                  <motion.div 
                    key={instructor.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-8 rounded-3xl shadow-md text-center group hover:shadow-2xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-brand-yellow group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <img src={instructor.imageUrl} alt={instructor.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{instructor.name}</h3>
                    <p className="text-brand-blue font-bold text-sm mb-4 uppercase tracking-wide">{instructor.role}</p>
                    <p className="text-gray-900 leading-relaxed">{instructor.bio}</p>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-gray-500">
                  <p className="text-lg">No instructors available yet.</p>
                  <p className="text-sm mt-2">Add instructors in the CMS to display them here.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id={Section.GALLERY} className="py-20 bg-white relative overflow-hidden">
          {/* Optional Gallery Background */}
          {pageContent.backgrounds?.gallery && (
            pageContent.backgrounds.gallery.toLowerCase().endsWith('.mp4') ? (
              <video
                {...getBackgroundStyles('gallery', true)}
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={pageContent.backgrounds.gallery} type="video/mp4" />
              </video>
            ) : (
              <div
                {...getBackgroundStyles('gallery', false)}
                style={{ ...getBackgroundStyles('gallery', false).style, backgroundImage: `url(${pageContent.backgrounds.gallery})` }}
              />
            )
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">{pageContent.sections.gallery.heading}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(pageContent.galleryImages || []).map((src, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  className="rounded-2xl overflow-hidden h-48 md:h-64 shadow-md cursor-pointer transition-transform duration-300"
                >
                  <img src={src} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id={Section.CONTACT} className="py-20 bg-slate-50 relative overflow-hidden">
          {/* Optional Contact Background */}
          {pageContent.backgrounds?.contact && (
            pageContent.backgrounds.contact.toLowerCase().endsWith('.mp4') ? (
              <video
                {...getBackgroundStyles('contact', true)}
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={pageContent.backgrounds.contact} type="video/mp4" />
              </video>
            ) : (
              <div
                {...getBackgroundStyles('contact', false)}
                style={{ ...getBackgroundStyles('contact', false).style, backgroundImage: `url(${pageContent.backgrounds.contact})` }}
              />
            )
          )}

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
              <div className="p-10 md:w-5/12 bg-brand-blue text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-display font-bold mb-6">{pageContent.sections.contact.heading}</h2>
                  <p className="mb-8 text-blue-100 leading-relaxed">{pageContent.sections.contact.subheading}</p>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-1 bg-brand-yellow h-12 rounded-full opacity-50"></div>
                      <div>
                        <p className="font-bold opacity-80 uppercase text-xs tracking-wider">Address</p>
                        <p className="text-lg">{pageContent.sections.contact.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-1 bg-brand-yellow h-12 rounded-full opacity-50"></div>
                      <div>
                        <p className="font-bold opacity-80 uppercase text-xs tracking-wider">Email</p>
                        <p className="text-lg">{pageContent.sections.contact.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-10 md:w-7/12 bg-white">
                <ContactForm trialSettings={currentData.trialSettings} onSubmit={handleSubmission} />
              </div>
            </div>
          </div>
        </section>
      </>
    );
  };

  // Courses Page Component
  const CoursesPage = () => {
    const pageContent = currentData.pageContent || INITIAL_DATA[language].pageContent;
    
    return (
      <div className="min-h-screen pt-24 pb-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">{pageContent.sections.programs.heading}</h2>
            <p className="text-gray-900 max-w-2xl mx-auto text-lg">{pageContent.sections.programs.subheading}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentData.courses.map((course) => (
              <CourseCard key={course.id} course={getCourseWithIcon(course)} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Course Detail Page Component
  const CourseDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const course = currentData.courses.find(c => c.id === id);
    
    if (!course) {
      return <Navigate to="/courses" replace />;
    }

    return (
      <CourseDetail 
        course={getCourseWithIcon(course)} 
        onBack={() => navigate('/courses')} 
        onEnroll={() => {
          setIsBookingModalOpen(true);
          navigate('/courses');
        }}
      />
    );
  };

  // Blog Page Component
  const BlogPage = () => (
    <BlogList 
      posts={currentData.blogPosts} 
      categories={currentData.lookupLists?.blogCategories || []}
    />
  );

  // Blog Post Detail Page Component
  const BlogPostDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const post = currentData.blogPosts.find(p => p.id === id);
    
    if (!post) {
      return <Navigate to="/blog" replace />;
    }

    return (
      <BlogPostDetail 
        post={post}
        onBack={() => navigate('/blog')}
      />
    );
  };

  // Instructors Page Component
  const InstructorsPage = () => {
    const pageContent = currentData.pageContent || INITIAL_DATA[language].pageContent;
    
    return (
      <div className="min-h-screen pt-24 pb-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">{pageContent.sections.mentors.heading}</h2>
            <p className="text-gray-900 text-lg">{pageContent.sections.mentors.subheading}</p>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {currentData.instructors && currentData.instructors.length > 0 ? (
                currentData.instructors.map((instructor, idx) => (
                  <motion.div 
                    key={instructor.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-8 rounded-3xl shadow-md text-center group hover:shadow-2xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-brand-yellow group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <img src={instructor.imageUrl} alt={instructor.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{instructor.name}</h3>
                    <p className="text-brand-blue font-bold text-sm mb-4 uppercase tracking-wide">{instructor.role}</p>
                    <p className="text-gray-900 leading-relaxed">{instructor.bio}</p>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12 text-gray-500">
                  <p className="text-lg">No instructors available yet.</p>
                  <p className="text-sm mt-2">Add instructors in the CMS to display them here.</p>
                </div>
              )}
            </div>
        </div>
      </div>
    );
  };

  // Gallery Page Component
  const GalleryPage = () => {
    const pageContent = currentData.pageContent || INITIAL_DATA[language].pageContent;
    
    return (
      <div className="min-h-screen pt-24 pb-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">{pageContent.sections.gallery.heading}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(pageContent.galleryImages || []).map((src, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className="rounded-2xl overflow-hidden h-48 md:h-64 shadow-md cursor-pointer transition-transform duration-300"
              >
                <img src={src} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // About Us Page Component
  const AboutPage = () => {
    const pageContent = currentData.pageContent || INITIAL_DATA[language].pageContent;
    const aboutContent = pageContent.about || INITIAL_DATA[language].pageContent.about;
    
    return (
      <div className="min-h-screen pt-24 pb-20 bg-slate-50 relative overflow-hidden">
        {/* Optional About Background */}
        {pageContent.backgrounds?.about && (
          pageContent.backgrounds.about.toLowerCase().endsWith('.mp4') ? (
            <video
              {...getBackgroundStyles('about', true)}
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={pageContent.backgrounds.about} type="video/mp4" />
            </video>
          ) : (
            <div
              {...getBackgroundStyles('about', false)}
              style={{ ...getBackgroundStyles('about', false).style, backgroundImage: `url(${pageContent.backgrounds.about})` }}
            />
          )
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">{aboutContent?.heading}</h2>
            <p className="text-gray-900 text-lg max-w-2xl mx-auto">{aboutContent?.subheading}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {aboutContent?.imageUrl && (
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img 
                  src={aboutContent.imageUrl} 
                  alt="About Us" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className={`bg-white p-8 rounded-3xl shadow-md ${aboutContent?.imageUrl ? '' : 'md:col-span-2'}`}>
              {aboutContent?.content && (
                <div 
                  className="prose prose-lg max-w-none text-gray-800"
                  dangerouslySetInnerHTML={{ __html: aboutContent.content }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Contact Page Component
  const ContactPage = () => {
    const pageContent = currentData.pageContent || INITIAL_DATA[language].pageContent;
    
    return (
      <div className="min-h-screen pt-24 pb-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
            <div className="p-10 md:w-5/12 bg-brand-blue text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-display font-bold mb-6">{pageContent.sections.contact.heading}</h2>
                <p className="mb-8 text-blue-100 leading-relaxed">{pageContent.sections.contact.subheading}</p>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-1 bg-brand-yellow h-12 rounded-full opacity-50"></div>
                    <div>
                      <p className="font-bold opacity-80 uppercase text-xs tracking-wider">Address</p>
                      <p className="text-lg">{pageContent.sections.contact.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-1 bg-brand-yellow h-12 rounded-full opacity-50"></div>
                    <div>
                      <p className="font-bold opacity-80 uppercase text-xs tracking-wider">Email</p>
                      <p className="text-lg">{pageContent.sections.contact.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-10 md:w-7/12 bg-white">
              <ContactForm trialSettings={currentData.trialSettings} onSubmit={handleSubmission} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)}
        courses={currentData.courses}
        onSubmit={handleSubmission}
        blockedDates={currentData.trialSettings.blockedDates}
        customAvailability={currentData.trialSettings.customAvailability}
      />

      <Layout 
        trialSettings={currentData.trialSettings}
        logoUrl={(currentData.pageContent || INITIAL_DATA[language].pageContent).logo}
        onBookingClick={() => setIsBookingModalOpen(true)}
        onAdminClick={() => navigate('/adminbn')}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostDetailPage />} />
          <Route path="/instructors" element={<InstructorsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* Dynamic custom pages */}
          {currentData.customPages?.map(page => (
            <Route 
              path={`/${page.slug}`} 
              element={
                <div className="min-h-screen bg-white">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: page.content }}
                    />
                  </div>
                </div>
              } 
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </>
  );
};

const App: React.FC = () => {
  const [translations, setTranslations] = useState(initialTranslations);

  // Load translations from Firestore if available
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const [enTr, zhTr] = await Promise.all([
          getTranslations('en'),
          getTranslations('zh')
        ]);

        if (enTr || zhTr) {
          setTranslations(prev => ({
            en: enTr ? enTr : prev.en,
            zh: zhTr ? zhTr : prev.zh
          }));
        }
      } catch (error) {
        console.error('Error loading translations from Firestore:', error);
      }
    };

    loadTranslations();
  }, []);

  const handleUpdateTranslations = (updated: typeof initialTranslations) => {
    setTranslations(updated);

    // Persist both languages to Firestore
    saveTranslations(updated.en, 'en').catch(err => console.error('Error saving translations (en):', err));
    saveTranslations(updated.zh, 'zh').catch(err => console.error('Error saving translations (zh):', err));
  };
  
  return (
    <LanguageProvider translations={translations}>
      <AppContent translations={translations} onUpdateTranslations={handleUpdateTranslations} />
    </LanguageProvider>
  );
};

export default App;
