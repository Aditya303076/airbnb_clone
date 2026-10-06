import React from 'react';
import { X } from 'lucide-react';
import { useModalFocus } from '../../hooks/useModalFocus';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';

interface DescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export const DescriptionModal: React.FC<DescriptionModalProps> = ({
  isOpen,
  onClose,
  title,
  description
}) => {
  const modalRef = useModalFocus(isOpen);

  useKeyboardNavigation({
    enabled: isOpen,
    onEscape: onClose
  });

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose} role="presentation">
      <div 
        className="modal-content animate-scale-up" 
        onClick={(e) => e.stopPropagation()} 
        ref={modalRef}
        style={{ maxWidth: '680px' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="desc-modal-title"
      >
        <div className="modal-header">
          <button className="close-modal-btn" onClick={onClose} aria-label="Close description dialog">
            <X size={18} />
          </button>
          <h2 id="desc-modal-title" className="modal-title">About this space</h2>
        </div>

        <div className="modal-body" style={{ whiteSpace: 'pre-line', lineHeight: '1.6', fontSize: '16px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>{title}</h3>
          {description}
        </div>
      </div>
    </div>
  );
};
