import React from 'react';
import { PageContent } from '../../../types';
import LayoutBuilder from '../LayoutBuilder';
import RichTextEditor from '../../RichTextEditor';

interface AboutSectionProps {
  pageContent: PageContent;
  onUpdate: (pageContent: PageContent) => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ pageContent, onUpdate }) => {
  return (
    <div className="border-t border-gray-200 pt-8">
      <h4 className="text-lg font-bold text-gray-800 mb-4">About Us Section</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">About Heading</label>
          <input
            value={pageContent.about?.heading || ''}
            onChange={(e) =>
              onUpdate({
                ...pageContent,
                about: {
                  ...(pageContent.about || { subheading: '', content: '' }),
                  heading: e.target.value
                }
              })
            }
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">About Subheading</label>
          <input
            value={pageContent.about?.subheading || ''}
            onChange={(e) =>
              onUpdate({
                ...pageContent,
                about: {
                  ...(pageContent.about || { heading: '', content: '' }),
                  subheading: e.target.value
                }
              })
            }
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
          />
        </div>
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-gray-700">About Content</label>
            <button
              onClick={() => {
                const useLayout = !pageContent.about?.layoutBlocks;
                onUpdate({
                  ...pageContent,
                  about: {
                    ...(pageContent.about || { heading: '', subheading: '', content: '' }),
                    layoutBlocks: useLayout ? [] : undefined,
                    content: useLayout ? '' : (pageContent.about?.content || '')
                  }
                });
              }}
              className={`text-xs px-3 py-1 rounded-lg font-bold transition-colors ${
                pageContent.about?.layoutBlocks !== undefined
                  ? 'bg-brand-purple text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {pageContent.about?.layoutBlocks !== undefined
                ? 'Using Layout Builder'
                : 'Switch to Layout Builder'}
            </button>
          </div>

          {pageContent.about?.layoutBlocks !== undefined ? (
            <LayoutBuilder
              blocks={pageContent.about.layoutBlocks || []}
              onChange={(blocks) => {
                // Convert layout blocks to HTML
                const html = blocks
                  .map((block) => {
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
                          ${images.map((img) => `<div class="flex-shrink-0 w-64 h-64 rounded-lg overflow-hidden"><img src="${img}" alt="" class="w-full h-full object-cover responsive-image" /></div>`).join('')}
                        </div>
                      </div>`;
                    } else {
                      return `<div class="prose prose-lg max-w-none my-6">${block.text.replace(/\n/g, '<br>')}</div>`;
                    }
                  })
                  .join('');

                onUpdate({
                  ...pageContent,
                  about: {
                    ...(pageContent.about || { heading: '', subheading: '' }),
                    layoutBlocks: blocks,
                    content: html
                  }
                });
              }}
            />
          ) : (
            <RichTextEditor
              initialValue={pageContent.about?.content || ''}
              onChange={(html) =>
                onUpdate({
                  ...pageContent,
                  about: {
                    ...(pageContent.about || { heading: '', subheading: '' }),
                    content: html
                  }
                })
              }
              placeholder="Enter about us content..."
            />
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-1">About Image URL</label>
          <input
            type="text"
            value={pageContent.about?.imageUrl || ''}
            onChange={(e) =>
              onUpdate({
                ...pageContent,
                about: {
                  ...(pageContent.about || { heading: '', subheading: '', content: '' }),
                  imageUrl: e.target.value
                }
              })
            }
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white"
            placeholder="Optional image URL"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutSection;