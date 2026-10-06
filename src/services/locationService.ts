/**
 * Geolocation & Business Intelligence Analytics Service
 * Handles browser geolocation, nearest property calculation,
 * session activity tracking before login, and business growth telemetry flushing.
 */

export interface UserCoordinates {
  lat: number;
  lng: number;
}

export interface ActivityEvent {
  type: 'SEARCH' | 'GEOLOCATION_DETECTED' | 'PROPERTY_VIEW' | 'CATEGORY_CLICK' | 'RESERVATION_INTENT';
  payload: Record<string, unknown>;
  timestamp: number;
}

// Calculate distance between two coordinate points in km using Haversine formula
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const KNOWN_CITIES = [
  { name: 'Ahmedabad, Gujarat', lat: 23.0225, lng: 72.5714 },
  { name: 'Navrangpura, Ahmedabad', lat: 23.0366, lng: 72.5611 },
  { name: 'Mumbai, Maharashtra', lat: 19.076, lng: 72.8777 },
  { name: 'Pune, Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'North Goa, Goa', lat: 15.5438, lng: 73.7554 },
  { name: 'Calangute, Goa', lat: 15.5438, lng: 73.7554 },
  { name: 'New Delhi, Delhi', lat: 28.6139, lng: 77.209 },
  { name: 'Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946 },
  { name: 'Kasauli, Himachal Pradesh', lat: 30.9013, lng: 76.9649 },
  { name: 'Manali, Himachal Pradesh', lat: 32.2432, lng: 77.1892 },
  { name: 'Udaipur, Rajasthan', lat: 24.5854, lng: 73.7125 },
  { name: 'Jaipur, Rajasthan', lat: 26.9124, lng: 75.7873 },
];

export function getNearestCity(coords: UserCoordinates | null): string {
  if (!coords) {
    return 'Ahmedabad, Gujarat';
  }

  let minDistance = Infinity;
  let closestCity = 'Ahmedabad, Gujarat';

  for (const city of KNOWN_CITIES) {
    const dist = calculateHaversineDistance(coords.lat, coords.lng, city.lat, city.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestCity = city.name;
    }
  }

  return closestCity;
}

export class LocationService {
  /**
   * Request browser geolocation permission and return coordinates
   */
  public static async getCurrentCoordinates(): Promise<UserCoordinates | null> {
    if (!navigator.geolocation) {
      console.warn('[LOCATION SERVICE] Geolocation API not supported by browser.');
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: UserCoordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.trackActivity('GEOLOCATION_DETECTED', { coords });
          resolve(coords);
        },
        (error) => {
          console.warn('[LOCATION SERVICE] Geolocation access denied or timed out:', error.message);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  }

  /**
   * Track session activity prior to customer login
   */
  public static trackActivity(type: ActivityEvent['type'], payload: Record<string, unknown>): void {
    try {
      const stored = sessionStorage.getItem('airbnb_session_activity');
      const events: ActivityEvent[] = stored ? JSON.parse(stored) : [];
      const newEvent: ActivityEvent = {
        type,
        payload,
        timestamp: Date.now(),
      };
      events.push(newEvent);
      sessionStorage.setItem('airbnb_session_activity', JSON.stringify(events.slice(-50))); // Keep last 50 events
    } catch (err) {
      console.warn('[LOCATION SERVICE] Could not store activity in sessionStorage:', err);
    }
  }

  /**
   * Flush pre-login & post-login session telemetry to backend business intelligence pipeline
   */
  public static async flushBusinessIndicators(userId?: string): Promise<void> {
    try {
      const stored = sessionStorage.getItem('airbnb_session_activity');
      if (!stored) return;

      const events: ActivityEvent[] = JSON.parse(stored);
      if (events.length === 0) return;

      await fetch('http://localhost:5000/api/v1/analytics/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || 'anonymous_guest',
          sessionId: sessionStorage.getItem('airbnb_session_id') || `sess-${Date.now()}`,
          events,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      });

      // Clear flushed activity
      sessionStorage.removeItem('airbnb_session_activity');
    } catch (err) {
      console.warn('[LOCATION SERVICE] Could not flush business indicators:', err);
    }
  }
}
