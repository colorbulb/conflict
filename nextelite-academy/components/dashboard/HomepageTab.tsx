import React, { useState, useEffect } from 'react';
import { PageContent } from '../../types';
import { Save } from 'lucide-react';
import AboutSection from './homepage/AboutSection';
import MediaSection from './homepage/MediaSection';
import BackgroundSection from './homepage/BackgroundSection';

interface HomepageTabProps {
  pageContent: PageContent;
  onUpdatePageContent: (content: PageContent) => void;
}

const HomepageTab: React.FC<HomepageTabProps> = ({ pageContent, onUpdatePageContent }) => {
  const [localPageContent, setLocalPageContent] = useState<PageContent>(pageContent);

  useEffect(() => {
    setLocalPageContent(pageContent);
  }, [pageContent]);

  const handleSave = () => {
    onUpdatePageContent(localPageContent);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Hero Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Title Line 1</label>
            <input
              value={localPageContent.hero?.titleLine1 || ''}
              onChange={(e) =>
                setLocalPageContent({
                  ...localPageContent,
                  hero: { ...localPageContent.hero, titleLine1: e.target.value }
                })
              }
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Title Line 2</label>
            <input
              value={localPageContent.hero?.titleLine2 || ''}
              onChange={(e) =>
                setLocalPageContent({
                  ...localPageContent,
                  hero: { ...localPageContent.hero, titleLine2: e.target.value }
                })
              }
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
            <input
              value={localPageContent.hero?.subtitle || ''}
              onChange={(e) =>
                setLocalPageContent({
                  ...localPageContent,
                  hero: { ...localPageContent.hero, subtitle: e.target.value }
                })
              }
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
            />
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Primary Button Text</label>
              <input
                value={localPageContent.hero?.primaryButtonText || ''}
                onChange={(e) =>
                  setLocalPageContent({
                    ...localPageContent,
                    hero: { ...localPageContent.hero, primaryButtonText: e.target.value }
                  })
                }
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Secondary Button Text</label>
              <input
                value={localPageContent.hero?.secondaryButtonText || ''}
                onChange={(e) =>
                  setLocalPageContent({
                    ...localPageContent,
                    hero: { ...localPageContent.hero, secondaryButtonText: e.target.value }
                  })
                }
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section Headings */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Section Headings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Programs Section</label>
            <input
              value={localPageContent.sectionHeadings?.programs || ''}
              onChange={(e) =>
                setLocalPageContent({
                  ...localPageContent,
                  sectionHeadings: { 
                    ...(localPageContent.sectionHeadings || { mentors: '', gallery: '' }), 
                    programs: e.target.value 
                  }
                })
              }
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Mentors Section</label>
            <input
              value={localPageContent.sectionHeadings?.mentors || ''}
              onChange={(e) =>
                setLocalPageContent({
                  ...localPageContent,
                  sectionHeadings: { 
                    ...(localPageContent.sectionHeadings || { programs: '', gallery: '' }), 
                    mentors: e.target.value 
                  }
                })
              }
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Gallery Section</label>
            <input
              value={localPageContent.sectionHeadings?.gallery || ''}
              onChange={(e) =>
                setLocalPageContent({
                  ...localPageContent,
                  sectionHeadings: { 
                    ...(localPageContent.sectionHeadings || { programs: '', mentors: '' }), 
                    gallery: e.target.value 
                  }
                })
              }
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* About Us Section Component */}
      <AboutSection pageContent={localPageContent} onUpdate={setLocalPageContent} />

      {/* Media Section Component (Logo + Gallery) */}
      <MediaSection pageContent={localPageContent} onUpdate={setLocalPageContent} />

      {/* Background Images Component */}
      <BackgroundSection pageContent={localPageContent} onUpdate={setLocalPageContent} />

      {/* Contact Section */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Contact Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Heading</label>
            <input
              value={localPageContent.contact?.heading || ''}
              onChange={(e) =>
                setLocalPageContent({
                  ...localPageContent,
                  contact: { 
                    ...(localPageContent.contact || { subheading: '', address: '', email: '' }), 
                    heading: e.target.value 
                  }
                })
              }
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Subheading</label>
            <input
              value={localPageContent.contact?.subheading || ''}
              onChange={(e) =>
                setLocalPageContent({
                  ...localPageContent,
                  contact: { 
                    ...(localPageContent.contact || { heading: '', address: '', email: '' }), 
                    subheading: e.target.value 
                  }
                })
              }
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
            <input
              value={localPageContent.contact?.address || ''}
              onChange={(e) =>
                setLocalPageContent({
                  ...localPageContent,
                  contact: { 
                    ...(localPageContent.contact || { heading: '', subheading: '', email: '' }), 
                    address: e.target.value 
                  }
                })
              }
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input
              value={localPageContent.contact?.email || ''}
              onChange={(e) =>
                setLocalPageContent({
                  ...localPageContent,
                  contact: { 
                    ...(localPageContent.contact || { heading: '', subheading: '', address: '' }), 
                    email: e.target.value 
                  }
                })
              }
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold hover:bg-blue-600 flex justify-center items-center gap-2 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
      >
        <Save className="w-5 h-5" /> Save Homepage Content
      </button>
    </div>
  );
};

export default HomepageTab;