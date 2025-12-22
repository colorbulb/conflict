// Stub file - Extract content from CMSDashboard.tsx lines ~3033-3062
import React, { useState } from 'react';
import { BlogPost } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface BlogTabProps {
  blogPosts: BlogPost[];
  lookupLists: { ageGroups: string[]; courseCategories: string[]; blogCategories: string[] };
  onUpdateBlog?: (posts: BlogPost[]) => void;
}

const BlogTab: React.FC<BlogTabProps> = ({ blogPosts, lookupLists, onUpdateBlog }) => {
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // TODO: Extract blog handlers from CMSDashboard
  // - createNewPost
  // - handleDeletePost
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Blog Management</h2>
        
        {activeTab === 'blog' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-end">
                    <button onClick={createNewPost} className="bg-brand-blue text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all">
                        <Plus className="w-5 h-5" /> New Article
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blogPosts.map(post => (
                        <div key={post.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-4 group hover:shadow-xl transition-all">
                            <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                                <img src={post.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col">
                                <div className="flex justify-between items-start mb-1">
                                   <h3 className="font-bold text-gray-800 truncate pr-2 flex-1">{post.title}</h3>
                                </div>
                                <p className="text-xs text-gray-400 mb-2">{new Date(post.date).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-2 flex-1">{post.excerpt}</p>
                                <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button onClick={() => setEditingPost(post)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                                       <button onClick={() => handleDeletePost(post.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        
        <p className="text-gray-600">
          Extract blog content from CMSDashboard.tsx lines ~3033-3062
        </p>
      </div>
    </div>
  );
};

export default BlogTab;
