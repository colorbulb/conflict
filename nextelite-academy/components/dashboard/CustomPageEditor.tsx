import React from 'react';
import { CustomPage, CustomPageTranslation } from '../../types';

interface CustomPageEditorProps {
  editingPage: CustomPage | null;
  setEditingPage: (page: CustomPage | null) => void;
  onSave: (page: CustomPage) => void;
  currentCustomPages: CustomPage[];
}

const CustomPageEditor: React.FC<CustomPageEditorProps> = ({ editingPage, setEditingPage, onSave, currentCustomPages }) => {
  const [activeLang, setActiveLang] = React.useState<'en' | 'zh'>('en');
  if (!editingPage) return null;
  const translation = editingPage.translations[activeLang];
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
        <label className="block text-sm font-bold text-gray-700 mb-1">Content</label>
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
      </div>
      <div className="flex gap-2 justify-end mt-6">
        <button onClick={() => setEditingPage(null)} className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-bold">Cancel</button>
        <button onClick={() => onSave({ ...editingPage, updatedAt: new Date().toISOString() })} className="px-6 py-2 rounded bg-brand-blue text-white font-bold">Save</button>
      </div>
    </div>
  );
};

export default CustomPageEditor;
