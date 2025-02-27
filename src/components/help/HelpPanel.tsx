import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

const HelpPanel: React.FC<HelpPanelProps> = ({ isOpen, onClose, title, content }) => {
  // Handle escape key to close panel
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling of the main content when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 md:w-96 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close help panel"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {content}
        </div>
      </div>
    </>
  );
};

// Helper component for section headers in the help content
export const HelpSectionTitle: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <h3 className="text-lg font-medium text-gray-800 mt-6 mb-2">{children}</h3>
);

// Helper component for paragraphs in the help content
export const HelpParagraph: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <p className="text-sm text-gray-600 mb-4">{children}</p>
);

// Helper component for tips in the help content
export const HelpTip: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
    <p className="text-sm text-blue-700">{children}</p>
  </div>
);

// Helper component for external links or navigation links
export const HelpLink: React.FC<{to: string; external?: boolean; children: React.ReactNode}> = ({ 
  to, 
  external = false, 
  children 
}) => (
  external ? (
    <a 
      href={to} 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-flex items-center text-blue-600 hover:text-blue-800"
    >
      {children}
      <ExternalLink size={14} className="ml-1" />
    </a>
  ) : (
    <Link 
      to={to}
      className="inline-flex items-center text-blue-600 hover:text-blue-800"
    >
      {children}
    </Link>
  )
);

export default HelpPanel;