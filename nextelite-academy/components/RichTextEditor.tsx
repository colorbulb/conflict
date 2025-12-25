import React, { useEffect, useRef, useState } from 'react';
import { Bold, Italic, List, ListOrdered, Type, Link as LinkIcon, Quote, RotateCcw, RotateCw, Heading1, Heading2, Image as ImageIcon, Upload } from 'lucide-react';
import { uploadImage } from '../firebase/storage';

interface RichTextEditorProps {
  initialValue: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialValue, onChange, placeholder }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== initialValue) {
        contentRef.current.innerHTML = initialValue;
    }
  }, [initialValue]);

  const handleInput = () => {
    if (contentRef.current) {
      onChange(contentRef.current.innerHTML);
    }
  };

  const insertImage = (url: string) => {
    if (!contentRef.current) return;
    const img = document.createElement('img');
    img.src = url;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.className = 'responsive-image';
    img.setAttribute('data-responsive', 'true');
    document.execCommand('insertHTML', false, img.outerHTML);
    contentRef.current.focus();
    handleInput();
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const uploaded = await uploadImage(file, 'blog');
      insertImage(uploaded.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const exec = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (contentRef.current) contentRef.current.focus();
  };

  const ToolbarBtn = ({ icon: Icon, cmd, arg, title }: any) => (
    <button
      onClick={(e) => { e.preventDefault(); exec(cmd, arg); }}
      className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-blue rounded transition-colors"
      title={title}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col h-80 focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all relative">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-100 bg-gray-50/50">
        <ToolbarBtn icon={Bold} cmd="bold" title="Bold" />
        <ToolbarBtn icon={Italic} cmd="italic" title="Italic" />
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarBtn icon={Heading1} cmd="formatBlock" arg="H3" title="Heading" />
        <ToolbarBtn icon={Heading2} cmd="formatBlock" arg="H4" title="Subheading" />
        <ToolbarBtn icon={Quote} cmd="formatBlock" arg="blockquote" title="Quote" />
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarBtn icon={List} cmd="insertUnorderedList" title="Bullet List" />
        <ToolbarBtn icon={ListOrdered} cmd="insertOrderedList" title="Numbered List" />
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button
          onClick={(e) => {
              e.preventDefault();
              const url = prompt('Enter Link URL:', 'https://');
              if (url) exec('createLink', url);
          }}
          className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-blue rounded transition-colors"
        >
            <LinkIcon className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                handleImageUpload(files[0]);
              }
            }}
            className="hidden"
            id="rich-text-image-upload"
          />
          <label
            htmlFor="rich-text-image-upload"
            className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-blue rounded transition-colors cursor-pointer inline-block"
            title="Upload Image"
          >
            <Upload className="w-4 h-4" />
          </label>
        </div>
        <button
          onClick={(e) => {
              e.preventDefault();
              const url = prompt('Enter Image URL:', 'https://');
              if (url) {
                insertImage(url);
              }
          }}
          className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-brand-blue rounded transition-colors"
          title="Insert Image URL"
        >
            <ImageIcon className="w-4 h-4" />
        </button>
      </div>
      <div
        ref={contentRef}
        className="flex-1 p-4 overflow-y-auto outline-none prose prose-sm max-w-none prose-p:my-2 prose-headings:my-3"
        contentEditable
        onInput={handleInput}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const files = e.dataTransfer.files;
          if (files && files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
              await handleImageUpload(file);
            } else {
              alert('Please drop an image file');
            }
          }
        }}
        data-placeholder={placeholder}
        style={{ 
          // Ensure images are responsive
        }}
      />
      {isUploading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Uploading image...</p>
          </div>
        </div>
      )}
      <style>{`
        .responsive-image {
          max-width: 100% !important;
          height: auto !important;
        }
        @media (max-width: 768px) {
          .responsive-image {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;