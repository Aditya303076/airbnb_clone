import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useModalFocus } from '../../hooks/useModalFocus';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import './LanguageModal.css';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useModalFocus(isOpen);
  const [activeTab, setActiveTab] = useState<'lang' | 'currency'>('lang');
  const [selectedLang, setSelectedLang] = useState('English (IN)');
  const [selectedCurrency, setSelectedCurrency] = useState('INR (₹)');

  useKeyboardNavigation({
    enabled: isOpen,
    onEscape: onClose,
  });

  if (!isOpen) return null;

  const languages = [
    { name: 'English (IN)', region: 'India' },
    { name: 'English (US)', region: 'United States' },
    { name: 'English (UK)', region: 'United Kingdom' },
    { name: 'Hindi', region: 'India' },
    { name: 'Français', region: 'France' },
    { name: 'Deutsch', region: 'Deutschland' },
    { name: 'Español', region: 'España' },
    { name: 'Italiano', region: 'Italia' },
  ];

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'United States Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  ];

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose} role="presentation">
      <div 
        className="modal-content language-modal-content animate-scale-up" 
        onClick={(e) => e.stopPropagation()} 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lang-modal-heading"
      >
        <div className="modal-header">
          <button className="close-modal-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
          <div className="lang-modal-tabs">
            <button 
              className={`lang-tab ${activeTab === 'lang' ? 'active' : ''}`}
              onClick={() => setActiveTab('lang')}
            >
              Language and region
            </button>
            <button 
              className={`lang-tab ${activeTab === 'currency' ? 'active' : ''}`}
              onClick={() => setActiveTab('currency')}
            >
              Currency
            </button>
          </div>
        </div>

        <div className="modal-body lang-modal-body">
          {activeTab === 'lang' ? (
            <div>
              <h3 className="section-title">Suggested languages and regions</h3>
              <div className="lang-grid">
                {languages.map((l) => (
                  <button 
                    key={l.name}
                    className={`lang-card ${selectedLang === l.name ? 'selected' : ''}`}
                    onClick={() => { setSelectedLang(l.name); onClose(); }}
                  >
                    <span className="lang-name">{l.name}</span>
                    <span className="lang-region">{l.region}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="section-title">Choose a currency</h3>
              <div className="lang-grid">
                {currencies.map((c) => (
                  <button 
                    key={c.code}
                    className={`lang-card ${selectedCurrency.includes(c.code) ? 'selected' : ''}`}
                    onClick={() => { setSelectedCurrency(`${c.code} (${c.symbol})`); onClose(); }}
                  >
                    <span className="lang-name">{c.name}</span>
                    <span className="lang-region">{c.code} – {c.symbol}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
