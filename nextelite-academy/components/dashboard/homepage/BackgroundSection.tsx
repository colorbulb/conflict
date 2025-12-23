import React, { useState } from 'react';
import { PageContent } from '../../../types';
import { uploadImage } from '../../../firebase/storage';
import { Upload } from 'lucide-react';

interface BackgroundSectionProps {
  pageContent: PageContent;
  onUpdate: (pageContent: PageContent) => void;
}

const BackgroundSection: React.FC<BackgroundSectionProps> = ({ pageContent, onUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleBackgroundUpload = async (
    section: 'hero' | 'programs' | 'mentors' | 'gallery' | 'contact' | 'about',
    files: FileList | null
  ) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      setIsUploading(true);
      const uploaded = await uploadImage(file, 'backgrounds');
      onUpdate({
        ...pageContent,
        backgrounds: {
          ...(pageContent.backgrounds || {}),
          [section]: uploaded.url
        }
      });
      alert("Background uploaded! Don't forget to click \"Save Homepage\" to persist the change.");
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('Error uploading. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const renderBackgroundInput = (
    label: string,
    section: 'hero' | 'programs' | 'mentors' | 'gallery' | 'contact' | 'about',
    placeholder: string
  ) => (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={pageContent.backgrounds?.[section] || ''}
        onChange={(e) =>
          onUpdate({
            ...pageContent,
            backgrounds: {
              ...(pageContent.backgrounds || {}),
              [section]: e.target.value
            }
          })
        }
        className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white text-xs"
        placeholder={placeholder}
      />
      {pageContent.backgrounds?.[section] && (
        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 h-24 bg-gray-100">
          {pageContent.backgrounds[section]!.toLowerCase().endsWith('.mp4') ? (
            <video
              src={pageContent.backgrounds[section]}
              className="w-full h-full object-cover"
              muted
              loop
            />
          ) : (
            <img
              src={pageContent.backgrounds[section]}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>
      )}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
          handleBackgroundUpload(section, e.dataTransfer.files);
        }}
        className="mt-2 text-xs border-2 border-dashed border-gray-300 rounded-xl px-3 py-3 text-gray-500 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
      >
        {isUploading ? 'Uploading...' : 'Drag & drop PNG / JPG / GIF / MP4 here'}
      </div>
      {pageContent.backgrounds?.[section] && (
        <div className="mt-3">
          <label className="block text-xs font-bold text-gray-700 mb-1">Background Sizing</label>
          <select
            value={pageContent.backgroundSizing?.[section] || 'default'}
            onChange={(e) =>
              onUpdate({
                ...pageContent,
                backgroundSizing: {
                  ...(pageContent.backgroundSizing || {}),
                  [section]: e.target.value as 'default' | 'width' | 'height'
                }
              })
            }
            className="w-full border rounded-lg p-2 text-xs bg-white"
          >
            <option value="default">Default (Cover)</option>
            <option value="width">100% Width (Fit by Width)</option>
            <option value="height">100% Height (Fit by Height)</option>
          </select>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <h4 className="text-lg font-bold text-gray-800 mb-4">Section Backgrounds (image / GIF / MP4)</h4>
      <p className="text-xs text-gray-500 mb-4">
        Paste a direct URL or drag & drop a PNG, JPG, GIF, or MP4 file. MP4 backgrounds will play as
        looping, muted videos.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderBackgroundInput(
          'Hero Background URL',
          'hero',
          'https://example.com/hero-bg.png or .gif or .mp4'
        )}
        {renderBackgroundInput(
          'Programs Section Background URL',
          'programs',
          'https://example.com/programs-bg.gif'
        )}
        {renderBackgroundInput(
          'Mentors Section Background URL',
          'mentors',
          'https://example.com/mentors-bg.png'
        )}
        {renderBackgroundInput(
          'Gallery Section Background URL',
          'gallery',
          'https://example.com/gallery-bg.gif'
        )}
        {renderBackgroundInput(
          'Contact Section Background URL',
          'contact',
          'https://example.com/contact-bg.mp4'
        )}
        {renderBackgroundInput(
          'About Us Section Background URL',
          'about',
          'https://example.com/about-bg.png'
        )}
      </div>
    </div>
  );
};

export default BackgroundSection;