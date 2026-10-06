import React from 'react';
import './LocationMap.css';

interface LocationMapProps {
  city: string;
  state: string;
  country: string;
  neighborhood: string;
}

export const LocationMap: React.FC<LocationMapProps> = ({
  city,
  state,
  country,
  neighborhood
}) => {
  return (
    <div className="location-section" id="location">
      <h2 className="section-heading">Where you'll be</h2>
      <h3 className="location-subheading">{city}, {state}, {country}</h3>

      <div className="map-wrapper">
        <iframe
          title="Property Location Map"
          className="real-map-iframe"
          src="https://www.openstreetmap.org/export/embed.html?bbox=73.7400%2C15.5200%2C73.7800%2C15.5600&amp;layer=mapnik&amp;marker=15.5400%2C73.7600"
          loading="lazy"
        />
        <div className="map-overlay-card">
          <div className="overlay-text-block">
            <span className="overlay-title">Exact location provided after booking.</span>
            <span className="overlay-sub">{neighborhood}</span>
          </div>
        </div>
      </div>

      <p className="neighborhood-description">
        Very quiet, upscale residential neighborhood surrounded by protected palm trees and beach reserves. 10 minutes walk from Calangute Beach, Local Market, and Sunset Point.
      </p>
    </div>
  );
};
