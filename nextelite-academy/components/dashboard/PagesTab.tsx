import React, { useState, useEffect } from 'react';
import { CustomPage } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import CustomPageEditor from './CustomPageEditor';

interface PagesTabProps {
  customPages: CustomPage[];
  onUpdateCustomPages?: (pages: CustomPage[]) => Promise<void>;
}

const PagesTab: React.FC<PagesTabProps> = ({ customPages, onUpdateCustomPages }) => {
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [localCustomPages, setLocalCustomPages] = useState<CustomPage[]>(customPages || []);
  
  useEffect(() => {
    setLocalCustomPages(customPages || []);
  }, [customPages]);

  const createNewPage = () => {
    const newPage: CustomPage = {
      id: Math.random().toString(36).substr(2, 9),
      slug: '',
      translations: {
        en: { name: 'New Page', content: '' },
        zh: { name: '新頁面', content: '' }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEditingPage(newPage);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {!editingPage && (
        <>
          <div className="flex justify-end">
            <button
              onClick={createNewPage}
              className="bg-brand-blue text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all"
            >
              <Plus className="w-5 h-5" /> New Custom Page
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {localCustomPages.map(page => (
              <div
                key={page.id}
                className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-800 text-lg">
                        {page.translations.en.name}
                      </h3>
                      {page.translations.zh.name && (
                        <span className="text-gray-500 text-sm">
                          / {page.translations.zh.name}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 font-mono mb-2">
                      /{page.slug}
                    </p>
                    <p className="text-xs text-gray-400">
                      Updated: {new Date(page.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingPage(page)}
                      className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <a
                      href={`/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:bg-green-50 p-1.5 rounded-lg transition-colors flex items-center"
                      title="Open public page"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7m0 0v7m0-7L10 14m-7 7h7a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z" />
                      </svg>
                    </a>
                    <button
                      onClick={async () => {
                        if (confirm('Delete this page?')) {
                          const newPages = localCustomPages.filter(p => p.id !== page.id);
                          setLocalCustomPages(newPages);
                          if (onUpdateCustomPages) await onUpdateCustomPages(newPages);
                        }
                      }}
                      className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {localCustomPages.length === 0 && (
            <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-gray-200 text-center">
              <p className="text-gray-400 mb-4">No custom pages yet</p>
              <button
                onClick={createNewPage}
                className="text-brand-blue hover:text-brand-purple font-bold"
              >
                Create your first page
              </button>
            </div>
          )}
        </>
      )}

      {editingPage && (
        <CustomPageEditor
          editingPage={editingPage}
          setEditingPage={setEditingPage}
          onSave={async (page) => {
            const isNew = !localCustomPages.find(p => p.id === page.id);
            let newPages = [...localCustomPages];
            if (isNew) {
              newPages.push(page);
            } else {
              newPages = newPages.map(p => p.id === page.id ? page : p);
            }
            setLocalCustomPages(newPages);
            if (onUpdateCustomPages) {
              await onUpdateCustomPages(newPages);
            }
            setEditingPage(null);
          }}
          currentCustomPages={localCustomPages}
        />
      )}
    </div>
  );
};

export default PagesTab;
