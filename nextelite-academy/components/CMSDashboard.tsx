import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Course, Instructor, ThemeColors, TrialSettings, Submission, BlogPost, PageContent, CustomPage, MenuItem } from '../types';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { translations as initialTranslations } from '../translations';

// Import tab components
import HomepageTab from './dashboard/HomepageTab';
import CoursesTab from './dashboard/CoursesTab';
import InstructorsTab from './dashboard/InstructorsTab';
import BlogTab from './dashboard/BlogTab';
import InquiriesTab from './dashboard/InquiriesTab';
import PagesTab from './dashboard/PagesTab';
import MenuTab from './dashboard/MenuTab';
import LookupsTab from './dashboard/LookupsTab';
import SettingsTab from './dashboard/SettingsTab';
import TabNavigation from './dashboard/TabNavigation';

type TranslationsType = typeof initialTranslations;

interface CMSDashboardProps {
  courses: Course[];
  instructors: Instructor[];
  blogPosts?: BlogPost[];
  themeColors: ThemeColors;
  trialSettings: TrialSettings;
  submissions: Submission[];
  translations: TranslationsType;
  pageContent: PageContent;
  lookupLists: { ageGroups: string[]; courseCategories: string[]; blogCategories: string[] };
  customPages?: CustomPage[];
  menuItems?: MenuItem[];
  enMenuItems?: MenuItem[];
  zhMenuItems?: MenuItem[];
  onUpdateCourse: (course: Course) => void;
  onUpdateInstructor: (instructor: Instructor) => void;
  onUpdateTheme: (colors: ThemeColors) => void;
  onUpdateTrial: (settings: TrialSettings) => void;
  onUpdateBlog?: (posts: BlogPost[]) => void;
  onUpdateTranslations: (translations: TranslationsType) => void;
  onUpdatePageContent: (pageContent: PageContent) => void;
  onUpdateLookupLists: (lists: { ageGroups: string[]; courseCategories: string[]; blogCategories: string[] }) => void;
  onUpdateCustomPages?: (pages: CustomPage[], lang?: 'en' | 'zh') => Promise<void>;
  onUpdateMenuItems?: (items: MenuItem[], lang?: 'en' | 'zh') => Promise<void>;
  initialTab?: 'courses' | 'blog' | 'instructors' | 'settings' | 'inquiries' | 'homepage' | 'lookups' | 'pages' | 'menu';
  onLogout: () => void;
}

const CMSDashboard: React.FC<CMSDashboardProps> = ({
  courses, 
  instructors,
  blogPosts = [],
  themeColors,
  trialSettings,
  submissions,
  translations,
  pageContent,
  lookupLists,
  customPages = [],
  menuItems = [],
  enMenuItems = [],
  zhMenuItems = [],
  onUpdateCourse, 
  onUpdateInstructor,
  onUpdateTheme,
  onUpdateTrial,
  onUpdateBlog,
  onUpdateTranslations,
  onUpdatePageContent,
  onUpdateLookupLists,
  onUpdateCustomPages,
  onUpdateMenuItems,
  initialTab = 'courses',
  onLogout 
}) => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'courses' | 'blog' | 'instructors' | 'settings' | 'inquiries' | 'homepage' | 'lookups' | 'pages' | 'menu'>(initialTab);
  
  // Sync activeTab with URL
  useEffect(() => {
    const urlTab = location.pathname.split('/')[2] || 'courses';
    const validTabs = ['courses', 'blog', 'instructors', 'settings', 'inquiries', 'homepage', 'lookups', 'pages', 'menu'];
    if (validTabs.includes(urlTab) && urlTab !== activeTab) {
      setActiveTab(urlTab as typeof validTabs[number]);
    }
  }, [location.pathname]);
  
  // Update URL when tab changes
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    navigate(`/adminbn/${tab}`, { replace: true });
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => { navigate('/'); }} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-display font-bold bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'homepage' && (
            <HomepageTab
              pageContent={pageContent}
              language={language}
              onUpdatePageContent={onUpdatePageContent}
            />
          )}

          {activeTab === 'courses' && (
            <CoursesTab
              courses={courses}
              lookupLists={lookupLists}
              onUpdateCourse={onUpdateCourse}
            />
          )}

          {activeTab === 'instructors' && (
            <InstructorsTab
              instructors={instructors}
              onUpdateInstructor={onUpdateInstructor}
            />
          )}

          {activeTab === 'blog' && (
            <BlogTab
              blogPosts={blogPosts}
              lookupLists={lookupLists}
              onUpdateBlog={onUpdateBlog}
            />
          )}

          {activeTab === 'inquiries' && (
            <InquiriesTab
              submissions={submissions}
              t={t}
            />
          )}

          {activeTab === 'pages' && (
            <PagesTab
              customPages={customPages}
              onUpdateCustomPages={onUpdateCustomPages}
            />
          )}

          {activeTab === 'menu' && (
            <MenuTab
              enMenuItems={enMenuItems}
              zhMenuItems={zhMenuItems}
              customPages={customPages}
              courses={courses}
              blogPosts={blogPosts}
              onUpdateMenuItems={onUpdateMenuItems}
            />
          )}

          {activeTab === 'lookups' && (
            <LookupsTab
              lookupLists={lookupLists}
              onUpdateLookupLists={onUpdateLookupLists}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              themeColors={themeColors}
              trialSettings={trialSettings}
              translations={translations}
              onUpdateTheme={onUpdateTheme}
              onUpdateTrial={onUpdateTrial}
              onUpdateTranslations={onUpdateTranslations}
            />
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default CMSDashboard;
