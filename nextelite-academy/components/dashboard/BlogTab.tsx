import React, { useState } from 'react';
import { BlogPost } from '../../types';
import { Plus, Edit, Trash2, Save, ArrowLeft } from 'lucide-react';
import RichTextEditor from '../RichTextEditor';
import LayoutBuilder, { LayoutBlock } from './LayoutBuilder';

interface BlogTabProps {
  blogPosts: BlogPost[];
  lookupLists: { ageGroups: string[]; courseCategories: string[]; blogCategories: string[] };
  onUpdateBlog?: (posts: BlogPost[]) => void;
}

const BlogTab: React.FC<BlogTabProps> = ({ blogPosts, lookupLists, onUpdateBlog }) => {
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const createNewPost = () => {
    const newPost: BlogPost = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Blog Post',
      excerpt: '',
      content: '',
      date: new Date().toISOString(),
      coverImage: '',
      tags: [],
      category: lookupLists.blogCategories?.[0] || 'General'
    };
    setEditingPost(newPost);
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Delete this blog post?')) {
      const newPosts = blogPosts.filter(p => p.id !== id);
      if (onUpdateBlog) onUpdateBlog(newPosts);
    }
  };

  const handleSavePost = () => {
    if (!editingPost) return;
    
    const exists = blogPosts.find(p => p.id === editingPost.id);
    const newPosts = exists
      ? blogPosts.map(p => p.id === editingPost.id ? editingPost : p)
      : [...blogPosts, editingPost];
    
    if (onUpdateBlog) onUpdateBlog(newPosts);
    setEditingPost(null);
  };

  // If editing a post, show the editor
  if (editingPost) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setEditingPost(null)}
          className="flex items-center text-gray-500 hover:text-gray-800 font-bold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog Posts
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {blogPosts.find(p => p.id === editingPost.id) ? 'Edit' : 'New'} Blog Post
            </h2>
            <button
              onClick={handleSavePost}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-brand-blue text-white font-bold hover:bg-blue-600 shadow-sm transition-transform hover:scale-105"
            >
              <Save className="w-4 h-4" /> Save Post
            </button>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
              <input
                value={editingPost.title}
                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                className="w-full border rounded-xl p-3 text-lg font-bold focus:ring-2 focus:ring-brand-blue outline-none"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Excerpt</label>
              <textarea
                value={editingPost.excerpt}
                onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none"
                rows={2}
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Cover Image URL</label>
              <input
                value={editingPost.coverImage}
                onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
              <select
                value={editingPost.category || ''}
                onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none"
              >
                {lookupLists.blogCategories?.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Content Editor - Toggle between RichTextEditor and LayoutBuilder */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700">Content</label>
                <button
                  onClick={() => {
                    const useLayout = !editingPost.layoutBlocks;
                    setEditingPost({
                      ...editingPost,
                      layoutBlocks: useLayout ? [] : undefined,
                      content: useLayout ? '' : (editingPost.content || '')
                    });
                  }}
                  className={`text-xs px-3 py-1 rounded-lg font-bold transition-colors ${
                    editingPost.layoutBlocks !== undefined
                      ? 'bg-brand-purple text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {editingPost.layoutBlocks !== undefined ? 'Using Layout Builder' : 'Switch to Layout Builder'}
                </button>
              </div>

              {editingPost.layoutBlocks !== undefined ? (
                <LayoutBuilder
                  blocks={editingPost.layoutBlocks || []}
                  onChange={(blocks) => {
                    // Convert layout blocks to HTML
                    const html = blocks.map(block => {
                      if (block.type === 'text-image') {
                        return `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center my-6">
                          <div class="prose prose-lg max-w-none">${block.text.replace(/\n/g, '<br>')}</div>
                          ${block.imageUrl ? `<div class="rounded-lg overflow-hidden"><img src="${block.imageUrl}" alt="" class="w-full h-auto object-cover responsive-image" /></div>` : ''}
                        </div>`;
                      } else if (block.type === 'image-text') {
                        return `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center my-6">
                          ${block.imageUrl ? `<div class="rounded-lg overflow-hidden"><img src="${block.imageUrl}" alt="" class="w-full h-auto object-cover responsive-image" /></div>` : ''}
                          <div class="prose prose-lg max-w-none">${block.text.replace(/\n/g, '<br>')}</div>
                        </div>`;
                      } else if (block.type === 'image-text-stack') {
                        return `<div class="image-text-stack">
                          ${block.imageUrl ? `<div class="image-container"><img src="${block.imageUrl}" alt="" class="w-full h-auto object-cover responsive-image" /></div>` : ''}
                          <div class="text-container prose prose-lg max-w-none">${block.text.replace(/\n/g, '<br>')}</div>
                        </div>`;
                      } else if (block.type === 'image-carousel') {
                        const images = block.images || [];
                        if (images.length === 0) return '';
                        return `<div class="my-6">
                          <div class="flex gap-4 overflow-x-auto pb-4">
                            ${images.map(img => `<div class="flex-shrink-0 w-64 h-64 rounded-lg overflow-hidden"><img src="${img}" alt="" class="w-full h-full object-cover responsive-image" /></div>`).join('')}
                          </div>
                        </div>`;
                      } else {
                        return `<div class="prose prose-lg max-w-none my-6">${block.text.replace(/\n/g, '<br>')}</div>`;
                      }
                    }).join('');

                    setEditingPost({
                      ...editingPost,
                      layoutBlocks: blocks,
                      content: html
                    });
                  }}
                />
              ) : (
                <RichTextEditor
                  key={editingPost.id}
                  initialValue={editingPost.content}
                  onChange={(html) => setEditingPost({ ...editingPost, content: html })}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-end">
        <button
          onClick={createNewPost}
          className="bg-brand-blue text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all"
        >
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
                <button
                  onClick={() => setEditingPost(post)}
                  className="text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blogPosts.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-gray-200 text-center">
          <p className="text-gray-400 mb-4">No blog posts yet</p>
          <button
            onClick={createNewPost}
            className="text-brand-blue hover:text-brand-purple font-bold"
          >
            Create your first blog post
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogTab;