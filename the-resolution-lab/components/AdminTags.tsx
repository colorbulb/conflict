import React, { useEffect, useState } from 'react';
import { getResolutionTags, setResolutionTags, ResolutionTagKind } from '../services/tagService';
import { FEELING_TAGS, NEED_TAGS, CATEGORY_TAGS } from '../constants';

type Tab = 'feelings' | 'needs' | 'categories';

const fallbackByTab: Record<Tab, string[]> = {
  feelings: FEELING_TAGS,
  needs: NEED_TAGS,
  categories: CATEGORY_TAGS
};

const AdminTags: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('feelings');
  const [values, setValues] = useState<Record<Tab, string[]>>({
    feelings: FEELING_TAGS,
    needs: NEED_TAGS,
    categories: CATEGORY_TAGS
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadAll = async () => {
      try {
        setLoading(true);
        const [feelings, needs, categories] = await Promise.all([
          getResolutionTags('feelings'),
          getResolutionTags('needs'),
          getResolutionTags('categories')
        ]);

        if (cancelled) return;

        setValues({
          feelings: feelings?.length ? feelings : FEELING_TAGS,
          needs: needs?.length ? needs : NEED_TAGS,
          categories: categories?.length ? categories : CATEGORY_TAGS
        });
      } catch (e) {
        if (!cancelled) {
          setError('Failed to load tags. Using defaults.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAll();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleAdd = (tab: Tab, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setValues(prev => ({
      ...prev,
      [tab]: prev[tab].includes(trimmed) ? prev[tab] : [...prev[tab], trimmed]
    }));
  };

  const handleRemove = (tab: Tab, value: string) => {
    setValues(prev => ({
      ...prev,
      [tab]: prev[tab].filter(v => v !== value)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const entries: [Tab, ResolutionTagKind][] = [
        ['feelings', 'feelings'],
        ['needs', 'needs'],
        ['categories', 'categories']
      ];
      await Promise.all(
        entries.map(([tab, kind]) => setResolutionTags(kind, values[tab]))
      );
      setMessage('Tags saved to Firestore.');
    } catch (e) {
      setError('Failed to save tags. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: Tab; label: string; description: string }[] = [
    { id: 'feelings', label: 'Feelings', description: 'Quick chips for “I feel...”' },
    { id: 'needs', label: 'Needs', description: 'Suggestions for “Because I need...”' },
    { id: 'categories', label: 'Categories', description: 'High level conflict topics.' }
  ];

  const [input, setInput] = useState<Record<Tab, string>>({
    feelings: '',
    needs: '',
    categories: ''
  });

  const currentValues = values[activeTab];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4 bg-slate-50">
      <div className="w-full max-w-4xl mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Tag Admin Console</h1>
        <p className="text-sm text-slate-500">
          Manage the chips that show up in the Resolution Lab flow.
        </p>
      </div>

      <main className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 flex flex-col">
        <div className="flex border-b border-slate-200 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-sm text-slate-500">Loading tags...</p>
          ) : (
            <>
              <p className="text-sm text-slate-500">
                {tabs.find(t => t.id === activeTab)?.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {currentValues.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleRemove(activeTab, tag)}
                    className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:bg-rose-50 hover:border-rose-200"
                  >
                    {tag} <span className="ml-1 text-rose-400">×</span>
                  </button>
                ))}
                {currentValues.length === 0 && (
                  <span className="text-xs text-slate-400">
                    No tags yet. Start by adding a few below.
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  value={input[activeTab]}
                  onChange={(e) =>
                    setInput(prev => ({ ...prev, [activeTab]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAdd(activeTab, input[activeTab]);
                      setInput(prev => ({ ...prev, [activeTab]: '' }));
                    }
                  }}
                  placeholder="Type a new tag and press Enter"
                  className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  onClick={() => {
                    handleAdd(activeTab, input[activeTab]);
                    setInput(prev => ({ ...prev, [activeTab]: '' }));
                  }}
                  className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50"
                  disabled={!input[activeTab].trim()}
                >
                  Add
                </button>
              </div>
            </>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="space-y-1">
              {error && <p className="text-xs text-rose-600">{error}</p>}
              {message && <p className="text-xs text-emerald-600">{message}</p>}
              {!error && !message && !loading && (
                <p className="text-xs text-slate-400">
                  Defaults come from code; Firestore overrides them when present.
                </p>
              )}
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50"
              disabled={saving || loading}
            >
              {saving ? 'Saving…' : 'Save All Tags'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminTags;


