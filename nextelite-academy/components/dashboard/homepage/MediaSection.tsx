import React, { useState, useRef } from 'react';
import { PageContent } from '../../../types';
import { uploadImage } from '../../../firebase/storage';
import { Upload, Trash2, GripVertical } from 'lucide-react';

interface MediaSectionProps {
  pageContent: PageContent;
  onUpdate: (pageContent: PageContent) => void;
}

const MediaSection: React.FC<MediaSectionProps> = ({ pageContent, onUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackgroundUpload = async (section: 'logo', files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      setIsUploading(true);
      const folder = 'logo';
      const uploaded = await uploadImage(file, folder);
      onUpdate({
        ...pageContent,
        logo: uploaded.url
      });
      alert("Logo uploaded! Don't forget to click \"Save Homepage\" to persist the change.");
    } catch (error) {
      console.error('Error uploading media:', error);
      alert('Error uploading. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map((file) => uploadImage(file, 'gallery'));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((r) => r.url);
      onUpdate({
        ...pageContent,
        galleryImages: [...pageContent.galleryImages, ...newUrls]
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageDelete = (index: number) => {
    if (confirm('Delete this image?')) {
      const newImages = pageContent.galleryImages.filter((_, i) => i !== index);
      onUpdate({
        ...pageContent,
        galleryImages: newImages
      });
    }
  };

  const handleImageDragStart = (index: number) => {
    setDraggedImageIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedImageIndex === null) return;

    const newImages = [...pageContent.galleryImages];
    const draggedItem = newImages[draggedImageIndex];
    newImages.splice(draggedImageIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);

    onUpdate({
      ...pageContent,
      galleryImages: newImages
    });
    setDraggedImageIndex(null);
  };

  const handleImageUrlAdd = (url: string) => {
    if (url.trim()) {
      onUpdate({
        ...pageContent,
        galleryImages: [...pageContent.galleryImages, url.trim()]
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Logo Upload */}
      <div>
        <h4 className="text-lg font-bold text-gray-800 mb-4">Site Logo</h4>
        <p className="text-xs text-gray-500 mb-4">
          Upload a logo image to display in the top-left corner next to "NextElite Academy".
          Recommended: PNG with transparent background, max height 40px.
        </p>
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-1">
            <label className="block text-sm font-bold text-gray-700 mb-1">Logo URL</label>
            <input
              type="text"
              value={pageContent.logo || ''}
              onChange={(e) =>
                onUpdate({
                  ...pageContent,
                  logo: e.target.value
                })
              }
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-brand-blue outline-none bg-gray-50 focus:bg-white text-xs"
              placeholder="https://example.com/logo.png"
            />
          </div>
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
              handleBackgroundUpload('logo', e.dataTransfer.files);
            }}
            className="mt-6 md:mt-0 text-xs border-2 border-dashed border-gray-300 rounded-xl px-4 py-4 text-gray-500 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors min-w-[200px]"
          >
            {isUploading ? 'Uploading...' : 'Drag & drop logo here'}
          </div>
        </div>
        {pageContent.logo && (
          <div className="mt-4 rounded-lg overflow-hidden border border-gray-200 bg-white p-4 inline-block">
            <img
              src={pageContent.logo}
              alt="Logo Preview"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Gallery Images */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-bold text-gray-800">Gallery Images</h4>
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-blue text-white font-bold hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              <Upload className="w-4 h-4" /> {isUploading ? 'Uploading...' : 'Upload Images'}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Or paste image URL here..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleImageUrlAdd((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
              className="flex-1 border rounded-lg p-2 text-sm"
            />
            <button
              onClick={(e) => {
                const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                if (input) {
                  handleImageUrlAdd(input.value);
                  input.value = '';
                }
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-sm transition-colors"
            >
              Add URL
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pageContent.galleryImages.map((imgUrl, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={() => handleImageDragStart(idx)}
              onDragOver={handleImageDragOver}
              onDrop={(e) => handleImageDrop(e, idx)}
              className="relative group rounded-xl overflow-hidden border-2 border-gray-200 hover:border-brand-blue transition-all cursor-move"
            >
              <div className="absolute top-2 left-2 z-10 bg-black/50 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                <GripVertical className="w-3 h-3" /> {idx + 1}
              </div>
              <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-32 object-cover" />
              <button
                onClick={() => handleImageDelete(idx)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaSection;