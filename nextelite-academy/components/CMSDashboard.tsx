import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Course, Instructor, ThemeColors, TrialSettings, Submission, BlogPost, PageContent, CustomPage, MenuItem } from '../types';
import { Settings, Inbox, User, FileText, Briefcase, List as ListIcon, Home } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { translations as initialTranslations } from '../translations';

// Import dashboard modules
import CoursesTab from './dashboard/CoursesTab';
import InstructorsTab from './dashboard/InstructorsTab';
import HomepageTab from './dashboard/HomepageTab';
import SettingsTab from './dashboard/SettingsTab';
import BlogTab from './dashboard/BlogTab';
import PagesTab from './dashboard/PagesTab';
import MenuTab from './dashboard/MenuTab';
import InquiriesTab from './dashboard/InquiriesTab';
import LookupsTab from './dashboard/LookupsTab';

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
  enPageContent: PageContent;
  zhPageContent: PageContent;
  lookupLists: { ageGroups: string[]; courseCategories: string[]; blogCategories: string[]; difficulties: string[] };
  customPages?: CustomPage[];
  enCustomPages?: CustomPage[];
  zhCustomPages?: CustomPage[];
  menuItems?: MenuItem[];
  enMenuItems?: MenuItem[];
  zhMenuItems?: MenuItem[];
  onUpdateCourse: (course: Course) => void;
  onUpdateInstructor: (instructor: Instructor) => void;
  onUpdateTheme: (colors: ThemeColors) => void;
  onUpdateTrial: (settings: TrialSettings) => void;
  onUpdateBlog?: (posts: BlogPost[]) => void;
  onUpdateTranslations: (translations: TranslationsType) => void;
  onUpdatePageContent: (pageContent: PageContent, lang?: 'en' | 'zh') => void;
  onUpdateLookupLists: (lists: { ageGroups: string[]; courseCategories: string[]; blogCategories: string[]; difficulties: string[] }) => void;
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
  enPageContent,
  zhPageContent,
  lookupLists,
  customPages = [],
  enCustomPages = [],
  zhCustomPages = [],
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-brand-blue p-2 rounded-lg">
            <Settings className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">CMS Dashboard</h1>
            <p className="text-xs text-gray-500">
              Managing: <span className="font-bold uppercase text-brand-blue">{language}</span> Site
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 px-4 py-2 rounded-full transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => handleTabChange('homepage')}
            className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'homepage'
                ? 'bg-brand-blue text-white shadow-lg shadow-blue-200'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Home className="w-4 h-4" /> Home
          </button>
          <button
            onClick={() => handleTabChange('pages')}
            className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'pages'
                ? 'bg-brand-blue text-white shadow-lg shadow-blue-200'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" /> Pages
          </button>
          <button
            onClick={() => handleTabChange('courses')}
            className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'courses'
                ? 'bg-brand-blue text-white shadow-lg shadow-blue-200'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Courses
          </button>
          <button
            onClick={() => handleTabChange('blog')}
            className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'blog'
                ? 'bg-brand-blue text-white shadow-lg shadow-blue-200'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" /> Blog
          </button>
          <button
            onClick={() => handleTabChange('instructors')}
            className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'instructors'
                ? 'bg-brand-blue text-white shadow-lg shadow-blue-200'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <User className="w-4 h-4" /> Instructors
          </button>
          <button
            onClick={() => handleTabChange('settings')}
            className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'settings'
                ? 'bg-brand-blue text-white shadow-lg shadow-blue-200'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button
            onClick={() => handleTabChange('inquiries')}
            className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'inquiries'
                ? 'bg-brand-blue text-white shadow-lg shadow-blue-200'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Inbox className="w-4 h-4" /> {t.admin.inquiries}
          </button>
          <button
            onClick={() => handleTabChange('lookups')}
            className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'lookups'
                ? 'bg-brand-blue text-white shadow-lg shadow-blue-200'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ListIcon className="w-4 h-4" /> Lookup Lists
          </button>
          <button
            onClick={() => handleTabChange('menu')}
            className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
              activeTab === 'menu'
                ? 'bg-brand-blue text-white shadow-lg shadow-blue-200'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ListIcon className="w-4 h-4" /> Menu
          </button>
        </div>

        {/* Tab Content - Using Modular Components */}
        {activeTab === 'homepage' && (
          <HomepageTab
            pageContent={pageContent}
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
            pageContent={pageContent}
            onUpdatePageContent={onUpdatePageContent}
          />
        )}

        {activeTab === 'blog' && onUpdateBlog && (
          <BlogTab
            blogPosts={blogPosts}
            lookupLists={lookupLists}
            onUpdateBlog={onUpdateBlog}
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

        {activeTab === 'pages' && onUpdateCustomPages && (
          <PagesTab
            customPages={customPages}
            onUpdateCustomPages={onUpdateCustomPages}
          />
        )}

        {activeTab === 'menu' && onUpdateMenuItems && (
          <MenuTab
            enMenuItems={enMenuItems}
            zhMenuItems={zhMenuItems}
            customPages={customPages}
            courses={courses}
            blogPosts={blogPosts}
            onUpdateMenuItems={onUpdateMenuItems}
          />
        )}

        {activeTab === 'inquiries' && (
          <InquiriesTab submissions={submissions} t={t} />
        )}

        {activeTab === 'lookups' && (
          <LookupsTab
            lookupLists={lookupLists}
            onUpdateLookupLists={onUpdateLookupLists}
          />
        )}
      </div>
    </div>
  );
};

export default CMSDashboard;
