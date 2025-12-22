import React, { useState, useEffect } from 'react';
import { PageContent } from '../../types';
import { Save } from 'lucide-react';

interface HomepageTabProps {
  pageContent: PageContent;
  language: 'en' | 'zh';
  onUpdatePageContent: (pageContent: PageContent) => void;
}

const HomepageTab: React.FC<HomepageTabProps> = ({ 
  pageContent, 
  language, 
  onUpdatePageContent 
}) => {
  const [localPageContent, setLocalPageContent] = useState<PageContent>(pageContent);
  
  useEffect(() => {
    setLocalPageContent(pageContent);
  }, [pageContent]);

  const handleSave = () => {
    onUpdatePageContent(localPageContent);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Homepage Content Editor</h2>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-brand-blue text-white font-bold hover:bg-blue-600 shadow-sm transition-transform hover:scale-105"
          >
            <Save className="w-4 h-4" /> Save Homepage
          </button>
        </div>

        <div className="space-y-8">
          {/* Hero Section */}
          <div className="border-b border-gray-100 pb-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Hero Section</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title Line 1</label>
                <input
                  value={localPageContent.hero.titleLine1}
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
                  value={localPageContent.hero.titleLine2}
                  onChange={(e) =>
                    setLocalPageContent({
                      ...localPageContent,
                      hero: { ...localPageContent.hero, titleLine2: e.target.value }
                    })
                  }
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
                <textarea
                  value={localPageContent.hero.subtitle}
                  onChange={(e) =>
                    setLocalPageContent({
                      ...localPageContent,
                      hero: { ...localPageContent.hero, subtitle: e.target.value }
                    })
                  }
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Explore Button Text</label>
                <input
                  value={localPageContent.hero.exploreButton}
                  onChange={(e) =>
                    setLocalPageContent({
                      ...localPageContent,
                      hero: { ...localPageContent.hero, exploreButton: e.target.value }
                    })
                  }
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Trial Button Text</label>
                <input
                  value={localPageContent.hero.trialButton}
                  onChange={(e) =>
                    setLocalPageContent({
                      ...localPageContent,
                      hero: { ...localPageContent.hero, trialButton: e.target.value }
                    })
                  }
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Section Headings */}
          <div className="border-b border-gray-100 pb-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Section Headings</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Programs Heading</label>
                  <input
                    value={localPageContent.sections.programs.heading}
                    onChange={(e) =>
                      setLocalPageContent({
                        ...localPageContent,
                        sections: {
                          ...localPageContent.sections,
                          programs: { ...localPageContent.sections.programs, heading: e.target.value }
                        }
                      })
                    }
                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Programs Subheading</label>
                  <input
                    value={localPageContent.sections.programs.subheading}
                    onChange={(e) =>
                      setLocalPageContent({
                        ...localPageContent,
                        sections: {
                          ...localPageContent.sections,
                          programs: { ...localPageContent.sections.programs, subheading: e.target.value }
                        }
                      })
                    }
                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Mentors Heading</label>
                  <input
                    value={localPageContent.sections.mentors.heading}
                    onChange={(e) =>
                      setLocalPageContent({
                        ...localPageContent,
                        sections: {
                          ...localPageContent.sections,
                          mentors: { ...localPageContent.sections.mentors, heading: e.target.value }
                        }
                      })
                    }
                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Mentors Subheading</label>
                  <input
                    value={localPageContent.sections.mentors.subheading}
                    onChange={(e) =>
                      setLocalPageContent({
                        ...localPageContent,
                        sections: {
                          ...localPageContent.sections,
                          mentors: { ...localPageContent.sections.mentors, subheading: e.target.value }
                        }
                      })
                    }
                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Gallery Heading</label>
                  <input
                    value={localPageContent.sections.gallery.heading}
                    onChange={(e) =>
                      setLocalPageContent({
                        ...localPageContent,
                        sections: {
                          ...localPageContent.sections,
                          gallery: { ...localPageContent.sections.gallery, heading: e.target.value }
                        }
                      })
                    }
                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-4">Contact Section</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Heading</label>
                <input
                  value={localPageContent.sections.contact.heading}
                  onChange={(e) =>
                    setLocalPageContent({
                      ...localPageContent,
                      sections: {
                        ...localPageContent.sections,
                        contact: { ...localPageContent.sections.contact, heading: e.target.value }
                      }
                    })
                  }
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Subheading</label>
                <input
                  value={localPageContent.sections.contact.subheading}
                  onChange={(e) =>
                    setLocalPageContent({
                      ...localPageContent,
                      sections: {
                        ...localPageContent.sections,
                        contact: { ...localPageContent.sections.contact, subheading: e.target.value }
                      }
                    })
                  }
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Address</label>
                <input
                  value={localPageContent.sections.contact.address}
                  onChange={(e) =>
                    setLocalPageContent({
                      ...localPageContent,
                      sections: {
                        ...localPageContent.sections,
                        contact: { ...localPageContent.sections.contact, address: e.target.value }
                      }
                    })
                  }
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input
                  value={localPageContent.sections.contact.email}
                  onChange={(e) =>
                    setLocalPageContent({
                      ...localPageContent,
                      sections: {
                        ...localPageContent.sections,
                        contact: { ...localPageContent.sections.contact, email: e.target.value }
                      }
                    })
                  }
                  className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageTab;