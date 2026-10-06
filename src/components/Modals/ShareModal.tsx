import React, { useState } from 'react';
import { X, Copy, Check, Mail, MessageSquare, Share2 } from 'lucide-react';
import { useModalFocus } from '../../hooks/useModalFocus';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import './ShareModal.css';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, propertyTitle }) => {
  const modalRef = useModalFocus(isOpen);
  const [copied, setCopied] = useState(false);

  useKeyboardNavigation({
    enabled: isOpen,
    onEscape: onClose
  });

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose} role="presentation">
      <div 
        className="modal-content share-modal-content animate-scale-up" 
        onClick={(e) => e.stopPropagation()} 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        <div className="modal-header">
          <button className="close-modal-btn" onClick={onClose} aria-label="Close share dialog">
            <X size={18} />
          </button>
          <h2 id="share-modal-title" className="modal-title">Share this place</h2>
        </div>

        <div className="modal-body">
          <p className="share-subtitle">{propertyTitle}</p>

          <div className="share-options-grid">
            <button className="share-option-card" onClick={handleCopyLink}>
              <div className="option-icon-box">
                {copied ? <Check size={20} color="#FF385C" /> : <Copy size={20} />}
              </div>
              <span className="option-label">{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button className="share-option-card" onClick={() => alert('Opening Email client...')}>
              <div className="option-icon-box"><Mail size={20} /></div>
              <span className="option-label">Email</span>
            </button>

            <button className="share-option-card" onClick={() => alert('Opening Messages...')}>
              <div className="option-icon-box"><MessageSquare size={20} /></div>
              <span className="option-label">Messages</span>
            </button>

            <button className="share-option-card" onClick={() => alert('Opening WhatsApp...')}>
              <div className="option-icon-box"><Share2 size={20} /></div>
              <span className="option-label">WhatsApp</span>
            </button>

            <button className="share-option-card" onClick={() => alert('Opening Facebook...')}>
              <div className="option-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </div>
              <span className="option-label">Facebook</span>
            </button>

            <button className="share-option-card" onClick={() => alert('Opening Twitter / X...')}>
              <div className="option-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </div>
              <span className="option-label">Twitter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
