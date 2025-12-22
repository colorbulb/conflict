import React, { useState } from 'react';
import { CustomPage } from '../../types';
import { Save, ArrowLeft } from 'lucide-react';
import RichTextEditor from '../RichTextEditor';
import LayoutBuilder, { LayoutBlock } from './LayoutBuilder';

interface CustomPageEditorProps {
  editingPage: CustomPage;
  setEditingPage: (page: CustomPage | null) => void;
  onSave: (page: CustomPage) => Promise<void>;
  currentCustomPages: CustomPage[];
}

const CustomPageEditor: React.FC<CustomPageEditorProps> = ({
  editingPage,
  setEditingPage,
  onSave,
  currentCustomPages
}) => {
  const [editingLang, setEditingLang] = useState<'en' | 'zh'>('en');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editingPage.slug.trim()) {
      alert('Please enter a slug');
      return;
    }
    if (!editingPage.translations.en.name.trim() && !editingPage.translations.zh.name.trim()) {
      alert('Please enter a page name in at least one language');
      return;
    }

    try {
      setIsSaving(true);
      const updatedPage: CustomPage = {
        ...editingPage,
        updatedAt: new Date().toISOString()
      };
      await onSave(updatedPage);
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error saving page. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const currentTranslation = editingPage.translations[editingLang];
  const layoutBlocks = currentTranslation.layoutBlocks;

  return (
    <div className="space-y-6">
      <button
        onClick={() => setEditingPage(null)}
        className="flex items-center text-gray-500 hover:text-gray-800 font-bold"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Pages
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {currentCustomPages.find(p => p.id === editingPage.id) ? 'Edit' : 'New'} Custom Page
            </h2>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setEditingLang('en')}
                className={`px-3 py-1 rounded-lg text-sm font-bold transition-colors ${
                  editingLang === 'en'
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setEditingLang('zh')}
                className={`px-3 py-1 rounded-lg text-sm font-bold transition-colors ${
                  editingLang === 'zh'
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                繁體中文
              </button>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-brand-blue text-white font-bold hover:bg-blue-600 shadow-sm transition-transform hover:scale-105 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Page'}
          </button>
        </div>

        <div className="space-y-6">
          {/* Slug (shared across languages) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Slug (URL) <span className="text-gray-400 font-normal">(same for all languages)</span>
            </label>
            <input
              value={editingPage.slug}
              onChange={(e) =>
                setEditingPage({
                  ...editingPage,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                })
              }
              className="w-full border rounded-xl p-3 font-mono text-sm focus:ring-2 focus:ring-brand-blue outline-none"
              placeholder="page-slug"
            />
            <p className="text-xs text-gray-500 mt-1">URL will be: /{editingPage.slug || 'page-slug'}</p>
          </div>

          {/* Page Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Page Name ({editingLang === 'en' ? 'English' : '中文'})
            </label>
            <input
              value={currentTranslation.name}
              onChange={(e) =>
                setEditingPage({
                  ...editingPage,
                  translations: {
                    ...editingPage.translations,
                    [editingLang]: {
                      ...currentTranslation,
                      name: e.target.value
                    }
                  }
                })
              }
              className="w-full border rounded-xl p-3 text-lg font-bold focus:ring-2 focus:ring-brand-blue outline-none"
              placeholder="Enter page name..."
            />
          </div>

          {/* Content Editor - Toggle between RichTextEditor and LayoutBuilder */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-gray-700">
                Content ({editingLang === 'en' ? 'English' : '中文'})
              </label>
              <button
                onClick={() => {
                  const useLayout = !layoutBlocks;
                  setEditingPage({
                    ...editingPage,
                    translations: {
                      ...editingPage.translations,
                      [editingLang]: {
                        ...currentTranslation,
                        layoutBlocks: useLayout ? [] : undefined,
                        content: useLayout ? '' : (currentTranslation.content || '')
                      }
                    }
                  });
                }}
                className={`text-xs px-3 py-1 rounded-lg font-bold transition-colors ${
                  layoutBlocks !== undefined
                    ? 'bg-brand-purple text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {layoutBlocks !== undefined ? 'Using Layout Builder' : 'Switch to Layout Builder'}
              </button>
            </div>

            {layoutBlocks !== undefined ? (
              <LayoutBuilder
                blocks={layoutBlocks || []}
                onChange={(blocks) => {
                  // Convert layout blocks to HTML
                  const html = blocks
                    .map(block => {
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
                    })
                    .join('');

                  setEditingPage({
                    ...editingPage,
                    translations: {
                      ...editingPage.translations,
                      [editingLang]: {
                        ...currentTranslation,
                        layoutBlocks: blocks,
                        content: html
                      }
                    }
                  });
                }}
              />
            ) : (
              <RichTextEditor
                key={`${editingPage.id}-${editingLang}`}
                initialValue={currentTranslation.content || ''}
                onChange={(html) =>
                  setEditingPage({
                    ...editingPage,
                    translations: {
                      ...editingPage.translations,
                      [editingLang]: {
                        ...currentTranslation,
                        content: html
                      }
                    }
                  })
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPageEditor;