import React, { useState } from 'react';
import { Instructor, PageContent, Language } from '../../types';
import { useLanguage } from '../LanguageContext';
import { Plus, Edit } from 'lucide-react';
import InstructorEditor from './editors/InstructorEditor';
interface InstructorsTabProps {
  instructors: Instructor[];
  onUpdateInstructor: (instructor: Instructor) => void;
  pageContent: PageContent;
  onUpdatePageContent: (content: PageContent) => void;
}

const InstructorsTab: React.FC<InstructorsTabProps> = ({ instructors, onUpdateInstructor, pageContent: rawPageContent, onUpdatePageContent }) => {
  const { language } = useLanguage();
  // Defensive fallback for undefined pageContent
  const pageContent = rawPageContent || {};
  // Local state for instructor section toggle
  const [showInstructors, setShowInstructors] = useState<boolean>(pageContent.showInstructors !== false);

  // Sync local state if pageContent changes
  React.useEffect(() => {
    setShowInstructors(pageContent.showInstructors !== false);
  }, [pageContent.showInstructors]);

  const handleToggleShowInstructors = (checked: boolean) => {
    setShowInstructors(checked);
    onUpdatePageContent({
      ...pageContent,
      showInstructors: checked
    });
  };
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

  const handleAddInstructor = () => {
    const newInstructor: Instructor = {
      id: Math.random().toString(36).substr(2, 9),
      en: {
        name: 'New Instructor',
        role: '',
        bio: ''
      },
      zh: {
        name: '新講師',
        role: '',
        bio: ''
      },
      imageUrl: '',
      socialMedia: {},
      certifications: []
    };
    setEditingInstructor(newInstructor);
  };

  // If editing, show the InstructorEditor component
  if (editingInstructor) {
    return (
      <InstructorEditor
        instructor={editingInstructor}
        onSave={(instructor) => {
          onUpdateInstructor(instructor);
          setEditingInstructor(null);
        }}
        onCancel={() => setEditingInstructor(null)}
      />
    );
  }

  // Otherwise show the instructors list
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Instructor Section Toggle (moved from HomepageTab) */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <label className="text-lg font-bold text-gray-800 flex-1">Show Instructor Section</label>
        <input
          type="checkbox"
          checked={!!showInstructors}
          onChange={e => handleToggleShowInstructors(e.target.checked)}
          className="w-6 h-6 accent-brand-blue"
        />
      </div>

      {instructors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map(inst => {
            const langInst = { ...inst, ...inst[language as Language] };
            return (
              <div
                key={inst.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-lg transition-shadow"
              >
                {langInst.imageUrl ? (
                  <img
                    src={langInst.imageUrl}
                    alt={langInst.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-brand-yellow"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-brand-yellow text-gray-400">
                    <span className="text-xs">No Image</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 truncate">{langInst.name}</h3>
                  <p className="text-sm text-brand-blue font-medium truncate">{langInst.role}</p>
                </div>
                <button
                  onClick={() => setEditingInstructor(inst)}
                  className="text-gray-400 hover:text-brand-blue p-2"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-gray-200 text-center">
          <p className="text-gray-400 mb-4">No instructors yet</p>
          <button
            onClick={handleAddInstructor}
            className="text-brand-blue hover:text-brand-purple font-bold"
          >
            Add your first instructor
          </button>
        </div>
      )}

      <button
        onClick={handleAddInstructor}
        className="w-full bg-brand-blue text-white py-3 px-6 rounded-xl font-bold hover:bg-brand-purple transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add New Instructor
      </button>
    </div>
  );
};

export default InstructorsTab;