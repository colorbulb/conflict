import React from 'react';
import { ArrowLeft, Calendar, User, Facebook, Twitter, Linkedin } from 'lucide-react';

export const BlogPostView = ({ post, onNavigate }) => {
  return (
    <div className="w-full bg-surface min-h-screen pb-20">
      {/* Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => onNavigate('blog')}
            className="flex items-center text-slate-500 hover:text-primary transition text-sm font-bold"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Blog
          </button>
        </div>
      </div>

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-64 md:h-96 w-full relative">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                <span className="bg-primary text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                    {post.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4 shadow-sm">
                    {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-200 font-medium">
                    <span className="flex items-center gap-2">
                        <Calendar size={16} /> {post.date}
                    </span>
                    <span className="flex items-center gap-2">
                        <User size={16} /> {post.author}
                    </span>
                </div>
            </div>
          </div>
          
          <div className="p-8 md:p-12">
            <div 
              className="prose prose-lg prose-slate max-w-none mb-16 prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="font-bold text-slate-900">Share this article:</p>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition">
                  <Facebook size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition">
                  <Twitter size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition">
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