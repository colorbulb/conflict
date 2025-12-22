import React from 'react';
import { Instructor } from '../../types';

interface InstructorEditorProps {
  editingInstructor: Instructor | null;
  setEditingInstructor: (instructor: Instructor | null) => void;
  onSave: (instructor: Instructor) => void;
}

const InstructorEditor: React.FC<InstructorEditorProps> = ({ editingInstructor, setEditingInstructor, onSave }) => {
  if (!editingInstructor) return null;
  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* ...existing code for instructor editing UI... */}
      <button onClick={() => setEditingInstructor(null)}>Cancel</button>
      <button onClick={() => onSave(editingInstructor)}>Save</button>
    </div>
  );
};

export default InstructorEditor;
