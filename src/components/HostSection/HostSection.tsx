import React from 'react';
import { Award, ShieldCheck, MessageSquare } from 'lucide-react';
import type { Host } from '../../types/property';
import './HostSection.css';

interface HostSectionProps {
  host: Host;
}

export const HostSection: React.FC<HostSectionProps> = ({ host }) => {
  return (
    <div className="host-section" id="host">
      <h2 className="section-heading">Meet your Host</h2>

      <div className="host-card-container">
        {/* Host Bio Badge Box */}
        <div className="host-bio-box">
          <div className="host-identity">
            <img src={host.avatar} alt={host.name} className="host-card-avatar" />
            <div className="host-card-name-block">
              <h3 className="host-card-name">{host.name}</h3>
              <p className="host-card-badge">
                <Award size={14} color="#FF385C" />
                <span>Superhost</span>
              </p>
            </div>
          </div>

          <div className="host-stats-strip">
            <div className="stat-col">
              <span className="stat-num">{host.ratingCount}</span>
              <span className="stat-label">Reviews</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-col">
              <span className="stat-num">4.98 ★</span>
              <span className="stat-label">Rating</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-col">
              <span className="stat-num">{host.yearsHosting}</span>
              <span className="stat-label">Years hosting</span>
            </div>
          </div>

          <p className="host-bio-text">{host.bio}</p>

          {host.coHosts && host.coHosts.length > 0 && (
            <div className="cohosts-block">
              <h4 className="cohosts-title">Co-hosts</h4>
              <div className="cohosts-list">
                {host.coHosts.map((co, i) => (
                  <div key={i} className="cohost-chip">
                    <img src={co.avatar} alt={co.name} className="cohost-avatar" />
                    <span className="cohost-name">{co.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Host Details & Contact Side */}
        <div className="host-details-side">
          <h3 className="host-details-title">Host details</h3>
          <p className="host-detail-row">Response rate: <strong>{host.responseRate}%</strong></p>
          <p className="host-detail-row">Responds <strong>{host.responseTime}</strong></p>

          <button className="contact-host-btn" onClick={() => alert('Opening Host Messaging...')}>
            <MessageSquare size={16} />
            <span>Contact Host</span>
          </button>

          <div className="protection-note">
            <ShieldCheck size={20} color="#FF385C" />
            <span>To protect your payment, never transfer money or communicate outside of the Airbnb website or app.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
