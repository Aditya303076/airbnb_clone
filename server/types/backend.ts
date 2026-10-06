/**
 * Enterprise-Grade Airbnb Clone Backend Type Definitions
 * Strong static typing and strict schemas for DB, Redis, and Kafka payloads.
 */

export type PropertyCategory = 
  | 'Icons'
  | 'Amazing pools'
  | 'Beachfront'
  | 'Cabins'
  | 'Mansions'
  | 'OMG!'
  | 'Countryside'
  | 'Lakefront'
  | 'Islands'
  | 'Trending';

export interface ILocation {
  city: string;
  state: string;
  country: string;
  neighborhood: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface IHost {
  id: string;
  name: string;
  avatarUrl: string;
  isSuperhost: boolean;
  joinedDate: string;
  responseRate: number;
  responseTime: string;
  bio: string;
}

export interface IAmenity {
  id: string;
  name: string;
  iconName: string;
  category: 'Essentials' | 'Features' | 'Safety' | 'Location';
}

export interface IReview {
  id: string;
  propertyId: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface IProperty {
  id: string;
  title: string;
  description: string;
  type: string;
  category: PropertyCategory;
  location: ILocation;
  price: {
    amount: number;
    currency: string;
    currencySymbol: string;
    period: string;
  };
  rating: number;
  reviewCount: number;
  guestCapacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    baths: number;
  };
  photos: Array<{
    id: string;
    url: string;
    caption: string;
    isPrimary?: boolean;
  }>;
  amenities: IAmenity[];
  host: IHost;
  isGuestFavourite: boolean;
  availableDates: {
    start: string;
    end: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IReservation {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  totalPrice: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  createdAt: string;
}

export interface ISearchFilters {
  destination?: string;
  category?: PropertyCategory | string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  checkIn?: string;
  checkOut?: string;
  page?: number;
  limit?: number;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: 'GUEST' | 'HOST' | 'ADMIN';
  authProvider: 'GOOGLE' | 'EMAIL';
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IKafkaEvent<T = Record<string, unknown>> {
  eventId: string;
  topic: 'reservation-events' | 'analytics-events' | 'cache-invalidation-events' | 'property-views';
  partition: number;
  offset: number;
  timestamp: number;
  payload: T;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    executionTimeMs: number;
    cacheHit: boolean;
    cacheLayer?: 'L1_MEMORY' | 'L2_REDIS' | 'DATABASE';
  };
  error?: string;
}

