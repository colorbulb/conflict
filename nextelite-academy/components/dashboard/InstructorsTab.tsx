import React, { useState } from 'react';
import { Instructor } from '../../types';
import { Plus, Edit } from 'lucide-react';

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
      bio: ''
    };
    setEditingInstructor(newInstructor);
  };

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

      {/* TODO: Add instructor editor modal when editingInstructor is not null */}
      {/* Extract the full instructor editor from old CMSDashboard.tsx */}
      {editingInstructor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-6">
                {instructors.find(i => i.id === editingInstructor.id) ? 'Edit' : 'New'} Instructor
              </h3>
              <p className="text-gray-500 mb-4">
                Extract full instructor editor from old CMSDashboard.tsx
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setEditingInstructor(null)}
                  className="px-6 py-2 rounded-full border border-gray-300 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onUpdateInstructor(editingInstructor);
                    setEditingInstructor(null);
                  }}
                  className="px-6 py-2 rounded-full bg-brand-blue text-white font-bold hover:bg-blue-600"
                >
                  Save Instructor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorsTab;
