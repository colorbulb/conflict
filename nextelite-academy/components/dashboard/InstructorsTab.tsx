import React, { useState } from 'react';
import { Instructor } from '../../types';
import { Plus, Edit } from 'lucide-react';
import InstructorEditor from './editors/InstructorEditor';

interface InstructorsTabProps {
  instructors: Instructor[];
  onUpdateInstructor: (instructor: Instructor) => void;
}

const InstructorsTab: React.FC<InstructorsTabProps> = ({ instructors, onUpdateInstructor }) => {
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

  const handleAddInstructor = () => {
    const newInstructor: Instructor = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Instructor',
      role: '',
      imageUrl: '',
      bio: '',
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
      <div className="flex justify-end">
        <button
          onClick={handleAddInstructor}
          className="bg-brand-blue text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all"
        >
          <Plus className="w-5 h-5" /> Add Instructor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map(inst => (
          <div
            key={inst.id}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-lg transition-shadow"
          >
            <img
              src={inst.imageUrl}
              alt={inst.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-brand-yellow"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-800 truncate">{inst.name}</h3>
              <p className="text-sm text-brand-blue font-medium truncate">{inst.role}</p>
            </div>
            <button
              onClick={() => setEditingInstructor(inst)}
              className="text-gray-400 hover:text-brand-blue p-2"
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {instructors.length === 0 && (
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
    </div>
  );
};

export default InstructorsTab;
