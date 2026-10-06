import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import './HostPage.css';

export const HostPage: React.FC = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const posters = [
    { title: 'TORONTO', bg: 'https://images.unsplash.com/photo-1517935703635-27c73534a792?auto=format&fit=crop&w=600&q=80' },
    { title: 'PARIS', bg: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80' },
    { title: 'CIUDAD MÉX', bg: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=600&q=80' },
    { title: 'MEDELLÍN', bg: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80' },
    { title: 'MIAMI', bg: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80' },
    { title: 'BUDAPEST', bg: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80' },
    { title: 'MONTRÉAL', bg: 'https://images.unsplash.com/photo-1519178614-68693b05f616?auto=format&fit=crop&w=600&q=80' },
    { title: 'EDINBURGH', bg: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80' },
    { title: 'SAN DIEGO', bg: 'https://images.unsplash.com/photo-1538428494232-9c0d8a3ab390?auto=format&fit=crop&w=600&q=80' },
    { title: 'LONDON', bg: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80' },
    { title: 'TOKYO', bg: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80' },
    { title: 'ROME', bg: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setIsSubmitted(true);
      setTimeout(() => {
        navigate('/');
      }, 1200);
    }
  };

  return (
    <div className="host-login-page">
      <Header hideSearch={true} />

      {/* Poster Grid Background */}
      <div className="poster-grid-bg">
        {posters.map((poster, index) => (
          <div 
            key={index} 
            className="poster-card" 
            style={{ backgroundImage: `url(${poster.bg})` }}
          >
            <div className="poster-overlay" />
            <span className="poster-title">{poster.title}</span>
          </div>
        ))}
      </div>

      {/* Centered Login Card Modal */}
      <div className="login-modal-wrapper">
        <div className="login-card animate-fade-in">
          {/* Airbnb Red Logo */}
          <svg className="login-airbnb-icon" viewBox="0 0 32 32" width="48" height="48" fill="#FF385C">
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.315c0 4.908-3.784 8.806-8.5 8.806-3.1 0-5.742-1.701-7.228-4.276L13.5 28.5l-.272.224C11.742 30.299 9.1 32 6 32 1.284 32-2.5 28.102-2.5 23.194c0-.924.243-1.805.91-3.396l.145-.353c.986-2.297 5.146-11.007 7.1-14.836l.533-1.025C7.472 1.963 8.927 1 10.935 1H16zm0 3h-5.065c-1.077 0-2.023.535-2.923 2.144L7.5 7.125c-1.9 3.725-5.973 12.28-6.9 14.444-.567 1.353-.75 2.025-.75 2.625 0 3.336 2.5 6 5.5 6 2.19 0 4.148-1.258 5.25-3.125l.394-.71.394.71C12.488 28.058 14.446 29.316 16.636 29.316c3 0 5.5-2.664 5.5-6 0-.6-.183-1.272-.75-2.625-.927-2.164-5-10.719-6.9-14.444l-.478-.981C13.111 4.535 12.165 4 11.088 4H16zm0 11a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
          </svg>

          <h1 className="login-title">
            {isSubmitted ? 'Welcome back!' : 'Log in or sign up'}
          </h1>

          <form className="login-form" onSubmit={handleSubmit}>
            <input 
              type="text" 
              className="login-input-field"
              placeholder="Phone number or email" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              required
            />

            <button type="submit" className="login-continue-btn">
              {isSubmitted ? 'Redirecting...' : 'Continue'}
            </button>
          </form>

          <div className="login-divider-row">
            <div className="login-divider-line" />
            <span className="login-divider-text">or</span>
            <div className="login-divider-line" />
          </div>

          {/* Social Icons Row: Google & Apple */}
          <div className="social-buttons-row">
            <button className="social-btn" aria-label="Log in with Google" onClick={() => navigate('/')}>
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </button>

            <button className="social-btn" aria-label="Log in with Apple" onClick={() => navigate('/')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#000000">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.68-.82 1.14-1.97.98-3.12-1.01.04-2.2.68-2.9 1.49-.62.72-1.16 1.89-.98 3.02 1.13.09 2.25-.57 2.9-1.39z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
