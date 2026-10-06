import React, { useState } from 'react';
import { X, Mail } from 'lucide-react';
import { LocationService } from '../../services/locationService';
import { ApiClient } from '../../services/apiClient';
import './LoginModal.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { id?: string; name: string; email: string; avatarUrl?: string; role?: string }) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'phone' | 'details'>('phone');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim().length >= 5) {
      setStep('details');
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const finalName = name.trim() || 'Aditya Sharma';
    const finalEmail = email.trim() || 'aditya@example.com';
    
    const res = await ApiClient.googleLogin({
      email: finalEmail,
      name: finalName,
      role: 'GUEST'
    });

    setIsSubmitting(false);

    if (res && res.success && res.data) {
      localStorage.setItem('airbnb_auth_token', res.data.token);
      localStorage.setItem('airbnb_user', JSON.stringify(res.data.user));
      LocationService.flushBusinessIndicators(res.data.user.email);
      window.dispatchEvent(new Event('authChange'));
      onLoginSuccess(res.data.user);
    } else {
      const userObj = { id: 'usr-guest-001', name: finalName, email: finalEmail };
      localStorage.setItem('airbnb_user', JSON.stringify(userObj));
      LocationService.flushBusinessIndicators(finalEmail);
      window.dispatchEvent(new Event('authChange'));
      onLoginSuccess(userObj);
    }
    onClose();
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    const googleUser = {
      email: 'aditya.ahmedabad@gmail.com',
      name: 'Aditya (Ahmedabad)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      googleId: 'google-oauth-1098492049120',
      role: 'GUEST' as const
    };

    const res = await ApiClient.googleLogin(googleUser);
    setIsSubmitting(false);

    if (res && res.success && res.data) {
      localStorage.setItem('airbnb_auth_token', res.data.token);
      localStorage.setItem('airbnb_user', JSON.stringify(res.data.user));
      LocationService.flushBusinessIndicators(res.data.user.email);
      window.dispatchEvent(new Event('authChange'));
      onLoginSuccess(res.data.user);
    } else {
      const fallbackUser = { id: 'usr-google-001', name: googleUser.name, email: googleUser.email, avatarUrl: googleUser.avatarUrl };
      localStorage.setItem('airbnb_user', JSON.stringify(fallbackUser));
      window.dispatchEvent(new Event('authChange'));
      onLoginSuccess(fallbackUser);
    }
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose} role="presentation">
      <div 
        className="modal-content login-modal-content animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        <div className="login-modal-header">
          <button className="icon-circle-btn" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
          <h2 id="login-modal-title" className="login-modal-title">Log in or sign up</h2>
          <div style={{ width: '32px' }} />
        </div>

        <div className="login-modal-body">
          <h3 className="welcome-title">Welcome to Airbnb</h3>

          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit}>
              <div className="phone-field-wrapper">
                <div className="country-select-block">
                  <label className="field-mini-label">Country/Region</label>
                  <select className="country-select-dropdown" defaultValue="IN">
                    <option value="IN">India (+91)</option>
                    <option value="US">United States (+1)</option>
                    <option value="UK">United Kingdom (+44)</option>
                    <option value="AE">United Arab Emirates (+971)</option>
                  </select>
                </div>
                <div className="phone-input-block">
                  <label className="field-mini-label">Phone number</label>
                  <input 
                    type="tel"
                    className="phone-text-input"
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <p className="privacy-notice">
                We'll call or text you to confirm your number. Standard message and data rates apply. <a href="#privacy">Privacy Policy</a>
              </p>

              <button type="submit" className="submit-login-btn">
                Continue
              </button>
            </form>
          ) : (
            <form onSubmit={handleFinalSubmit}>
              <div className="phone-field-wrapper">
                <div className="country-select-block">
                  <label className="field-mini-label">Full Name</label>
                  <input 
                    type="text"
                    className="phone-text-input"
                    placeholder="Aditya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="phone-input-block">
                  <label className="field-mini-label">Email</label>
                  <input 
                    type="email"
                    className="phone-text-input"
                    placeholder="aditya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="submit-login-btn margin-top-sm" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Continue'}
              </button>
            </form>
          )}

          <div className="login-divider-row">
            <span>or</span>
          </div>

          <div className="social-buttons-column">
            <button 
              type="button" 
              className="social-login-btn google-login-btn"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button 
              type="button" 
              className="social-login-btn"
              onClick={() => { setStep('details'); }}
            >
              <Mail size={18} />
              <span>Continue with Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
