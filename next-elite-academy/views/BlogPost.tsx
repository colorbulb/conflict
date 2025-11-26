import React from 'react';
import { BlogPost, Page } from '../types';
import { ArrowLeft, Calendar, User, Facebook, Twitter, Linkedin } from 'lucide-react';

interface BlogPostProps {
  post: BlogPost;
  onNavigate: (page: Page) => void;
}

export const BlogPostView: React.FC<BlogPostProps> = ({ post, onNavigate }) => {
  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => onNavigate('blog')}
            className="flex items-center text-slate-500 hover:text-primary transition text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Blog
          </button>
        </div>
      </div>

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
          
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm text-slate-500 mb-6">
              <span className="bg-indigo-50 text-primary px-3 py-1 rounded-full font-bold uppercase text-xs tracking-wider">
                {post.category}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} /> {post.date}
              </span>
              <span className="flex items-center gap-2">
                <User size={16} /> {post.author}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
              {post.title}
            </h1>

            <div 
              className="prose prose-lg prose-slate max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <hr className="border-slate-100 my-8" />

            <div className="flex justify-between items-center">
              <p className="font-bold text-slate-900">Share this article:</p>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition">
                  <Facebook size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition">
                  <Twitter size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white transition">
                  <Linkedin size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};