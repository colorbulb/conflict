import React from 'react';
import { PageContent } from '../../../types';
import LayoutBuilder from '../LayoutBuilder';
import RichTextEditor from '../../RichTextEditor';

interface AboutSectionProps {
  pageContent: PageContent;
  onUpdate: (pageContent: PageContent) => void;
}


const AboutSection: React.FC<AboutSectionProps> = ({ pageContent, onUpdate }) => {
  const [activeLang, setActiveLang] = React.useState<'en' | 'zh'>('en');
  // Support both legacy (single about object) and new (en/zh split) structures
  const isTabbed = pageContent.about && (pageContent.about.en || pageContent.about.zh);
  const legacyAbout = pageContent.about && !isTabbed ? pageContent.about : undefined;
  const safeAbout = {
    en: isTabbed
      ? {
          heading: pageContent.about?.en?.heading || '',
          subheading: pageContent.about?.en?.subheading || '',
          content: pageContent.about?.en?.content || '',
          imageUrl: pageContent.about?.en?.imageUrl || '',
          layoutBlocks: pageContent.about?.en?.layoutBlocks || undefined,
        }
      : {
          heading: legacyAbout?.heading || '',
          subheading: legacyAbout?.subheading || '',
          content: legacyAbout?.content || '',
          imageUrl: legacyAbout?.imageUrl || '',
          layoutBlocks: legacyAbout?.layoutBlocks || undefined,
        },
    zh: isTabbed
      ? {
          heading: pageContent.about?.zh?.heading || '',
          subheading: pageContent.about?.zh?.subheading || '',
          content: pageContent.about?.zh?.content || '',
          imageUrl: pageContent.about?.zh?.imageUrl || '',
          layoutBlocks: pageContent.about?.zh?.layoutBlocks || undefined,
        }
      : {
          heading: legacyAbout?.heading || '',
          subheading: legacyAbout?.subheading || '',
          content: legacyAbout?.content || '',
          imageUrl: legacyAbout?.imageUrl || '',
          layoutBlocks: legacyAbout?.layoutBlocks || undefined,
        },
  };

  const handleFieldChange = (field: string, value: string) => {
    onUpdate({
      ...pageContent,
      about: {
        ...pageContent.about,
        [activeLang]: {
          ...safeAbout[activeLang],
          [field]: value
        }
      }
    });
  };

  const handleLayoutBlocksChange = (blocks: any[]) => {
    // Convert layout blocks to HTML
    const html = blocks
      .map((block) => {
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
              ${images.map((img) => `<div class="flex-shrink-0 w-64 h-64 rounded-lg overflow-hidden"><img src="${img}" alt="" class="w-full h-full object-cover responsive-image" /></div>`).join('')}
            </div>
          </div>`;
        } else {
          return `<div class="prose prose-lg max-w-none my-6">${block.text.replace(/\n/g, '<br>')}</div>`;
        }
      })
      .join('');
    onUpdate({
      ...pageContent,
      about: {
        ...pageContent.about,
        [activeLang]: {
          ...safeAbout[activeLang],
          layoutBlocks: blocks,
          content: html
        }
      }
    });
  };

  const handleSwitchLayout = () => {
    const useLayout = !safeAbout[activeLang].layoutBlocks;
    onUpdate({
      ...pageContent,
      about: {
        ...pageContent.about,
        [activeLang]: {
          ...safeAbout[activeLang],
          layoutBlocks: useLayout ? [] : undefined,
          content: useLayout ? '' : safeAbout[activeLang].content
        }
      }
    });
  };

  return (
    <div className="border-t border-gray-200 pt-8">
      <h4 className="text-lg font-bold text-gray-800 mb-4">About Us Section</h4>
      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-t-lg font-bold ${activeLang === 'en' ? 'bg-brand-blue text-white' : 'bg-white text-brand-blue border'}`}
          onClick={() => setActiveLang('en')}
        >
          English
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-bold ${activeLang === 'zh' ? 'bg-brand-blue text-white' : 'bg-white text-brand-blue border'}`}
          onClick={() => setActiveLang('zh')}
        >
          繁體中文
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">About Heading</label>
          <input
            value={safeAbout[activeLang].heading}
            onChange={e => handleFieldChange('heading', e.target.value)}
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">About Subheading</label>
          <input
            value={safeAbout[activeLang].subheading}
            onChange={e => handleFieldChange('subheading', e.target.value)}
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
          />
        </div>
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-gray-700">About Content</label>
            <button
              onClick={handleSwitchLayout}
              className={`text-xs px-3 py-1 rounded-lg font-bold transition-colors ${safeAbout[activeLang].layoutBlocks !== undefined ? 'bg-brand-purple text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {safeAbout[activeLang].layoutBlocks !== undefined ? 'Using Layout Builder' : 'Switch to Layout Builder'}
            </button>
          </div>
          {safeAbout[activeLang].layoutBlocks !== undefined ? (
            <LayoutBuilder
              blocks={safeAbout[activeLang].layoutBlocks || []}
              onChange={handleLayoutBlocksChange}
            />
          ) : (
            <RichTextEditor
              initialValue={safeAbout[activeLang].content || ''}
              onChange={html => handleFieldChange('content', html)}
              placeholder="Enter about us content..."
            />
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">About Image URL</label>
          <input
            type="text"
            value={safeAbout[activeLang].imageUrl}
            onChange={e => handleFieldChange('imageUrl', e.target.value)}
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
            placeholder="Optional image URL"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutSection;