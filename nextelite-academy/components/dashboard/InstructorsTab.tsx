// Stub file - Extract content from CMSDashboard.tsx lines ~2596-2619
import React, { useState } from 'react';
import { Instructor } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface InstructorsTabProps {
  instructors: Instructor[];
  onUpdateInstructor: (instructor: Instructor) => void;
}

const InstructorsTab: React.FC<InstructorsTabProps> = ({ instructors, onUpdateInstructor }) => {
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

  // TODO: Extract instructor handlers from CMSDashboard
  // - createNewInstructor
  // - handleDeleteInstructor
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Instructors Management</h2>
        
        {activeTab === 'instructors' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-end">
                    <button onClick={handleAddInstructor} className="bg-brand-blue text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all">
                        <Plus className="w-5 h-5" /> Add Instructor
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {instructors.map(inst => (
                        <div key={inst.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-lg transition-shadow">
                            <img src={inst.imageUrl} alt={inst.name} className="w-16 h-16 rounded-full object-cover border-2 border-brand-yellow" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-800 truncate">{inst.name}</h3>
                                <p className="text-sm text-brand-blue font-medium truncate">{inst.role}</p>
                            </div>
                            <button onClick={() => setEditingInstructor(inst)} className="text-gray-400 hover:text-brand-blue p-2">
                                <Edit className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
             </div>
        )}
        
        <p className="text-gray-600">
          Extract instructors content from CMSDashboard.tsx lines ~2596-2619
        </p>
      </div>
    </div>
  );
};

export default InstructorsTab;
