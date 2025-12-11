import React, { useEffect, useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Type, Link as LinkIcon, Quote, RotateCcw, RotateCw, Heading1, Heading2 } from 'lucide-react';

interface RichTextEditorProps {
  initialValue: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialValue, onChange, placeholder }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== initialValue) {
        // Only set on mount or if completely different to avoid cursor jumps
        // For a simple CMS this is usually acceptable
        contentRef.current.innerHTML = initialValue;
    }
  }, []); // Intentionally empty to only set initial value once

  const handleInput = () => {
    if (contentRef.current) {
      onChange(contentRef.current.innerHTML);
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
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col h-80 focus-within:ring-2 focus-within:ring-brand-blue/20 transition-all">
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
      </div>
      <div
        ref={contentRef}
        className="flex-1 p-4 overflow-y-auto outline-none prose prose-sm max-w-none prose-p:my-2 prose-headings:my-3"
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;