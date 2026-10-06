export interface Photo {
  id: string;
  url: string;
  caption: string;
  category: 'Living Room' | 'Bedrooms' | 'Kitchen & Dining' | 'Bathrooms' | 'Exterior & Views';
  isHero?: boolean;
  heroPosition?: 'main' | 'top-right' | 'top-far-right' | 'bottom-right' | 'bottom-far-right';
}

export interface Host {
  name: string;
  avatar: string;
  isSuperhost: boolean;
  joinedDate: string;
  coHosts?: { name: string; avatar: string }[];
  bio: string;
  responseRate: number;
  responseTime: string;
  ratingCount: number;
  yearsHosting: number;
}

export interface Highlight {
  id: string;
  iconName: 'workspace' | 'checkin' | 'cancellation' | 'location' | 'sparkles';
  title: string;
  subtitle: string;
}

export interface Amenity {
  id: string;
  name: string;
  iconName: string;
  category: 'Popular' | 'Bathroom' | 'Bedroom & Laundry' | 'Entertainment' | 'Heating & Cooling' | 'Outdoor' | 'Safety' | 'Kitchen & Dining';
  isTopAmenity?: boolean;
}

export interface ReviewCategoryScore {
  cleanliness: number;
  accuracy: number;
  checkIn: number;
  communication: number;
  location: number;
  value: number;
}

export interface Review {
  id: string;
  author: string;
  authorAvatar: string;
  authorLocation: string;
  date: string;
  rating: number;
  comment: string;
  stayDuration: string;
}

export interface SleepingArrangement {
  roomName: string;
  bedDescription: string;
  iconType: 'king' | 'queen' | 'double' | 'single';
}

export interface PriceDetails {
  perNight: number;
  currencySymbol: string;
  currencyCode: string;
  originalPerNight?: number;
  cleaningFee: number;
  serviceFee: number;
  taxRatePercentage: number;
}

export interface Property {
  id: string;
  title: string;
  tagline: string;
  type: string;
  location: {
    city: string;
    state: string;
    country: string;
    neighborhood: string;
    lat: number;
    lng: number;
  };
  rating: number;
  reviewCount: number;
  isSuperhost: boolean;
  guestsMax: number;
  bedrooms: number;
  beds: number;
  baths: number;
  host: Host;
  photos: Photo[];
  highlights: Highlight[];
  description: string;
  sleepingArrangements: SleepingArrangement[];
  amenities: Amenity[];
  reviewCategoryScores: ReviewCategoryScore;
  reviews: Review[];
  price: PriceDetails;
}
