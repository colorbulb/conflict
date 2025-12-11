import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

interface PDFViewerProps {
  url: string | null;
  onClose: () => void;
  title?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url, onClose, title }) => {
  return (
    <AnimatePresence>
      {url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white w-full max-w-4xl h-[85vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gray-900 text-white p-4 flex justify-between items-center shrink-0">
              <span className="font-bold truncate max-w-[80%]">{title || 'Document Viewer'}</span>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-gray-100 relative">
              {/* Overlay to discourage right-click/download via context menu */}
              <div className="absolute inset-0 z-10 pointer-events-none" onContextMenu={(e) => e.preventDefault()}></div>
              
              {/* iframe with toolbar disabled */}
              <iframe
                src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full border-none"
                title="PDF Viewer"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PDFViewer;