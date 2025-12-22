import React from 'react';
import LayoutBuilder from '../LayoutBuilder';
import { CustomPage, CustomPageTranslation } from '../../types';

interface CustomPageEditorProps {
  editingPage: CustomPage | null;
  setEditingPage: (page: CustomPage | null) => void;
  onSave: (page: CustomPage) => Promise<void>;
  currentCustomPages: CustomPage[];
}

const CustomPageEditor: React.FC<CustomPageEditorProps> = ({ editingPage, setEditingPage, onSave, currentCustomPages }) => {
  const [activeLang, setActiveLang] = React.useState<'en' | 'zh'>('en');
  const [useLayout, setUseLayout] = React.useState<boolean>(false);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  if (!editingPage) return null;
  const translation = editingPage.translations[activeLang];
  React.useEffect(() => {
    setUseLayout(!!translation.layoutBlocks);
  }, [activeLang, editingPage]);
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveLang('en')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${activeLang === 'en' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          English
        </button>
        <button
          onClick={() => setActiveLang('zh')}
          className={`px-4 py-2 rounded-lg font-bold transition-colors ${activeLang === 'zh' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          繁體中文
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-1">Page Name</label>
        <input
          value={translation.name}
          onChange={e => setEditingPage({
            ...editingPage,
            translations: {
              ...editingPage.translations,
              [activeLang]: { ...translation, name: e.target.value }
            }
          })}
          className="w-full border rounded-xl p-3 text-lg font-bold focus:ring-2 focus:ring-brand-blue outline-none"
          placeholder="Enter page name..."
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold text-gray-700 mb-1">Slug (URL)</label>
        <input
          value={editingPage.slug}
          onChange={e => setEditingPage({ ...editingPage, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
          className="w-full border rounded-xl p-3 font-mono text-sm focus:ring-2 focus:ring-brand-blue outline-none"
          placeholder="page-slug"
        />
        <p className="text-xs text-gray-500 mt-1">URL will be: /{editingPage.slug || 'page-slug'}</p>
      </div>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-bold text-gray-700">Content</label>
          <button
            onClick={() => {
              setUseLayout(!useLayout);
              setEditingPage({
                ...editingPage,
                translations: {
                  ...editingPage.translations,
                  [activeLang]: {
                    ...translation,
                    layoutBlocks: !useLayout ? [] : undefined,
                    content: !useLayout ? '' : (translation.content || '')
                  }
                }
              });
            }}
            className={`text-xs px-3 py-1 rounded-lg font-bold transition-colors ${useLayout ? 'bg-brand-purple text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {useLayout ? 'Using Layout Builder' : 'Switch to Layout Builder'}
          </button>
        </div>
        {useLayout ? (
          <LayoutBuilder
            blocks={translation.layoutBlocks || []}
            onChange={blocks => {
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
              setEditingPage({
                ...editingPage,
                translations: {
                  ...editingPage.translations,
                  [activeLang]: {
                    ...translation,
                    layoutBlocks: blocks,
                    content: html
                  }
                }
              });
            }}
          />
        ) : (
          <textarea
            value={translation.content}
            onChange={e => setEditingPage({
              ...editingPage,
              translations: {
                ...editingPage.translations,
                [activeLang]: { ...translation, content: e.target.value }
              }
            })}
            className="w-full border rounded-xl p-3 h-32 text-sm focus:ring-2 focus:ring-brand-blue outline-none"
            placeholder="Enter page content..."
          />
        )}
      </div>
      <div className="flex gap-2 justify-end mt-6">
        <button 
          onClick={() => setEditingPage(null)} 
          className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-bold"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            const pageToSave = { ...editingPage, updatedAt: new Date().toISOString() };
            console.log('[CustomPageEditor] Attempting to save custom page:', pageToSave);
            setIsSaving(true);
            try {
              await onSave(pageToSave);
              console.log('[CustomPageEditor] onSave completed successfully for:', pageToSave.slug || pageToSave.id);
            } catch (error) {
              console.error('[CustomPageEditor] Error in onSave:', error, pageToSave);
              setIsSaving(false);
            }
          }}
          className="px-6 py-2 rounded bg-brand-blue text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            'Save'
          )}
        </button>
      </div>
    </div>
  );
};

export default CustomPageEditor;