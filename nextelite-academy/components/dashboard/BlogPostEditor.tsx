import React from 'react';
import { BlogPost } from '../../types';

interface BlogPostEditorProps {
  editingPost: BlogPost | null;
  setEditingPost: (post: BlogPost | null) => void;
  onSave: (post: BlogPost) => void;
}

const BlogPostEditor: React.FC<BlogPostEditorProps> = ({ editingPost, setEditingPost, onSave }) => {
  if (!editingPost) return null;
  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* ...existing code for blog post editing UI... */}
      <button onClick={() => setEditingPost(null)}>Cancel</button>
      <button onClick={() => onSave(editingPost)}>Save</button>
    </div>
  );
};

export default BlogPostEditor;
