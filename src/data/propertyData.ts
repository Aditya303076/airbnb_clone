import type { Property } from '../types/property';

export const mockProperty: Property = {
  id: 'villa-glasshouse-kasauli-01',
  title: 'The Glass House — Luxury Cliffside Villa with Panoramic Mountain Views',
  tagline: 'Entire villa in Kasauli, Himachal Pradesh, India',
  type: 'Entire villa',
  location: {
    city: 'Kasauli',
    state: 'Himachal Pradesh',
    country: 'India',
    neighborhood: 'Upper Mall Road Estates',
    lat: 30.9013,
    lng: 76.9649,
  },
  rating: 4.98,
  reviewCount: 124,
  isSuperhost: true,
  guestsMax: 10,
  bedrooms: 4,
  beds: 5,
  baths: 4.5,
  host: {
    name: 'Aarav & Meera Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    isSuperhost: true,
    joinedDate: 'March 2018',
    yearsHosting: 7,
    ratingCount: 482,
    responseRate: 100,
    responseTime: 'within an hour',
    bio: 'Architect & Interior Designer couple with a passion for sustainable luxury hospitality. We built The Glass House to blend seamless indoor-outdoor living in the tranquil pine forests of Kasauli.',
    coHosts: [
      { name: 'Rohan (Property Manager)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' }
    ]
  },
  photos: [
    {
      id: 'photo-1',
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
      caption: 'Main glass façade showing sunset over the Himalayan pine canopy',
      category: 'Exterior & Views',
      isHero: true,
      heroPosition: 'main'
    },
    {
      id: 'photo-2',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85',
      caption: 'Sun-drenched double-height living room with Italian marble floor',
      category: 'Living Room',
      isHero: true,
      heroPosition: 'top-right'
    },
    {
      id: 'photo-3',
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85',
      caption: 'Gourmet chef kitchen with teak breakfast bar and view of the valley',
      category: 'Kitchen & Dining',
      isHero: true,
      heroPosition: 'top-far-right'
    },
    {
      id: 'photo-4',
      url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=85',
      caption: 'Master Suite 1 with private wooden deck and king-size bed',
      category: 'Bedrooms',
      isHero: true,
      heroPosition: 'bottom-right'
    },
    {
      id: 'photo-5',
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=85',
      caption: 'Spa-style master bathroom featuring freestanding soaking tub',
      category: 'Bathrooms',
      isHero: true,
      heroPosition: 'bottom-far-right'
    },
    {
      id: 'photo-6',
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
      caption: 'Outdoor heated infinity jacuzzi deck overlooking valley fog',
      category: 'Exterior & Views'
    },
    {
      id: 'photo-7',
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
      caption: 'Cosy fireplace corner in the main lounge area',
      category: 'Living Room'
    },
    {
      id: 'photo-8',
      url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85',
      caption: 'Suite 2 featuring floor-to-ceiling glass corner windows',
      category: 'Bedrooms'
    },
    {
      id: 'photo-9',
      url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=85',
      caption: 'Suite 3 with twin queen beds and mountain morning light',
      category: 'Bedrooms'
    },
    {
      id: 'photo-10',
      url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=85',
      caption: '10-seater walnut dining table illuminated by designer pendant lights',
      category: 'Kitchen & Dining'
    },
    {
      id: 'photo-11',
      url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=85',
      caption: 'En-suite shower room with rain shower and mountain vistas',
      category: 'Bathrooms'
    },
    {
      id: 'photo-12',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
      caption: 'Sunroom lounge with curated library and coffee bar',
      category: 'Living Room'
    },
    {
      id: 'photo-13',
      url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=85',
      caption: 'Private lawn & bonfire pit under stargazing skies',
      category: 'Exterior & Views'
    },
    {
      id: 'photo-14',
      url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
      caption: 'Suite 4 (Garden Level) opening directly to lower terrace',
      category: 'Bedrooms'
    },
    {
      id: 'photo-15',
      url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85',
      caption: 'Fully equipped bar counter and wine chiller',
      category: 'Kitchen & Dining'
    }
  ],
  highlights: [
    {
      id: 'hl-1',
      iconName: 'sparkles',
      title: 'Designated Superhost',
      subtitle: 'Aarav & Meera have 482 reviews with a 99% 5-star rating for hospitality.'
    },
    {
      id: 'hl-2',
      iconName: 'workspace',
      title: 'Dedicated 500 Mbps Fiber Workspace',
      subtitle: 'Ergonomic chairs with dual monitor setups in two separate quiet study nooks.'
    },
    {
      id: 'hl-3',
      iconName: 'checkin',
      title: 'Seamless Self Check-in with Smart Lock',
      subtitle: 'Check yourself in anytime after 3:00 PM with keypad access.'
    },
    {
      id: 'hl-4',
      iconName: 'cancellation',
      title: 'Free Cancellation for 48 Hours',
      subtitle: 'Full refund if you cancel up to 14 days before your check-in date.'
    }
  ],
  description: `Welcome to The Glass House — an architectural masterpiece perched on a private ridge in Upper Kasauli, offering unobstructed 270-degree views of the Shimla Hills and distant snow-capped Himalayan peaks.

Designed by award-winning architects, this 5,500 sq ft luxury residence seamlessly connects floor-to-ceiling glass walls with warm reclaimed timber and natural stone finishes.

### The Space
- **Grand Living Room**: Soaring 20-foot ceilings, automated mood lighting, central stone fireplace, and Bose surround sound system.
- **Bedrooms**: 4 ultra-luxurious suites fitted with orthopedic plush mattresses, 400-thread-count Egyptian cotton linens, blackout motorized blinds, and private balconies.
- **Dining & Culinary**: Fully equipped gourmet kitchen with SMEG appliances, espresso machine, wine chiller, and full-time private chef on call upon request.
- **Outdoors**: Heated private Jacuzzi, wrap-around cedar deck, outdoor barbecue grill, and private pine garden with fire pit.`,
  sleepingArrangements: [
    { roomName: 'Bedroom 1 (Master Suite)', bedDescription: '1 King Bed + En-suite Jacuzzi Bath', iconType: 'king' },
    { roomName: 'Bedroom 2 (Valley View)', bedDescription: '1 Queen Bed + Private Balcony', iconType: 'queen' },
    { roomName: 'Bedroom 3 (Garden Level)', bedDescription: '2 Double Beds', iconType: 'double' },
    { roomName: 'Bedroom 4 (Pine Nook)', bedDescription: '1 Queen Bed', iconType: 'queen' }
  ],
  amenities: [
    { id: 'a1', name: 'Valley & Mountain View', iconName: 'mountain', category: 'Popular', isTopAmenity: true },
    { id: 'a2', name: 'High-speed Fiber WiFi (500 Mbps)', iconName: 'wifi', category: 'Popular', isTopAmenity: true },
    { id: 'a3', name: 'Private Outdoor Heated Jacuzzi', iconName: 'hot-tub', category: 'Popular', isTopAmenity: true },
    { id: 'a4', name: 'Indoor Fireplace (Wood Provided)', iconName: 'flame', category: 'Popular', isTopAmenity: true },
    { id: 'a5', name: 'Dedicated Workspace', iconName: 'laptop', category: 'Popular', isTopAmenity: true },
    { id: 'a6', name: 'Free On-site Covered Parking (4 Cars)', iconName: 'car', category: 'Popular', isTopAmenity: true },
    { id: 'a7', name: 'Chef Kitchen with SMEG Appliances', iconName: 'chef-hat', category: 'Kitchen & Dining', isTopAmenity: true },
    { id: 'a8', name: '55" OLED 4K TV with Netflix & PS5', iconName: 'tv', category: 'Entertainment', isTopAmenity: true },
    { id: 'a9', name: 'Washer & Dryer in Utility Room', iconName: 'washing-machine', category: 'Bedroom & Laundry', isTopAmenity: true },
    { id: 'a10', name: 'Central Heating & AC Units', iconName: 'snowflake', category: 'Heating & Cooling', isTopAmenity: true },
    { id: 'a11', name: 'Freestanding Bathtub', iconName: 'bath', category: 'Bathroom' },
    { id: 'a12', name: 'Espresso Machine & Coffee Bar', iconName: 'coffee', category: 'Kitchen & Dining' },
    { id: 'a13', name: 'Outdoor Barbecue Charcoal Grill', iconName: 'utensils', category: 'Outdoor' },
    { id: 'a14', name: 'Bonfire Pit with Firewood', iconName: 'flame', category: 'Outdoor' },
    { id: 'a15', name: 'Security Cameras on Property Exterior', iconName: 'shield', category: 'Safety' },
    { id: 'a16', name: 'Smoke & Carbon Monoxide Detectors', iconName: 'alert-circle', category: 'Safety' }
  ],
  reviewCategoryScores: {
    cleanliness: 5.0,
    accuracy: 4.98,
    checkIn: 5.0,
    communication: 4.97,
    location: 4.99,
    value: 4.94
  },
  reviews: [
    {
      id: 'rev-1',
      author: 'Vikram Malhotra',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      authorLocation: 'New Delhi, India',
      date: 'September 2026',
      rating: 5,
      comment: 'An absolute masterpiece of a home! The glass walls framing the sunset were breathtaking. The heated jacuzzi under the stars was the highlight of our weekend trip. Aarav and Rohan made sure every detail was taken care of.',
      stayDuration: 'Stayed 3 nights with family'
    },
    {
      id: 'rev-2',
      author: 'Priya Sundaram',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      authorLocation: 'Bengaluru, India',
      date: 'August 2026',
      rating: 5,
      comment: 'We spent a week working remotely from The Glass House. Fast internet, flawless peaceful atmosphere, crisp mountain air, and delicious meals prepared by Chef Ramesh. Will definitely be returning every year!',
      stayDuration: 'Stayed 7 nights'
    },
    {
      id: 'rev-3',
      author: 'David & Sarah Miller',
      authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
      authorLocation: 'London, UK',
      date: 'July 2026',
      rating: 5,
      comment: 'Having stayed in luxury Airbnb listings around the world, this is easily in our top 3. Spotless cleanliness, ultra-comfortable beds, and architectural symmetry that makes every photo look like an AD magazine shoot.',
      stayDuration: 'Stayed 4 nights'
    },
    {
      id: 'rev-4',
      author: 'Kavita Roy',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      authorLocation: 'Mumbai, India',
      date: 'June 2026',
      rating: 5,
      comment: 'Celebrated my 40th birthday here with friends. The kitchen is fully equipped for large meals, the outdoor terrace with pine views is magical, and check-in was smooth. Worth every rupee.',
      stayDuration: 'Stayed 2 nights'
    },
    {
      id: 'rev-5',
      author: 'Anand Kapoor',
      authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      authorLocation: 'Chandigarh, India',
      date: 'May 2026',
      rating: 5,
      comment: 'Incredible property! Very secluded yet only 10 minutes drive from Kasauli Mall Road. The morning tea on the balcony watching valley fog lift is unforgettable.',
      stayDuration: 'Stayed 3 nights'
    },
    {
      id: 'rev-6',
      author: 'Natasha Verma',
      authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      authorLocation: 'Gurugram, India',
      date: 'April 2026',
      rating: 5,
      comment: 'Superb host communication! The fireplace had plenty of logs, water pressure in all 4 bathrooms was great, and heating kept the villa cozy at night.',
      stayDuration: 'Stayed 5 nights'
    }
  ],
  price: {
    perNight: 18500,
    currencySymbol: '₹',
    currencyCode: 'INR',
    originalPerNight: 22000,
    cleaningFee: 2500,
    serviceFee: 3200,
    taxRatePercentage: 18
  }
};
