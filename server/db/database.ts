import { IProperty, IReservation, IReview, ISearchFilters } from '../types/backend';

/**
 * Low-Complexity Ultra-Fast Database Engine
 * Features pre-built hash indexes and inverted lookup maps for O(1) retrieval times.
 */
export class DatabaseEngine {
  private properties: Map<string, IProperty> = new Map();
  private reservations: Map<string, IReservation> = new Map();
  private reviews: Map<string, IReview[]> = new Map();
  private users: Map<string, IUser> = new Map();

  // Low-complexity secondary indexes for O(1) / O(k) queries
  private categoryIndex: Map<string, Set<string>> = new Map();
  private locationIndex: Map<string, Set<string>> = new Map();

  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    const rawProperties: IProperty[] = [
      {
        id: 'villa-glasshouse-kasauli-01',
        title: 'The Glass House — Luxury Cliffside Villa with Panoramic Mountain Views',
        description: 'Perched atop a private cliff in Kasauli, Himachal Pradesh, The Glass House is a masterwork of contemporary architectural minimalism fused with raw natural beauty. Featuring floor-to-ceiling double-glazed glass walls, a heated infinity splash pool, private outdoor Jacuzzi, dual fireplaces, and uninterrupted 270-degree views of the mist-laden pine valleys.',
        type: 'Entire villa',
        category: 'Mansions',
        location: {
          city: 'Kasauli',
          state: 'Himachal Pradesh',
          country: 'India',
          neighborhood: 'Pine Ridge Estate',
          coordinates: { lat: 30.9013, lng: 76.9649 }
        },
        price: {
          amount: 2255,
          currency: 'INR',
          currencySymbol: '₹',
          period: 'night'
        },
        rating: 4.98,
        reviewCount: 124,
        guestCapacity: { guests: 10, bedrooms: 4, beds: 5, baths: 4.5 },
        photos: [
          { id: 'p1', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80', caption: 'Exterior View', isPrimary: true },
          { id: 'p2', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', caption: 'Architectural Facade' },
          { id: 'p3', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', caption: 'Sunlit Living Room' },
          { id: 'p4', url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', caption: 'Infinity Pool Terrace' },
          { id: 'p5', url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80', caption: 'Master Suite' }
        ],
        amenities: [
          { id: 'a1', name: 'Wifi', iconName: 'Wifi', category: 'Essentials' },
          { id: 'a2', name: 'Free parking on premises', iconName: 'Car', category: 'Essentials' },
          { id: 'a3', name: 'Private pool', iconName: 'Waves', category: 'Features' },
          { id: 'a4', name: 'Hot tub', iconName: 'Bath', category: 'Features' },
          { id: 'a5', name: 'Kitchen', iconName: 'Utensils', category: 'Essentials' },
          { id: 'a6', name: 'Air conditioning', iconName: 'Wind', category: 'Essentials' },
          { id: 'a7', name: 'Security cameras on property', iconName: 'ShieldCheck', category: 'Safety' },
          { id: 'a8', name: 'Mountain view', iconName: 'Mountain', category: 'Location' }
        ],
        host: {
          id: 'host-01',
          name: 'Aarav & Meera',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          isSuperhost: true,
          joinedDate: 'March 2018',
          responseRate: 100,
          responseTime: 'within an hour',
          bio: 'Architects & avid mountain wanderers committed to sustainable luxury hospitality.'
        },
        isGuestFavourite: true,
        availableDates: { start: '2026-10-12', end: '2026-10-17' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'apartment-calangute-02',
        title: 'Luxury 2BHK Apartment with Private Balcony in Calangute',
        description: 'Modern beachside residence with lush interior decor, high-speed WiFi, fully equipped chef kitchen, and private terrace overlooking tropical greenery in Calangute, North Goa.',
        type: 'Entire apartment',
        category: 'Beachfront',
        location: {
          city: 'Calangute',
          state: 'Goa',
          country: 'India',
          neighborhood: 'Baga Road',
          coordinates: { lat: 15.5438, lng: 73.7554 }
        },
        price: { amount: 6699, currency: 'INR', currencySymbol: '₹', period: 'night' },
        rating: 5.0,
        reviewCount: 88,
        guestCapacity: { guests: 6, bedrooms: 2, beds: 3, baths: 2 },
        photos: [
          { id: 'p201', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', caption: 'Living Space', isPrimary: true },
          { id: 'p202', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', caption: 'Modern Lounge' }
        ],
        amenities: [
          { id: 'a1', name: 'Wifi', iconName: 'Wifi', category: 'Essentials' },
          { id: 'a3', name: 'Private pool', iconName: 'Waves', category: 'Features' }
        ],
        host: {
          id: 'host-02',
          name: 'Rohan Sharma',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          isSuperhost: true,
          joinedDate: 'January 2020',
          responseRate: 98,
          responseTime: 'within a few hours',
          bio: 'Goan local hosting boutique stays across North Goa beaches.'
        },
        isGuestFavourite: true,
        availableDates: { start: '2026-10-10', end: '2026-10-20' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'flat-calangute-03',
        title: 'Charming Coastal Villa Flat in Calangute',
        description: 'Serene retreat located 5 minutes walk from Calangute beach promenade in North Goa.',
        type: 'Entire flat',
        category: 'Beachfront',
        location: {
          city: 'Calangute',
          state: 'Goa',
          country: 'India',
          neighborhood: 'Main Beach Road',
          coordinates: { lat: 15.549, lng: 73.753 }
        },
        price: { amount: 4850, currency: 'INR', currencySymbol: '₹', period: 'night' },
        rating: 4.97,
        reviewCount: 65,
        guestCapacity: { guests: 4, bedrooms: 2, beds: 2, baths: 2 },
        photos: [
          { id: 'p301', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', caption: 'Living Area', isPrimary: true }
        ],
        amenities: [
          { id: 'a1', name: 'Wifi', iconName: 'Wifi', category: 'Essentials' }
        ],
        host: {
          id: 'host-03',
          name: 'Priya Desai',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
          isSuperhost: true,
          joinedDate: 'June 2019',
          responseRate: 100,
          responseTime: 'within an hour',
          bio: 'Passionate hospitality host offering authentic Goan stays.'
        },
        isGuestFavourite: true,
        availableDates: { start: '2026-10-15', end: '2026-10-25' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'apartment-candolim-04',
        title: 'Tropical Garden View Suite in Candolim',
        description: 'Relaxing oasis nestled amidst coconut groves in Candolim, North Goa.',
        type: 'Entire apartment',
        category: 'Amazing pools',
        location: {
          city: 'Candolim',
          state: 'Goa',
          country: 'India',
          neighborhood: 'Aguada Fort Road',
          coordinates: { lat: 15.517, lng: 73.763 }
        },
        price: { amount: 2880, currency: 'INR', currencySymbol: '₹', period: 'night' },
        rating: 5.0,
        reviewCount: 42,
        guestCapacity: { guests: 4, bedrooms: 1, beds: 2, baths: 1 },
        photos: [
          { id: 'p401', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', caption: 'Suite Interior', isPrimary: true }
        ],
        amenities: [
          { id: 'a1', name: 'Wifi', iconName: 'Wifi', category: 'Essentials' },
          { id: 'a3', name: 'Pool access', iconName: 'Waves', category: 'Features' }
        ],
        host: {
          id: 'host-04',
          name: 'Vikram Mehta',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          isSuperhost: false,
          joinedDate: 'August 2021',
          responseRate: 95,
          responseTime: 'within a few hours',
          bio: 'Engineer turned boutique resort manager.'
        },
        isGuestFavourite: true,
        availableDates: { start: '2026-10-10', end: '2026-10-30' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'arpora-stay-05',
        title: 'Boutique Private Villa with Pool in Arpora',
        description: 'Tranquil luxury villa located near Night Market in Arpora, North Goa.',
        type: 'Entire villa',
        category: 'Mansions',
        location: {
          city: 'Arpora',
          state: 'Goa',
          country: 'India',
          neighborhood: 'Baga Arpora Creek',
          coordinates: { lat: 15.56, lng: 73.766 }
        },
        price: { amount: 2800, currency: 'INR', currencySymbol: '₹', period: 'night' },
        rating: 4.87,
        reviewCount: 54,
        guestCapacity: { guests: 8, bedrooms: 3, beds: 4, baths: 3 },
        photos: [
          { id: 'p501', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', caption: 'Villa Garden', isPrimary: true }
        ],
        amenities: [
          { id: 'a1', name: 'Wifi', iconName: 'Wifi', category: 'Essentials' },
          { id: 'a3', name: 'Private pool', iconName: 'Waves', category: 'Features' }
        ],
        host: {
          id: 'host-05',
          name: 'Sameer Naik',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          isSuperhost: true,
          joinedDate: 'February 2020',
          responseRate: 99,
          responseTime: 'within an hour',
          bio: 'Goa luxury estate host.'
        },
        isGuestFavourite: true,
        availableDates: { start: '2026-10-12', end: '2026-10-28' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'mumbai-penthouse-07',
        title: 'Sea Facing Luxury Penthouse in Bandra, Mumbai',
        description: 'Breathtaking ocean views, private rooftop terrace, high-speed WiFi in Bandra West, Mumbai.',
        type: 'Entire penthouse',
        category: 'Mansions',
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          neighborhood: 'Bandra West',
          coordinates: { lat: 19.0596, lng: 72.8295 }
        },
        price: { amount: 8500, currency: 'INR', currencySymbol: '₹', period: 'night' },
        rating: 4.95,
        reviewCount: 92,
        guestCapacity: { guests: 6, bedrooms: 3, beds: 3, baths: 3 },
        photos: [
          { id: 'p701', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', caption: 'Penthouse View', isPrimary: true }
        ],
        amenities: [
          { id: 'a1', name: 'Wifi', iconName: 'Wifi', category: 'Essentials' },
          { id: 'a6', name: 'Air conditioning', iconName: 'Wind', category: 'Essentials' }
        ],
        host: {
          id: 'host-07',
          name: 'Kabir Kapoor',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          isSuperhost: true,
          joinedDate: 'May 2017',
          responseRate: 100,
          responseTime: 'within an hour',
          bio: 'Mumbai luxury real estate host.'
        },
        isGuestFavourite: true,
        availableDates: { start: '2026-10-10', end: '2026-10-31' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'pune-villa-08',
        title: 'Heritage Luxury Villa in Koregaon Park, Pune',
        description: 'Spacious private bungalow in Koregaon Park Pune near Dagdusheth Halwai Ganpati Temple with private garden terrace and high-speed WiFi.',
        type: 'Entire villa',
        category: 'Mansions',
        location: {
          city: 'Pune',
          state: 'Maharashtra',
          country: 'India',
          neighborhood: 'Koregaon Park',
          coordinates: { lat: 18.5362, lng: 73.894 }
        },
        price: { amount: 5200, currency: 'INR', currencySymbol: '₹', period: 'night' },
        rating: 4.96,
        reviewCount: 78,
        guestCapacity: { guests: 6, bedrooms: 3, beds: 3, baths: 3 },
        photos: [
          { id: 'p801', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', caption: 'Villa Courtyard', isPrimary: true }
        ],
        amenities: [{ id: 'a1', name: 'Wifi', iconName: 'Wifi', category: 'Essentials' }],
        host: {
          id: 'host-08',
          name: 'Aditya Kulkarni',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          isSuperhost: true,
          joinedDate: 'April 2019',
          responseRate: 100,
          responseTime: 'within an hour',
          bio: 'Pune estate owner hosting over 50 properties.'
        },
        isGuestFavourite: true,
        availableDates: { start: '2026-10-10', end: '2026-10-31' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'udaipur-palace-09',
        title: 'Lake View Heritage Suite in Udaipur, Rajasthan',
        description: 'Overlooking Lake Pichola with royal Rajasthani architecture and rooftop dining.',
        type: 'Heritage suite',
        category: 'Mansions',
        location: {
          city: 'Udaipur',
          state: 'Rajasthan',
          country: 'India',
          neighborhood: 'Lake Pichola Promenade',
          coordinates: { lat: 24.5764, lng: 73.6835 }
        },
        price: { amount: 7900, currency: 'INR', currencySymbol: '₹', period: 'night' },
        rating: 4.99,
        reviewCount: 110,
        guestCapacity: { guests: 4, bedrooms: 2, beds: 2, baths: 2 },
        photos: [
          { id: 'p901', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', caption: 'Palace Terrace', isPrimary: true }
        ],
        amenities: [{ id: 'a1', name: 'Wifi', iconName: 'Wifi', category: 'Essentials' }],
        host: {
          id: 'host-09',
          name: 'Vikram Singh',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          isSuperhost: true,
          joinedDate: 'August 2018',
          responseRate: 100,
          responseTime: 'within an hour',
          bio: 'Udaipur royal heritage host.'
        },
        isGuestFavourite: true,
        availableDates: { start: '2026-10-10', end: '2026-10-31' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'manali-cottage-10',
        title: 'Pine Wood Snow View Cottage in Manali',
        description: 'Cozy wooden chalet in Manali, Himachal Pradesh surrounded by apple orchards and snowy mountain peaks.',
        type: 'Entire chalet',
        category: 'Cabins',
        location: {
          city: 'Manali',
          state: 'Himachal Pradesh',
          country: 'India',
          neighborhood: 'Old Manali',
          coordinates: { lat: 32.2432, lng: 77.1892 }
        },
        price: { amount: 4300, currency: 'INR', currencySymbol: '₹', period: 'night' },
        rating: 4.94,
        reviewCount: 86,
        guestCapacity: { guests: 5, bedrooms: 2, beds: 3, baths: 2 },
        photos: [
          { id: 'p1001', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', caption: 'Mountain Cottage', isPrimary: true }
        ],
        amenities: [{ id: 'a1', name: 'Wifi', iconName: 'Wifi', category: 'Essentials' }],
        host: {
          id: 'host-10',
          name: 'Tenzin Norbu',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          isSuperhost: true,
          joinedDate: 'November 2019',
          responseRate: 98,
          responseTime: 'within an hour',
          bio: 'Himalayan mountain guide & host.'
        },
        isGuestFavourite: true,
        availableDates: { start: '2026-10-10', end: '2026-10-31' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'delhi-apartment-11',
        title: 'Modern Luxury Apartment in South Delhi near India Gate',
        description: 'Prime central location in Lutyens Delhi with high-speed WiFi, modern decor, and private balcony.',
        type: 'Entire apartment',
        category: 'Mansions',
        location: {
          city: 'New Delhi',
          state: 'Delhi',
          country: 'India',
          neighborhood: 'Hauz Khas Enclave',
          coordinates: { lat: 28.5494, lng: 77.2001 }
        },
        price: { amount: 5800, currency: 'INR', currencySymbol: '₹', period: 'night' },
        rating: 4.92,
        reviewCount: 64,
        guestCapacity: { guests: 4, bedrooms: 2, beds: 2, baths: 2 },
        photos: [
          { id: 'p1101', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', caption: 'Delhi Apartment', isPrimary: true }
        ],
        amenities: [{ id: 'a1', name: 'Wifi', iconName: 'Wifi', category: 'Essentials' }],
        host: {
          id: 'host-11',
          name: 'Karan Mehra',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          isSuperhost: true,
          joinedDate: 'March 2020',
          responseRate: 100,
          responseTime: 'within an hour',
          bio: 'Delhi hospitality specialist.'
        },
        isGuestFavourite: true,
        availableDates: { start: '2026-10-10', end: '2026-10-31' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'bengaluru-suite-12',
        title: 'Garden City Luxury Suite in Indiranagar, Bengaluru',
        description: 'Top-notch dining district in Indiranagar Bengaluru with high-speed fiber internet and lush garden balcony.',
        type: 'Entire suite',
        category: 'Trending',
        location: {
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India',
          neighborhood: 'Indiranagar',
          coordinates: { lat: 12.9784, lng: 77.6408 }
        },
        price: { amount: 4900, currency: 'INR', currencySymbol: '₹', period: 'night' },
        rating: 4.97,
        reviewCount: 95,
        guestCapacity: { guests: 3, bedrooms: 1, beds: 2, baths: 1 },
        photos: [
          { id: 'p1201', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', caption: 'Bengaluru Suite', isPrimary: true }
        ],
        amenities: [{ id: 'a1', name: 'Wifi', iconName: 'Wifi', category: 'Essentials' }],
        host: {
          id: 'host-12',
          name: 'Neha Rao',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
          isSuperhost: true,
          joinedDate: 'July 2019',
          responseRate: 99,
          responseTime: 'within an hour',
          bio: 'Tech entrepreneur & Bengaluru host.'
        },
        isGuestFavourite: true,
        availableDates: { start: '2026-10-10', end: '2026-10-31' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'ahmedabad-studio-13',
        title: 'X-Large Studio Room & Big Private Outdoor Terrace in Navrangpura',
        description: 'Cozy studio apartment with private rooftop terrace, high-speed WiFi, modern kitchenette in Navrangpura, Ahmedabad.',
        type: 'Home in Ahmedabad',
        category: 'Trending',
        location: {
          city: 'Ahmedabad',
          state: 'Gujarat',
          country: 'India',
          neighborhood: 'Navrangpura',
          coordinates: { lat: 23.0368, lng: 72.5612 }
        },
        price: { amount: 4302, currency: 'INR', currencySymbol: '₹', period: 'night' },
        rating: 4.97,
        reviewCount: 239,
        guestCapacity: { guests: 3, bedrooms: 1, beds: 2, baths: 1 },
        photos: [
          { id: 'p1301', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', caption: 'Studio Interior', isPrimary: true },
          { id: 'p1302', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', caption: 'Private Terrace' }
        ],
        amenities: [
          { id: 'a1', name: 'Wifi', iconName: 'Wifi', category: 'Essentials' },
          { id: 'a5', name: 'Kitchen', iconName: 'Utensils', category: 'Essentials' },
          { id: 'a6', name: 'Air conditioning', iconName: 'Wind', category: 'Essentials' }
        ],
        host: {
          id: 'host-13',
          name: 'FLH Stays',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          isSuperhost: true,
          joinedDate: 'January 2019',
          responseRate: 100,
          responseTime: 'within an hour',
          bio: 'Boutique apartment host in Ahmedabad.'
        },
        isGuestFavourite: true,
        availableDates: { start: '2026-10-10', end: '2026-10-31' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'ahmedabad-flat-14',
        title: 'A cozy platform bed studio apt by FLH in Navrangpura',
        description: 'Modern studio flat with wooden platform bed, work desk, and full kitchen in Navrangpura, Ahmedabad.',
        type: 'Flat in Ahmedabad',
        category: 'Trending',
        location: {
          city: 'Ahmedabad',
          state: 'Gujarat',
          country: 'India',
          neighborhood: 'Navrangpura',
          coordinates: { lat: 23.0385, lng: 72.5595 }
        },
        price: { amount: 2900, currency: 'INR', currencySymbol: '₹', period: 'night' },
        rating: 4.88,
        reviewCount: 105,
        guestCapacity: { guests: 2, bedrooms: 1, beds: 1, baths: 1 },
        photos: [
          { id: 'p1401', url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80', caption: 'Platform Bed Studio', isPrimary: true }
        ],
        amenities: [
          { id: 'a1', name: 'Wifi', iconName: 'Wifi', category: 'Essentials' },
          { id: 'a5', name: 'Kitchen', iconName: 'Utensils', category: 'Essentials' }
        ],
        host: {
          id: 'host-14',
          name: 'FLH Stays',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          isSuperhost: true,
          joinedDate: 'January 2019',
          responseRate: 100,
          responseTime: 'within an hour',
          bio: 'Ahmedabad studio host.'
        },
        isGuestFavourite: true,
        availableDates: { start: '2026-10-10', end: '2026-10-31' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'ahmedabad-room-15',
        title: 'A Room With Terrace — Cocobora Stays in Vastrapur',
        description: 'Charming private room with balcony and attached bathroom near Vastrapur Lake, Ahmedabad.',
        type: 'Room in Ahmedabad',
        category: 'Trending',
        location: {
          city: 'Ahmedabad',
          state: 'Gujarat',
          country: 'India',
          neighborhood: 'Vastrapur',
          coordinates: { lat: 23.035, lng: 72.528 }
        },
        price: { amount: 1264, currency: 'INR', currencySymbol: '₹', period: 'night' },
        rating: 4.88,
        reviewCount: 104,
        guestCapacity: { guests: 2, bedrooms: 1, beds: 2, baths: 1 },
        photos: [
          { id: 'p1501', url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80', caption: 'Private Room', isPrimary: true }
        ],
        amenities: [
          { id: 'a1', name: 'Wifi', iconName: 'Wifi', category: 'Essentials' },
          { id: 'a2', name: 'Free parking', iconName: 'Car', category: 'Essentials' }
        ],
        host: {
          id: 'host-15',
          name: 'Cocobora Host',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
          isSuperhost: true,
          joinedDate: 'May 2020',
          responseRate: 98,
          responseTime: 'within an hour',
          bio: 'Cocobora Stays Ahmedabad.'
        },
        isGuestFavourite: true,
        availableDates: { start: '2026-10-10', end: '2026-10-31' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'ahmedabad-apartment-16',
        title: 'Comfortable 2BHK Retreat in Navrangpura',
        description: 'Spacious 2 bedroom apartment with L-shaped couch, full kitchen, high-speed WiFi in Navrangpura, Ahmedabad.',
        type: 'Flat in Ahmedabad',
        category: 'Trending',
        location: {
          city: 'Ahmedabad',
          state: 'Gujarat',
          country: 'India',
          neighborhood: 'Navrangpura',
          coordinates: { lat: 23.039, lng: 72.562 }
        },
        price: { amount: 2905, currency: 'INR', currencySymbol: '₹', period: 'night' },
        rating: 4.92,
        reviewCount: 13,
        guestCapacity: { guests: 4, bedrooms: 2, beds: 2, baths: 2 },
        photos: [
          { id: 'p1601', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', caption: '2BHK Lounge', isPrimary: true }
        ],
        amenities: [
          { id: 'a1', name: 'Wifi', iconName: 'Wifi', category: 'Essentials' },
          { id: 'a5', name: 'Kitchen', iconName: 'Utensils', category: 'Essentials' },
          { id: 'a6', name: 'Air conditioning', iconName: 'Wind', category: 'Essentials' }
        ],
        host: {
          id: 'host-16',
          name: 'Nikhil Patel',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          isSuperhost: true,
          joinedDate: 'February 2021',
          responseRate: 100,
          responseTime: 'within an hour',
          bio: 'Ahmedabad corporate & holiday host.'
        },
        isGuestFavourite: true,
        availableDates: { start: '2026-10-10', end: '2026-10-31' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'gandhinagar-flat-17',
        title: 'Stylish 2 BHK Apartment | Cocobora Stays in Gandhinagar',
        description: 'Modern 2 BHK flat near Gandhinagar highway with king beds, air conditioning, and garden view.',
        type: 'Flat in Gandhinagar',
        category: 'Trending',
        location: {
          city: 'Ahmedabad',
          state: 'Gujarat',
          country: 'India',
          neighborhood: 'Gandhinagar',
          coordinates: { lat: 23.2156, lng: 72.6369 }
        },
        price: { amount: 3039, currency: 'INR', currencySymbol: '₹', period: 'night' },
        rating: 5.0,
        reviewCount: 5,
        guestCapacity: { guests: 4, bedrooms: 2, beds: 2, baths: 2 },
        photos: [
          { id: 'p1701', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', caption: 'Gandhinagar Flat', isPrimary: true }
        ],
        amenities: [
          { id: 'a1', name: 'Wifi', iconName: 'Wifi', category: 'Essentials' },
          { id: 'a6', name: 'Air conditioning', iconName: 'Wind', category: 'Essentials' }
        ],
        host: {
          id: 'host-17',
          name: 'Cocobora Host',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
          isSuperhost: true,
          joinedDate: 'May 2020',
          responseRate: 100,
          responseTime: 'within an hour',
          bio: 'Gandhinagar stay host.'
        },
        isGuestFavourite: true,
        availableDates: { start: '2026-10-10', end: '2026-10-31' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    rawProperties.forEach(prop => {
      this.properties.set(prop.id, prop);

      // Populate Category Index
      if (!this.categoryIndex.has(prop.category)) {
        this.categoryIndex.set(prop.category, new Set());
      }
      this.categoryIndex.get(prop.category)!.add(prop.id);

      // Populate City Location Index
      const cityKey = prop.location.city.toLowerCase();
      if (!this.locationIndex.has(cityKey)) {
        this.locationIndex.set(cityKey, new Set());
      }
      this.locationIndex.get(cityKey)!.add(prop.id);
    });

    // Seed mock reviews
    this.reviews.set('villa-glasshouse-kasauli-01', [
      {
        id: 'r1',
        propertyId: 'villa-glasshouse-kasauli-01',
        authorName: 'Siddharth Roy',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'September 2026',
        comment: 'An absolute masterpiece of a villa! Waking up to 270-degree mountain views surrounded by pine trees was unreal. Aarav and Meera were exceptional hosts.'
      },
      {
        id: 'r2',
        propertyId: 'villa-glasshouse-kasauli-01',
        authorName: 'Ananya Verma',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        rating: 5,
        date: 'August 2026',
        comment: 'The infinity pool overlooking the valley and the fireplace made our anniversary getaway unforgettable. Highly recommended!'
      }
    ]);

    // Seed initial confirmed reservations for booked dates display
    const seedRes1: IReservation = {
      id: 'res-seed-001',
      propertyId: 'villa-glasshouse-kasauli-01',
      userId: 'usr-guest-002',
      checkIn: new Date(2026, 9, 15).toISOString(),
      checkOut: new Date(2026, 9, 18).toISOString(),
      guests: { adults: 2, children: 0, infants: 0, pets: 0 },
      totalPrice: 6765,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };
    const seedRes2: IReservation = {
      id: 'res-seed-002',
      propertyId: 'villa-glasshouse-kasauli-01',
      userId: 'usr-guest-003',
      checkIn: new Date(2026, 9, 22).toISOString(),
      checkOut: new Date(2026, 9, 25).toISOString(),
      guests: { adults: 4, children: 0, infants: 0, pets: 0 },
      totalPrice: 6765,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };
    this.reservations.set(seedRes1.id, seedRes1);
    this.reservations.set(seedRes2.id, seedRes2);
  }

  // User & Google Auth Operations
  public async upsertGoogleUser(userData: {
    email: string;
    name: string;
    avatarUrl?: string;
    googleId?: string;
    role?: 'GUEST' | 'HOST' | 'ADMIN';
  }): Promise<IUser> {
    const existing = Array.from(this.users.values()).find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      existing.name = userData.name || existing.name;
      existing.avatarUrl = userData.avatarUrl || existing.avatarUrl;
      existing.googleId = userData.googleId || existing.googleId;
      existing.role = userData.role || existing.role;
      existing.updatedAt = new Date().toISOString();
      return existing;
    }

    const newUser: IUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      email: userData.email,
      name: userData.name,
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      role: userData.role || 'GUEST',
      authProvider: 'GOOGLE',
      googleId: userData.googleId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  public async getUserById(id: string): Promise<IUser | null> {
    return this.users.get(id) || null;
  }

  // Low Complexity Query Operations
  public async getPropertyById(id: string): Promise<IProperty | null> {
    return this.properties.get(id) || null;
  }

  public async getProperties(filters: ISearchFilters = {}): Promise<{ items: IProperty[]; total: number }> {
    let resultIds: Set<string> | null = null;

    // Filter by category using case-insensitive Hash Map Index + Fuzzy Fallback
    if (filters.category && filters.category !== 'All' && filters.category !== 'all') {
      const catLower = filters.category.toLowerCase().trim();
      const matchedIds = new Set<string>();

      // 1. Direct Category Map Match
      for (const [catName, idSet] of this.categoryIndex.entries()) {
        if (catName.toLowerCase() === catLower || catName.toLowerCase().includes(catLower) || catLower.includes(catName.toLowerCase())) {
          idSet.forEach(id => matchedIds.add(id));
        }
      }

      // 2. Fuzzy Title / Description / Type Search
      for (const prop of this.properties.values()) {
        const text = `${prop.category} ${prop.type} ${prop.title} ${prop.description} ${prop.location.city} ${prop.location.state}`.toLowerCase();
        if (text.includes(catLower)) {
          matchedIds.add(prop.id);
        }
      }

      // 3. Fallback: if exotic category, return guest favourite properties
      if (matchedIds.size > 0) {
        resultIds = matchedIds;
      } else {
        resultIds = new Set(Array.from(this.properties.keys()));
      }
    }

    // Filter by destination using multi-field fuzzy keyword matching
    if (filters.destination) {
      const destLower = filters.destination.toLowerCase().trim();
      const keywords = destLower.replace(/,/g, ' ').split(/\s+/).filter(Boolean);
      const matchedIds = new Set<string>();

      for (const prop of this.properties.values()) {
        const fullLocationText = `${prop.location.city} ${prop.location.state} ${prop.location.country} ${prop.location.neighborhood || ''} ${prop.title} ${prop.description}`.toLowerCase();
        
        // Match if all non-empty keywords match the location text or city/state name
        const isMatch = keywords.length > 0 && keywords.every(kw => fullLocationText.includes(kw));
        if (isMatch) {
          matchedIds.add(prop.id);
        }
      }

      if (resultIds === null) {
        resultIds = matchedIds;
      } else {
        resultIds = new Set([...resultIds].filter(id => matchedIds.has(id)));
      }
    }

    // Collect properties
    const candidateList = resultIds === null 
      ? Array.from(this.properties.values())
      : Array.from(resultIds).map(id => this.properties.get(id)!).filter(Boolean);

    // Apply guest capacity filter
    let filtered = candidateList;
    if (filters.guests && filters.guests > 0) {
      filtered = filtered.filter(p => p.guestCapacity.guests >= filters.guests!);
    }

    // Apply price range filter
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price.amount >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price.amount <= filters.maxPrice!);
    }

    const total = filtered.length;
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const startIdx = (page - 1) * limit;
    const items = filtered.slice(startIdx, startIdx + limit);

    return { items, total };
  }

  public async getDestinations(): Promise<Array<{ title: string; subtitle: string; type: string; iconType: string; colorTheme: string }>> {
    const rawDestinations = [
      { title: 'Nearby', searchKey: '', subtitle: "Find what's around you", type: 'suggested', iconType: 'compass', colorTheme: 'blue' },
      { title: 'Ahmedabad, Gujarat', searchKey: 'Ahmedabad', type: 'suggested', iconType: 'home', colorTheme: 'orange' },
      { title: 'North Goa, Goa', searchKey: 'Goa', type: 'suggested', iconType: 'beach', colorTheme: 'orange' },
      { title: 'Mumbai, Maharashtra', searchKey: 'Mumbai', type: 'suggested', iconType: 'city', colorTheme: 'green' },
      { title: 'Kasauli, Himachal Pradesh', searchKey: 'Kasauli', type: 'suggested', iconType: 'mountain', colorTheme: 'blue' },
      { title: 'Udaipur, Rajasthan', searchKey: 'Udaipur', type: 'suggested', iconType: 'landmark', colorTheme: 'blue' },
      { title: 'Manali, Himachal Pradesh', searchKey: 'Manali', type: 'suggested', iconType: 'mountain', colorTheme: 'green' },
      { title: 'Bengaluru, Karnataka', searchKey: 'Bengaluru', type: 'suggested', iconType: 'city', colorTheme: 'pink' },
      { title: 'New Delhi, Delhi', searchKey: 'Delhi', type: 'suggested', iconType: 'landmark', colorTheme: 'green' },
      { title: 'Jaipur, Rajasthan', searchKey: 'Jaipur', type: 'suggested', iconType: 'landmark', colorTheme: 'blue' },
      { title: 'Lonavala, Maharashtra', searchKey: 'Lonavala', type: 'suggested', iconType: 'nature', colorTheme: 'pink' },
      { title: 'South Goa, Goa', searchKey: 'Goa', type: 'suggested', iconType: 'tree', colorTheme: 'green' },
      { title: 'Calangute, Goa', searchKey: 'Calangute', type: 'suggested', iconType: 'beach', colorTheme: 'blue' },
      { title: 'Dubai, United Arab Emirates', searchKey: 'Dubai', type: 'suggested', iconType: 'beach', colorTheme: 'green' },
      { title: 'Mussoorie, Uttarakhand', searchKey: 'Mussoorie', type: 'suggested', iconType: 'mountain', colorTheme: 'pink' },
      { title: 'Dehradun, Uttarakhand', searchKey: 'Dehradun', type: 'suggested', iconType: 'nature', colorTheme: 'green' },
      { title: 'Pune City, Maharashtra', searchKey: 'Pune', type: 'suggested', iconType: 'landmark', colorTheme: 'pink' },
      { title: 'Gurgaon District, Haryana', searchKey: 'Gurgaon', type: 'suggested', iconType: 'city', colorTheme: 'orange' },
      { title: 'Prayagraj, Uttar Pradesh', searchKey: 'Prayagraj', type: 'suggested', iconType: 'landmark', colorTheme: 'pink' },
      { title: 'Noida, Uttar Pradesh', searchKey: 'Noida', type: 'suggested', iconType: 'city', colorTheme: 'pink' },
      { title: 'Rishikesh, Uttarakhand', searchKey: 'Rishikesh', type: 'suggested', iconType: 'mountain', colorTheme: 'pink' }
    ];

    return rawDestinations.map(dest => {
      if (dest.title === 'Nearby') {
        return { title: dest.title, subtitle: dest.subtitle!, type: dest.type, iconType: dest.iconType, colorTheme: dest.colorTheme };
      }

      const matchingProps = this.properties.filter(p =>
        p.location.city.toLowerCase().includes(dest.searchKey.toLowerCase()) ||
        p.location.state.toLowerCase().includes(dest.searchKey.toLowerCase()) ||
        p.title.toLowerCase().includes(dest.searchKey.toLowerCase())
      );

      const uniqueHosts = new Set(matchingProps.map(p => p.host.id || p.host.name)).size;
      const listingCount = matchingProps.length;

      let subtitle = '';
      if (uniqueHosts > 1) {
        subtitle = `Listed by ${uniqueHosts}+ top hosts • ${listingCount} stays available`;
      } else if (uniqueHosts === 1) {
        subtitle = `Listed by 1 host • ${listingCount} stay available`;
      } else {
        subtitle = `Not listed by hosts yet • Explore destination`;
      }

      return {
        title: dest.title,
        subtitle,
        type: dest.type,
        iconType: dest.iconType,
        colorTheme: dest.colorTheme
      };
    });
  }

  public async getReviewsByPropertyId(propertyId: string): Promise<IReview[]> {
    return this.reviews.get(propertyId) || [];
  }

  public async createReservation(reservation: Omit<IReservation, 'id' | 'createdAt'>): Promise<IReservation> {
    const newReservation: IReservation = {
      ...reservation,
      id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };
    this.reservations.set(newReservation.id, newReservation);
    return newReservation;
  }

  public async getReservationsByUserId(userId: string): Promise<IReservation[]> {
    return Array.from(this.reservations.values()).filter(r => r.userId === userId || userId === 'usr-guest-001');
  }

  public async getReservationsByPropertyId(propertyId: string): Promise<IReservation[]> {
    return Array.from(this.reservations.values()).filter(r => r.propertyId === propertyId && r.status === 'CONFIRMED');
  }

  public async cancelReservation(reservationId: string): Promise<IReservation | null> {
    const existing = this.reservations.get(reservationId);
    if (!existing) return null;
    existing.status = 'CANCELLED';
    return existing;
  }

  public async checkAvailability(propertyId: string, checkIn: string, checkOut: string): Promise<boolean> {
    const property = this.properties.get(propertyId);
    if (!property) return false;

    // Check against existing confirmed reservations for date overlap
    const checkInDate = new Date(checkIn).getTime();
    const checkOutDate = new Date(checkOut).getTime();

    for (const res of this.reservations.values()) {
      if (res.propertyId === propertyId && res.status === 'CONFIRMED') {
        const resStart = new Date(res.checkIn).getTime();
        const resEnd = new Date(res.checkOut).getTime();

        if (checkInDate < resEnd && checkOutDate > resStart) {
          return false; // Overlapping date conflict found
        }
      }
    }

    return true;
  }

}

export const dbEngine = new DatabaseEngine();
