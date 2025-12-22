import React from 'react';
import { Course } from '../../types';

interface CourseEditorProps {
  editingCourse: Course | null;
  setEditingCourse: (course: Course | null) => void;
  onSave: (course: Course) => void;
  localLookupLists: any;
}

const CourseEditor: React.FC<CourseEditorProps> = ({ editingCourse, setEditingCourse, onSave, localLookupLists }) => {
  if (!editingCourse) return null;
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* ...existing code for course editing UI... */}
      <button onClick={() => setEditingCourse(null)}>Cancel</button>
      <button onClick={() => onSave(editingCourse)}>Save</button>
    </div>
  );
};

export default CourseEditor;
