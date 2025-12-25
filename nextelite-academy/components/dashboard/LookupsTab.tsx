import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, List as ListIcon } from 'lucide-react';

interface LookupsTabProps {
  lookupLists: { ageGroups: string[]; courseCategories: string[]; blogCategories: string[]; difficulties: string[] };
  onUpdateLookupLists: (lists: { ageGroups: string[]; courseCategories: string[]; blogCategories: string[]; difficulties: string[] }) => void;
}

const LookupsTab: React.FC<LookupsTabProps> = ({ lookupLists, onUpdateLookupLists }) => {
  const [localLookupLists, setLocalLookupLists] = useState(lookupLists);

  useEffect(() => {
    setLocalLookupLists(lookupLists);
  }, [lookupLists]);

  const handleSaveLookupLists = () => {
    onUpdateLookupLists(localLookupLists);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <div className="bg-brand-blue p-1.5 rounded-lg text-white">
              <ListIcon className="w-5 h-5" />
            </div>
            Lookup Lists Management
          </h3>
          <button
            onClick={handleSaveLookupLists}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-brand-blue text-white font-bold hover:bg-blue-600 shadow-sm transition-transform hover:scale-105"
          >
            <Save className="w-4 h-4" /> Save Lists
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Age Groups */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-800">Age Groups</h4>
              <button
                onClick={() => {
                  const newItem = prompt('Enter new age group:');
                  if (newItem && newItem.trim()) {
                    setLocalLookupLists({
                      ...localLookupLists,
                      ageGroups: [...localLookupLists.ageGroups, newItem.trim()]
                    });
                  }
                }}
                className="text-brand-blue hover:text-brand-purple font-bold text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {localLookupLists.ageGroups.map((age, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200"
                >
                  <input
                    type="text"
                    value={age}
                    onChange={(e) => {
                      const newAgeGroups = [...localLookupLists.ageGroups];
                      newAgeGroups[idx] = e.target.value;
                      setLocalLookupLists({
                        ...localLookupLists,
                        ageGroups: newAgeGroups
                      });
                    }}
                    className="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none bg-white"
                  />
                  <button
                    onClick={() => {
                      if (confirm('Delete this age group?')) {
                        setLocalLookupLists({
                          ...localLookupLists,
                          ageGroups: localLookupLists.ageGroups.filter((_, i) => i !== idx)
                        });
                      }
                    }}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Course Categories */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-800">Course Categories</h4>
              <button
                onClick={() => {
                  const newItem = prompt('Enter new category:');
                  if (newItem && newItem.trim()) {
                    setLocalLookupLists({
                      ...localLookupLists,
                      courseCategories: [...localLookupLists.courseCategories, newItem.trim()]
                    });
                  }
                }}
                className="text-brand-blue hover:text-brand-purple font-bold text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {localLookupLists.courseCategories.map((cat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200"
                >
                  <input
                    type="text"
                    value={cat}
                    onChange={(e) => {
                      const newCategories = [...localLookupLists.courseCategories];
                      newCategories[idx] = e.target.value;
                      setLocalLookupLists({
                        ...localLookupLists,
                        courseCategories: newCategories
                      });
                    }}
                    className="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none bg-white"
                  />
                  <button
                    onClick={() => {
                      if (confirm('Delete this category?')) {
                        setLocalLookupLists({
                          ...localLookupLists,
                          courseCategories: localLookupLists.courseCategories.filter(
                            (_, i) => i !== idx
                          )
                        });
                      }
                    }}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Blog Categories */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-800">Blog Categories</h4>
              <button
                onClick={() => {
                  const newItem = prompt('Enter new blog category:');
                  if (newItem && newItem.trim()) {
                    setLocalLookupLists({
                      ...localLookupLists,
                      blogCategories: [
                        ...(localLookupLists.blogCategories || []),
                        newItem.trim()
                      ]
                    });
                  }
                }}
                className="text-brand-blue hover:text-brand-purple font-bold text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {(localLookupLists.blogCategories || []).map((cat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200"
                >
                  <input
                    type="text"
                    value={cat}
                    onChange={(e) => {
                      const newCategories = [...(localLookupLists.blogCategories || [])];
                      newCategories[idx] = e.target.value;
                      setLocalLookupLists({
                        ...localLookupLists,
                        blogCategories: newCategories
                      });
                    }}
                    className="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none bg-white"
                  />
                  <button
                    onClick={() => {
                      if (confirm('Delete this category?')) {
                        setLocalLookupLists({
                          ...localLookupLists,
                          blogCategories: (localLookupLists.blogCategories || []).filter(
                            (_, i) => i !== idx
                          )
                        });
                      }
                    }}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulties */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-800">Difficulties</h4>
              <button
                onClick={() => {
                  const newItem = prompt('Enter new difficulty level:');
                  if (newItem && newItem.trim()) {
                    setLocalLookupLists({
                      ...localLookupLists,
                      difficulties: [
                        ...(localLookupLists.difficulties || []),
                        newItem.trim()
                      ]
                    });
                  }
                }}
                className="text-brand-blue hover:text-brand-purple font-bold text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {(localLookupLists.difficulties || []).map((diff, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200"
                >
                  <input
                    type="text"
                    value={diff}
                    onChange={(e) => {
                      const newDifficulties = [...(localLookupLists.difficulties || [])];
                      newDifficulties[idx] = e.target.value;
                      setLocalLookupLists({
                        ...localLookupLists,
                        difficulties: newDifficulties
                      });
                    }}
                    className="flex-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-blue outline-none bg-white"
                  />
                  <button
                    onClick={() => {
                      if (confirm('Delete this difficulty level?')) {
                        setLocalLookupLists({
                          ...localLookupLists,
                          difficulties: (localLookupLists.difficulties || []).filter(
                            (_, i) => i !== idx
                          )
                        });
                      }
                    }}
                    className="text-red-400 hover:text-red-600 p-1"
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
  );
};

export default LookupsTab;