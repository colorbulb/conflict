import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, Type, Layout, Upload, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { uploadImage, uploadMultipleImages } from '../firebase/storage';

export interface LayoutBlock {
  id: string;
  type: 'text-image' | 'text-only' | 'image-text' | 'image-carousel';
  text: string;
  imageUrl?: string;
  images?: string[]; // For carousel
}

interface LayoutBuilderProps {
  blocks: LayoutBlock[];
  onChange: (blocks: LayoutBlock[]) => void;
}

const LayoutBuilder: React.FC<LayoutBuilderProps> = ({ blocks, onChange }) => {
  const [isUploading, setIsUploading] = useState<string | null>(null);

  const addBlock = (type: LayoutBlock['type']) => {
    const newBlock: LayoutBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      text: '',
      imageUrl: (type === 'text-only' || type === 'image-carousel') ? undefined : '',
      images: type === 'image-carousel' ? [] : undefined
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id: string, updates: Partial<LayoutBlock>) => {
    onChange(blocks.map(block => block.id === id ? { ...block, ...updates } : block));
  };

  const deleteBlock = (id: string) => {
    onChange(blocks.filter(block => block.id !== id));
  };

  const handleImageUpload = async (blockId: string, file: File) => {
    try {
      setIsUploading(blockId);
      const uploaded = await uploadImage(file, 'blog');
      updateBlock(blockId, { imageUrl: uploaded.url });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setIsUploading(null);
    }
  };

  const handleMultipleImageUpload = async (blockId: string, files: File[]) => {
    try {
      setIsUploading(blockId);
      const uploaded = await uploadMultipleImages(files, 'blog');
      const block = blocks.find(b => b.id === blockId);
      updateBlock(blockId, { images: [...(block?.images || []), ...uploaded.map(u => u.url)] });
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setIsUploading(null);
    }
  };

  const removeCarouselImage = (blockId: string, index: number) => {
    const block = blocks.find(b => b.id === blockId);
    if (block?.images) {
      const newImages = block.images.filter((_, i) => i !== index);
      updateBlock(blockId, { images: newImages });
    }
  };

  const renderBlock = (block: LayoutBlock) => {
    return (
      <div key={block.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-bold text-gray-700 capitalize">
              {block.type === 'text-image' ? 'Text Left, Image Right' : 
               block.type === 'image-text' ? 'Image Left, Text Right' : 
               block.type === 'image-carousel' ? 'Image Carousel' :
               'Text Only'}
            </span>
          </div>
          <button
            onClick={() => deleteBlock(block.id)}
            className="text-red-400 hover:text-red-600 p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {block.type === 'text-image' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Text Content</label>
              <textarea
                value={block.text}
                onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                className="w-full border rounded-lg p-3 text-sm h-32 focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="Enter text content..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Image (Right)</label>
              {block.imageUrl && (
                <div className="mb-2 rounded-lg overflow-hidden border border-gray-200 h-32 bg-gray-100">
                  <img src={block.imageUrl} alt="Block" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                type="text"
                value={block.imageUrl || ''}
                onChange={(e) => updateBlock(block.id, { imageUrl: e.target.value })}
                className="w-full border rounded-lg p-2 text-xs mb-2 font-mono text-gray-500"
                placeholder="Image URL or drag & drop below"
              />
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                }}
                onDrop={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                  const files = e.dataTransfer.files;
                  if (files && files.length > 0 && files[0].type.startsWith('image/')) {
                    await handleImageUpload(block.id, files[0]);
                  }
                }}
                className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
              >
                {isUploading === block.id ? (
                  <div className="text-xs text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-blue mx-auto mb-1"></div>
                    Uploading...
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">
                    <Upload className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                    Drag & drop image
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(block.id, e.target.files[0]);
                  }
                }}
                className="hidden"
                id={`image-upload-${block.id}`}
              />
              <label
                htmlFor={`image-upload-${block.id}`}
                className="mt-1 block text-center text-xs text-brand-blue hover:text-brand-purple font-bold cursor-pointer"
              >
                Or click to browse
              </label>
            </div>
          </div>
        )}

        {block.type === 'image-text' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Image (Left)</label>
              {block.imageUrl && (
                <div className="mb-2 rounded-lg overflow-hidden border border-gray-200 h-32 bg-gray-100">
                  <img src={block.imageUrl} alt="Block" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                type="text"
                value={block.imageUrl || ''}
                onChange={(e) => updateBlock(block.id, { imageUrl: e.target.value })}
                className="w-full border rounded-lg p-2 text-xs mb-2 font-mono text-gray-500"
                placeholder="Image URL or drag & drop below"
              />
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                }}
                onDrop={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                  const files = e.dataTransfer.files;
                  if (files && files.length > 0 && files[0].type.startsWith('image/')) {
                    await handleImageUpload(block.id, files[0]);
                  }
                }}
                className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
              >
                {isUploading === block.id ? (
                  <div className="text-xs text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-blue mx-auto mb-1"></div>
                    Uploading...
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">
                    <Upload className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                    Drag & drop image
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(block.id, e.target.files[0]);
                  }
                }}
                className="hidden"
                id={`image-upload-left-${block.id}`}
              />
              <label
                htmlFor={`image-upload-left-${block.id}`}
                className="mt-1 block text-center text-xs text-brand-blue hover:text-brand-purple font-bold cursor-pointer"
              >
                Or click to browse
              </label>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Text Content</label>
              <textarea
                value={block.text}
                onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                className="w-full border rounded-lg p-3 text-sm h-32 focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="Enter text content..."
              />
            </div>
          </div>
        )}

        {block.type === 'text-only' && (
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Text Content</label>
            <textarea
              value={block.text}
              onChange={(e) => updateBlock(block.id, { text: e.target.value })}
              className="w-full border rounded-lg p-3 text-sm h-40 focus:ring-2 focus:ring-brand-blue outline-none"
              placeholder="Enter text content..."
            />
          </div>
        )}

        {block.type === 'image-carousel' && (
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Carousel Images</label>
            {block.images && block.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {block.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <div className="rounded-lg overflow-hidden border border-gray-200 h-24 bg-gray-100">
                      <img src={img} alt={`Carousel ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                    <button
                      onClick={() => removeCarouselImage(block.id, idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.classList.add('border-brand-blue', 'bg-blue-50');
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
              }}
              onDrop={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.classList.remove('border-brand-blue', 'bg-blue-50');
                const files = Array.from(e.dataTransfer.files).filter((f: File) => f.type.startsWith('image/'));
                if (files.length > 0) {
                  await handleMultipleImageUpload(block.id, files);
                }
              }}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors mb-2"
            >
              {isUploading === block.id ? (
                <div className="text-xs text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-blue mx-auto mb-1"></div>
                  Uploading...
                </div>
              ) : (
                <div className="text-xs text-gray-500">
                  <Upload className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                  Drag & drop multiple images
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  await handleMultipleImageUpload(block.id, Array.from(files));
                }
              }}
              className="hidden"
              id={`carousel-upload-${block.id}`}
            />
            <label
              htmlFor={`carousel-upload-${block.id}`}
              className="block text-center text-xs text-brand-blue hover:text-brand-purple font-bold cursor-pointer"
            >
              Or click to browse multiple images
            </label>
          </div>
        )}
      </div>
    );
  };

  const renderPreview = () => {
    return (
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h4 className="text-sm font-bold text-gray-700 mb-4">Preview</h4>
        <div className="space-y-6">
          {blocks.map(block => (
            <div key={block.id} className="bg-white rounded-lg p-4">
              {block.type === 'text-image' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: block.text.replace(/\n/g, '<br>') }} />
                  </div>
                  {block.imageUrl && (
                    <div className="rounded-lg overflow-hidden">
                      <img src={block.imageUrl} alt="" className="w-full h-auto object-cover" />
                    </div>
                  )}
                </div>
              )}
              {block.type === 'image-text' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {block.imageUrl && (
                    <div className="rounded-lg overflow-hidden">
                      <img src={block.imageUrl} alt="" className="w-full h-auto object-cover" />
                    </div>
                  )}
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: block.text.replace(/\n/g, '<br>') }} />
                  </div>
                </div>
              )}
              {block.type === 'text-only' && (
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: block.text.replace(/\n/g, '<br>') }} />
                </div>
              )}
              {block.type === 'image-carousel' && block.images && block.images.length > 0 && (
                <div className="relative">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {block.images.map((img, idx) => (
                      <div key={idx} className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden">
                        <img src={img} alt={`Carousel ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-bold text-gray-700">Layout Blocks</label>
        <div className="flex gap-2">
          <button
            onClick={() => addBlock('text-image')}
            className="text-xs bg-brand-blue text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-600 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Text Left, Image Right
          </button>
          <button
            onClick={() => addBlock('image-text')}
            className="text-xs bg-brand-purple text-white px-3 py-1.5 rounded-lg font-bold hover:bg-purple-600 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Image Left, Text Right
          </button>
          <button
            onClick={() => addBlock('text-only')}
            className="text-xs bg-gray-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-gray-700 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Text Only
          </button>
          <button
            onClick={() => addBlock('image-carousel')}
            className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-green-700 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Image Carousel
          </button>
        </div>
      </div>

      {blocks.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
          No layout blocks yet. Click buttons above to add blocks.
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {blocks.map(block => renderBlock(block))}
          </div>
          {renderPreview()}
        </>
      )}
    </div>
  );
};

export default LayoutBuilder;

