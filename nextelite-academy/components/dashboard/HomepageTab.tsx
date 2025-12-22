// Stub file - Extract content from CMSDashboard.tsx lines ~1679-2568
import React, { useState, useEffect, useRef } from 'react';
import { PageContent } from '../../types';
import RichTextEditor from '../RichTextEditor';
import { uploadImage } from '../../firebase/storage';

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
  const [editingLang, setEditingLang] = useState<'en' | 'zh'>('en');
  const [isUploading, setIsUploading] = useState(false);
  
  useEffect(() => {
    setLocalPageContent(pageContent);
  }, [pageContent]);

  // TODO: Extract all homepage handlers from CMSDashboard
  // - handleSaveHomepage
  // - handleImageUpload
  // - handleBackgroundUpload
  // - etc.

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Homepage Content Editor</h2>
        
        {activeTab === 'homepage' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <div className="bg-brand-blue p-1.5 rounded-lg text-white"><Home className="w-5 h-5" /></div>
                            Homepage Content Editor
                        </h3>
                        <button 
                            onClick={handleSavePageContent}
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
                                        onChange={(e) => setLocalPageContent({...localPageContent, hero: {...localPageContent.hero, titleLine1: e.target.value}})}
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Title Line 2</label>
                                    <input 
                                        value={localPageContent.hero.titleLine2}
                                        onChange={(e) => setLocalPageContent({...localPageContent, hero: {...localPageContent.hero, titleLine2: e.target.value}})}
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
                                    <textarea 
                                        value={localPageContent.hero.subtitle}
                                        onChange={(e) => setLocalPageContent({...localPageContent, hero: {...localPageContent.hero, subtitle: e.target.value}})}
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                        rows={2}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Explore Button Text</label>
                                    <input 
                                        value={localPageContent.hero.exploreButton}
                                        onChange={(e) => setLocalPageContent({...localPageContent, hero: {...localPageContent.hero, exploreButton: e.target.value}})}
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Trial Button Text</label>
                                    <input 
                                        value={localPageContent.hero.trialButton}
                                        onChange={(e) => setLocalPageContent({...localPageContent, hero: {...localPageContent.hero, trialButton: e.target.value}})}
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sections */}
                        <div className="border-b border-gray-100 pb-6">
                            <h4 className="text-lg font-bold text-gray-800 mb-4">Section Headings</h4>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Programs Heading</label>
                                        <input 
                                            value={localPageContent.sections.programs.heading}
                                            onChange={(e) => setLocalPageContent({...localPageContent, sections: {...localPageContent.sections, programs: {...localPageContent.sections.programs, heading: e.target.value}}})}
                                            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Programs Subheading</label>
                                        <input 
                                            value={localPageContent.sections.programs.subheading}
                                            onChange={(e) => setLocalPageContent({...localPageContent, sections: {...localPageContent.sections, programs: {...localPageContent.sections.programs, subheading: e.target.value}}})}
                                            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Mentors Heading</label>
                                        <input 
                                            value={localPageContent.sections.mentors.heading}
                                            onChange={(e) => setLocalPageContent({...localPageContent, sections: {...localPageContent.sections, mentors: {...localPageContent.sections.mentors, heading: e.target.value}}})}
                                            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Mentors Subheading</label>
                                        <input 
                                            value={localPageContent.sections.mentors.subheading}
                                            onChange={(e) => setLocalPageContent({...localPageContent, sections: {...localPageContent.sections, mentors: {...localPageContent.sections.mentors, subheading: e.target.value}}})}
                                            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Gallery Heading</label>
                                        <input 
                                            value={localPageContent.sections.gallery.heading}
                                            onChange={(e) => setLocalPageContent({...localPageContent, sections: {...localPageContent.sections, gallery: {...localPageContent.sections.gallery, heading: e.target.value}}})}
                                            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Contact Heading</label>
                                        <input 
                                            value={localPageContent.sections.contact.heading}
                                            onChange={(e) => setLocalPageContent({...localPageContent, sections: {...localPageContent.sections, contact: {...localPageContent.sections.contact, heading: e.target.value}}})}
                                            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Contact Subheading</label>
                                        <input 
                                            value={localPageContent.sections.contact.subheading}
                                            onChange={(e) => setLocalPageContent({...localPageContent, sections: {...localPageContent.sections, contact: {...localPageContent.sections.contact, subheading: e.target.value}}})}
                                            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Contact Address</label>
                                        <input 
                                            value={localPageContent.sections.contact.address}
                                            onChange={(e) => setLocalPageContent({...localPageContent, sections: {...localPageContent.sections, contact: {...localPageContent.sections.contact, address: e.target.value}}})}
                                            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Contact Email</label>
                                        <input 
                                            value={localPageContent.sections.contact.email}
                                            onChange={(e) => setLocalPageContent({...localPageContent, sections: {...localPageContent.sections, contact: {...localPageContent.sections.contact, email: e.target.value}}})}
                                            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Us Section */}
                        <div className="border-t border-gray-200 pt-8">
                            <h4 className="text-lg font-bold text-gray-800 mb-4">About Us Section</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">About Heading</label>
                                    <input 
                                        value={localPageContent.about?.heading || ''}
                                        onChange={(e) => setLocalPageContent({
                                            ...localPageContent,
                                            about: {
                                                ...(localPageContent.about || { subheading: '', content: '' }),
                                                heading: e.target.value
                                            }
                                        })}
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">About Subheading</label>
                                    <input 
                                        value={localPageContent.about?.subheading || ''}
                                        onChange={(e) => setLocalPageContent({
                                            ...localPageContent,
                                            about: {
                                                ...(localPageContent.about || { heading: '', content: '' }),
                                                subheading: e.target.value
                                            }
                                        })}
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-bold text-gray-700">About Content</label>
                                        <button
                                            onClick={() => {
                                                const useLayout = !localPageContent.about?.layoutBlocks;
                                                setLocalPageContent({
                                                    ...localPageContent,
                                                    about: {
                                                        ...(localPageContent.about || { heading: '', subheading: '', content: '' }),
                                                        layoutBlocks: useLayout ? [] : undefined,
                                                        content: useLayout ? '' : (localPageContent.about?.content || '')
                                                    }
                                                });
                                            }}
                                            className={`text-xs px-3 py-1 rounded-lg font-bold transition-colors ${
                                                localPageContent.about?.layoutBlocks !== undefined
                                                    ? 'bg-brand-purple text-white' 
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            {localPageContent.about?.layoutBlocks !== undefined ? 'Using Layout Builder' : 'Switch to Layout Builder'}
                                        </button>
                                    </div>
                                    
                                    {localPageContent.about?.layoutBlocks !== undefined ? (
                                        <LayoutBuilder
                                            blocks={localPageContent.about.layoutBlocks || []}
                                            onChange={(blocks) => {
                                                // Convert layout blocks to HTML
                                                const html = blocks.map(block => {
                                                    if (block.type === 'text-image') {
                                                        return `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center my-6">
                                                            <div class="prose prose-lg max-w-none">${block.text.replace(/\n/g, '<br>')}</div>
                                                            ${block.imageUrl ? `<div class="rounded-lg overflow-hidden"><img src="${block.imageUrl}" alt="" class="w-full h-auto object-cover responsive-image" /></div>` : ''}
                                                        </div>`;
                                                    } else if (block.type === 'image-text') {
                                                        return `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center my-6">
                                                            ${block.imageUrl ? `<div class="rounded-lg overflow-hidden"><img src="${block.imageUrl}" alt="" class="w-full h-auto object-cover responsive-image" /></div>` : ''}
                                                            <div class="prose prose-lg max-w-none">${block.text.replace(/\n/g, '<br>')}</div>
                                                        </div>`;
                                                    } else if (block.type === 'image-text-stack') {
                                                        return `<div class="image-text-stack">
                                                            ${block.imageUrl ? `<div class="image-container"><img src="${block.imageUrl}" alt="" class="w-full h-auto object-cover responsive-image" /></div>` : ''}
                                                            <div class="text-container prose prose-lg max-w-none">${block.text.replace(/\n/g, '<br>')}</div>
                                                        </div>`;
                                                    } else if (block.type === 'image-carousel') {
                                                        const images = block.images || [];
                                                        if (images.length === 0) return '';
                                                        return `<div class="my-6">
                                                            <div class="flex gap-4 overflow-x-auto pb-4">
                                                                ${images.map(img => `<div class="flex-shrink-0 w-64 h-64 rounded-lg overflow-hidden"><img src="${img}" alt="" class="w-full h-full object-cover responsive-image" /></div>`).join('')}
                                                            </div>
                                                        </div>`;
                                                    } else {
                                                        return `<div class="prose prose-lg max-w-none my-6">${block.text.replace(/\n/g, '<br>')}</div>`;
                                                    }
                                                }).join('');
                                                
                                                setLocalPageContent({
                                                    ...localPageContent,
                                                    about: {
                                                        ...(localPageContent.about || { heading: '', subheading: '' }),
                                                        layoutBlocks: blocks,
                                                        content: html
                                                    }
                                                });
                                            }}
                                        />
                                    ) : (
                                        <RichTextEditor
                                            initialValue={localPageContent.about?.content || ''}
                                            onChange={(html) => setLocalPageContent({
                                                ...localPageContent,
                                                about: {
                                                    ...(localPageContent.about || { heading: '', subheading: '' }),
                                                    content: html
                                                }
                                            })}
                                            placeholder="Enter about us content..."
                                        />
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">About Image URL</label>
                                    <input 
                                        type="text"
                                        value={localPageContent.about?.imageUrl || ''}
                                        onChange={(e) => setLocalPageContent({
                                            ...localPageContent,
                                            about: {
                                                ...(localPageContent.about || { heading: '', subheading: '', content: '' }),
                                                imageUrl: e.target.value
                                            }
                                        })}
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white text-xs"
                                        placeholder="https://example.com/about-image.jpg"
                                    />
                                    {localPageContent.about?.imageUrl && (
                                        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-32 bg-gray-100">
                                            <img src={localPageContent.about.imageUrl} alt="About Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section Backgrounds */}
                        <div>
                            <h4 className="text-lg font-bold text-gray-800 mb-4">Section Backgrounds (image / GIF / MP4)</h4>
                            <p className="text-xs text-gray-500 mb-4">
                                Paste a direct URL or drag &amp; drop a PNG, JPG, GIF, or MP4 file. MP4 backgrounds will play as looping, muted videos.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Hero background */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Hero Background URL</label>
                                    <input
                                        type="text"
                                        value={localPageContent.backgrounds?.hero || ''}
                                        onChange={(e) =>
                                            setLocalPageContent({
                                                ...localPageContent,
                                                backgrounds: {
                                                    ...(localPageContent.backgrounds || {}),
                                                    hero: e.target.value,
                                                },
                                            })
                                        }
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white text-xs"
                                        placeholder="https://example.com/hero-bg.png or .gif or .mp4"
                                    />
                                    {localPageContent.backgrounds?.hero && (
                                        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-24 bg-gray-100">
                                            {localPageContent.backgrounds.hero.toLowerCase().endsWith('.mp4') ? (
                                                <video src={localPageContent.backgrounds.hero} className="w-full h-full object-cover" muted loop />
                                            ) : (
                                                <img src={localPageContent.backgrounds.hero} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                            )}
                                        </div>
                                    )}
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onDragEnter={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                            handleBackgroundUpload('hero', e.dataTransfer.files);
                                        }}
                                        className="mt-2 text-xs border-2 border-dashed border-gray-300 rounded-xl px-3 py-3 text-gray-500 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                    >
                                        Drag &amp; drop PNG / JPG / GIF / MP4 here
                                    </div>
                                    {localPageContent.backgrounds?.hero && (
                                        <div className="mt-3">
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Background Sizing</label>
                                            <select
                                                value={localPageContent.backgroundSizing?.hero || 'default'}
                                                onChange={(e) =>
                                                    setLocalPageContent({
                                                        ...localPageContent,
                                                        backgroundSizing: {
                                                            ...(localPageContent.backgroundSizing || {}),
                                                            hero: e.target.value as 'default' | 'width' | 'height',
                                                        },
                                                    })
                                                }
                                                className="w-full border rounded-lg p-2 text-xs bg-white"
                                            >
                                                <option value="default">Default (Cover)</option>
                                                <option value="width">100% Width (Fit by Width)</option>
                                                <option value="height">100% Height (Fit by Height)</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Programs background */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Programs Section Background URL</label>
                                    <input
                                        type="text"
                                        value={localPageContent.backgrounds?.programs || ''}
                                        onChange={(e) =>
                                            setLocalPageContent({
                                                ...localPageContent,
                                                backgrounds: {
                                                    ...(localPageContent.backgrounds || {}),
                                                    programs: e.target.value,
                                                },
                                            })
                                        }
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white text-xs"
                                        placeholder="https://example.com/programs-bg.png"
                                    />
                                    {localPageContent.backgrounds?.programs && (
                                        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-24 bg-gray-100">
                                            {localPageContent.backgrounds.programs.toLowerCase().endsWith('.mp4') ? (
                                                <video src={localPageContent.backgrounds.programs} className="w-full h-full object-cover" muted loop />
                                            ) : (
                                                <img src={localPageContent.backgrounds.programs} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                            )}
                                        </div>
                                    )}
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onDragEnter={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                            handleBackgroundUpload('programs', e.dataTransfer.files);
                                        }}
                                        className="mt-2 text-xs border-2 border-dashed border-gray-300 rounded-xl px-3 py-3 text-gray-500 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                    >
                                        Drag &amp; drop PNG / JPG / GIF / MP4 here
                                    </div>
                                    {localPageContent.backgrounds?.programs && (
                                        <div className="mt-3">
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Background Sizing</label>
                                            <select
                                                value={localPageContent.backgroundSizing?.programs || 'default'}
                                                onChange={(e) =>
                                                    setLocalPageContent({
                                                        ...localPageContent,
                                                        backgroundSizing: {
                                                            ...(localPageContent.backgroundSizing || {}),
                                                            programs: e.target.value as 'default' | 'width' | 'height',
                                                        },
                                                    })
                                                }
                                                className="w-full border rounded-lg p-2 text-xs bg-white"
                                            >
                                                <option value="default">Default (Cover)</option>
                                                <option value="width">100% Width (Fit by Width)</option>
                                                <option value="height">100% Height (Fit by Height)</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Mentors background */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Mentors Section Background URL</label>
                                    <input
                                        type="text"
                                        value={localPageContent.backgrounds?.mentors || ''}
                                        onChange={(e) =>
                                            setLocalPageContent({
                                                ...localPageContent,
                                                backgrounds: {
                                                    ...(localPageContent.backgrounds || {}),
                                                    mentors: e.target.value,
                                                },
                                            })
                                        }
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white text-xs"
                                        placeholder="https://example.com/mentors-bg.png"
                                    />
                                    {localPageContent.backgrounds?.mentors && (
                                        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-24 bg-gray-100">
                                            {localPageContent.backgrounds.mentors.toLowerCase().endsWith('.mp4') ? (
                                                <video src={localPageContent.backgrounds.mentors} className="w-full h-full object-cover" muted loop />
                                            ) : (
                                                <img src={localPageContent.backgrounds.mentors} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                            )}
                                        </div>
                                    )}
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onDragEnter={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                            handleBackgroundUpload('mentors', e.dataTransfer.files);
                                        }}
                                        className="mt-2 text-xs border-2 border-dashed border-gray-300 rounded-xl px-3 py-3 text-gray-500 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                    >
                                        Drag &amp; drop PNG / JPG / GIF / MP4 here
                                    </div>
                                    {localPageContent.backgrounds?.mentors && (
                                        <div className="mt-3">
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Background Sizing</label>
                                            <select
                                                value={localPageContent.backgroundSizing?.mentors || 'default'}
                                                onChange={(e) =>
                                                    setLocalPageContent({
                                                        ...localPageContent,
                                                        backgroundSizing: {
                                                            ...(localPageContent.backgroundSizing || {}),
                                                            mentors: e.target.value as 'default' | 'width' | 'height',
                                                        },
                                                    })
                                                }
                                                className="w-full border rounded-lg p-2 text-xs bg-white"
                                            >
                                                <option value="default">Default (Cover)</option>
                                                <option value="width">100% Width (Fit by Width)</option>
                                                <option value="height">100% Height (Fit by Height)</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Gallery background */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Gallery Section Background URL</label>
                                    <input
                                        type="text"
                                        value={localPageContent.backgrounds?.gallery || ''}
                                        onChange={(e) =>
                                            setLocalPageContent({
                                                ...localPageContent,
                                                backgrounds: {
                                                    ...(localPageContent.backgrounds || {}),
                                                    gallery: e.target.value,
                                                },
                                            })
                                        }
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white text-xs"
                                        placeholder="https://example.com/gallery-bg.gif"
                                    />
                                    {localPageContent.backgrounds?.gallery && (
                                        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-24 bg-gray-100">
                                            {localPageContent.backgrounds.gallery.toLowerCase().endsWith('.mp4') ? (
                                                <video src={localPageContent.backgrounds.gallery} className="w-full h-full object-cover" muted loop />
                                            ) : (
                                                <img src={localPageContent.backgrounds.gallery} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                            )}
                                        </div>
                                    )}
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onDragEnter={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                            handleBackgroundUpload('gallery', e.dataTransfer.files);
                                        }}
                                        className="mt-2 text-xs border-2 border-dashed border-gray-300 rounded-xl px-3 py-3 text-gray-500 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                    >
                                        Drag &amp; drop PNG / JPG / GIF / MP4 here
                                    </div>
                                    {localPageContent.backgrounds?.gallery && (
                                        <div className="mt-3">
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Background Sizing</label>
                                            <select
                                                value={localPageContent.backgroundSizing?.gallery || 'default'}
                                                onChange={(e) =>
                                                    setLocalPageContent({
                                                        ...localPageContent,
                                                        backgroundSizing: {
                                                            ...(localPageContent.backgroundSizing || {}),
                                                            gallery: e.target.value as 'default' | 'width' | 'height',
                                                        },
                                                    })
                                                }
                                                className="w-full border rounded-lg p-2 text-xs bg-white"
                                            >
                                                <option value="default">Default (Cover)</option>
                                                <option value="width">100% Width (Fit by Width)</option>
                                                <option value="height">100% Height (Fit by Height)</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Contact background */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Contact Section Background URL</label>
                                    <input
                                        type="text"
                                        value={localPageContent.backgrounds?.contact || ''}
                                        onChange={(e) =>
                                            setLocalPageContent({
                                                ...localPageContent,
                                                backgrounds: {
                                                    ...(localPageContent.backgrounds || {}),
                                                    contact: e.target.value,
                                                },
                                            })
                                        }
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white text-xs"
                                        placeholder="https://example.com/contact-bg.mp4"
                                    />
                                    {localPageContent.backgrounds?.contact && (
                                        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-24 bg-gray-100">
                                            {localPageContent.backgrounds.contact.toLowerCase().endsWith('.mp4') ? (
                                                <video src={localPageContent.backgrounds.contact} className="w-full h-full object-cover" muted loop />
                                            ) : (
                                                <img src={localPageContent.backgrounds.contact} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                            )}
                                        </div>
                                    )}
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onDragEnter={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                            handleBackgroundUpload('contact', e.dataTransfer.files);
                                        }}
                                        className="mt-2 text-xs border-2 border-dashed border-gray-300 rounded-xl px-3 py-3 text-gray-500 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                    >
                                        Drag &amp; drop PNG / JPG / GIF / MP4 here
                                    </div>
                                    {localPageContent.backgrounds?.contact && (
                                        <div className="mt-3">
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Background Sizing</label>
                                            <select
                                                value={localPageContent.backgroundSizing?.contact || 'default'}
                                                onChange={(e) =>
                                                    setLocalPageContent({
                                                        ...localPageContent,
                                                        backgroundSizing: {
                                                            ...(localPageContent.backgroundSizing || {}),
                                                            contact: e.target.value as 'default' | 'width' | 'height',
                                                        },
                                                    })
                                                }
                                                className="w-full border rounded-lg p-2 text-xs bg-white"
                                            >
                                                <option value="default">Default (Cover)</option>
                                                <option value="width">100% Width (Fit by Width)</option>
                                                <option value="height">100% Height (Fit by Height)</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* About background */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">About Us Section Background URL</label>
                                    <input
                                        type="text"
                                        value={localPageContent.backgrounds?.about || ''}
                                        onChange={(e) =>
                                            setLocalPageContent({
                                                ...localPageContent,
                                                backgrounds: {
                                                    ...(localPageContent.backgrounds || {}),
                                                    about: e.target.value,
                                                },
                                            })
                                        }
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white text-xs"
                                        placeholder="https://example.com/about-bg.png"
                                    />
                                    {localPageContent.backgrounds?.about && (
                                        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-24 bg-gray-100">
                                            {localPageContent.backgrounds.about.toLowerCase().endsWith('.mp4') ? (
                                                <video src={localPageContent.backgrounds.about} className="w-full h-full object-cover" muted loop />
                                            ) : (
                                                <img src={localPageContent.backgrounds.about} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                            )}
                                        </div>
                                    )}
                                    <div
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onDragEnter={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDragLeave={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                        }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                            handleBackgroundUpload('about', e.dataTransfer.files);
                                        }}
                                        className="mt-2 text-xs border-2 border-dashed border-gray-300 rounded-xl px-3 py-3 text-gray-500 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                    >
                                        Drag &amp; drop PNG / JPG / GIF / MP4 here
                                    </div>
                                    {localPageContent.backgrounds?.about && (
                                        <div className="mt-3">
                                            <label className="block text-xs font-bold text-gray-700 mb-1">Background Sizing</label>
                                            <select
                                                value={localPageContent.backgroundSizing?.about || 'default'}
                                                onChange={(e) =>
                                                    setLocalPageContent({
                                                        ...localPageContent,
                                                        backgroundSizing: {
                                                            ...(localPageContent.backgroundSizing || {}),
                                                            about: e.target.value as 'default' | 'width' | 'height',
                                                        },
                                                    })
                                                }
                                                className="w-full border rounded-lg p-2 text-xs bg-white"
                                            >
                                                <option value="default">Default (Cover)</option>
                                                <option value="width">100% Width (Fit by Width)</option>
                                                <option value="height">100% Height (Fit by Height)</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Logo Upload */}
                        <div>
                            <h4 className="text-lg font-bold text-gray-800 mb-4">Site Logo</h4>
                            <p className="text-xs text-gray-500 mb-4">
                                Upload a logo image to display in the top-left corner next to "NextElite Academy". Recommended: PNG with transparent background, max height 40px.
                            </p>
                            <div className="flex flex-col md:flex-row gap-4 items-start">
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Logo URL</label>
                                    <input
                                        type="text"
                                        value={localPageContent.logo || ''}
                                        onChange={(e) =>
                                            setLocalPageContent({
                                                ...localPageContent,
                                                logo: e.target.value,
                                            })
                                        }
                                        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white text-xs"
                                        placeholder="https://example.com/logo.png"
                                    />
                                </div>
                                <div
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onDragEnter={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                                    }}
                                    onDragLeave={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                                        handleBackgroundUpload('logo', e.dataTransfer.files);
                                    }}
                                    className="mt-6 md:mt-0 text-xs border-2 border-dashed border-gray-300 rounded-xl px-4 py-4 text-gray-500 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors min-w-[200px]"
                                >
                                    Drag &amp; drop logo here
                                </div>
                            </div>
                            {localPageContent.logo && (
                                <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 bg-white p-4 inline-block">
                                    <img 
                                        src={localPageContent.logo} 
                                        alt="Logo Preview" 
                                        className="h-10 w-auto object-contain"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                                    />
                                </div>
                            )}
                        </div>

                        {/* Gallery Images */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg font-bold text-gray-800">Gallery Images</h4>
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e.target.files)}
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-blue text-white font-bold hover:bg-blue-600 disabled:opacity-50 transition-colors"
                                    >
                                        <Upload className="w-4 h-4" /> {isUploading ? 'Uploading...' : 'Upload Images'}
                                    </button>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Or paste image URL here..."
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleImageUrlAdd((e.target as HTMLInputElement).value);
                                                (e.target as HTMLInputElement).value = '';
                                            }
                                        }}
                                        className="flex-1 border rounded-lg p-2 text-sm"
                                    />
                                    <button
                                        onClick={(e) => {
                                            const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                                            if (input) {
                                                handleImageUrlAdd(input.value);
                                                input.value = '';
                                            }
                                        }}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-sm transition-colors"
                                    >
                                        Add URL
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {localPageContent.galleryImages.map((imgUrl, idx) => (
                                    <div
                                        key={idx}
                                        draggable
                                        onDragStart={() => handleImageDragStart(idx)}
                                        onDragOver={handleImageDragOver}
                                        onDrop={(e) => handleImageDrop(e, idx)}
                                        className="relative group rounded-xl overflow-hidden border-2 border-gray-200 hover:border-brand-blue transition-all cursor-move"
                                    >
                                        <div className="absolute top-2 left-2 z-10 bg-black/50 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                            <GripVertical className="w-3 h-3" /> {idx + 1}
                                        </div>
                                        <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-32 object-cover" />
                                        <button
                                            onClick={() => handleImageDelete(idx)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        
        <p className="text-gray-600">
          Extract homepage content from CMSDashboard.tsx lines ~1679-2568
        </p>
      </div>
    </div>
  );
};

export default HomepageTab;
