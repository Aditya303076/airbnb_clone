/**
 * Ultra-Fast API Client for Airbnb Clone Frontend
 * Dynamically fetches data from high-performance Node.js / Redis / Kafka Backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? '/api/v1'
    : 'http://localhost:5000/api/v1'
);

export interface PropertyFilters {
  destination?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  page?: number;
  limit?: number;
}

export class ApiClient {
  public static async getProperties(filters: PropertyFilters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.destination) params.append('destination', filters.destination);
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.guests) params.append('guests', filters.guests.toString());
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const res = await fetch(`${API_BASE_URL}/properties?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.warn('[API CLIENT] Backend unavailable or starting up, using fallback data:', error);
      return null;
    }
  }

  public static async getDestinations() {
    try {
      const res = await fetch(`${API_BASE_URL}/destinations`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.warn('[API CLIENT] Could not fetch destinations from server:', error);
      return null;
    }
  }

  public static async getPropertyById(id: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/properties/${id}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.warn(`[API CLIENT] Could not fetch property ${id} from server:`, error);
      return null;
    }
  }

  public static async getReviews(id: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/properties/${id}/reviews`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.warn(`[API CLIENT] Could not fetch reviews for property ${id}:`, error);
      return null;
    }
  }

  public static async googleLogin(userData: {
    email: string;
    name: string;
    avatarUrl?: string;
    googleId?: string;
    role?: 'GUEST' | 'HOST' | 'ADMIN';
  }) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.warn('[API CLIENT] Could not perform Google authentication with server:', error);
      return null;
    }
  }

  public static async createReservation(payload: {
    propertyId: string;
    userId?: string;
    checkIn: string;
    checkOut: string;
    guests: { adults: number; children: number; infants: number; pets: number };
    totalPrice: number;
  }) {
    try {
      const token = localStorage.getItem('airbnb_auth_token');
      const res = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Booking creation failed' };
      }
      return data;
    } catch (error) {
      console.warn('[API CLIENT] Could not submit reservation to server:', error);
      return { success: false, error: 'Connection error while creating reservation' };
    }
  }

  public static async getUserReservations(userId?: string) {
    try {
      const targetUserId = userId || 'usr-guest-001';
      const res = await fetch(`${API_BASE_URL}/reservations?userId=${targetUserId}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.warn('[API CLIENT] Could not fetch user reservations:', error);
      return null;
    }
  }

  public static async cancelReservation(reservationId: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.warn(`[API CLIENT] Could not cancel reservation ${reservationId}:`, error);
      return null;
    }
  }

  public static async checkAvailability(propertyId: string, checkIn: string, checkOut: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/reservations/check-availability?propertyId=${propertyId}&checkIn=${checkIn}&checkOut=${checkOut}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.warn('[API CLIENT] Could not check date availability:', error);
      return null;
    }
  }

  public static async getPropertyReservations(propertyId: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/properties/${propertyId}/reservations`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.warn(`[API CLIENT] Could not fetch reservations for property ${propertyId}:`, error);
      return null;
    }
  }

  public static async getHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch {
      return null;
    }
  }
}
