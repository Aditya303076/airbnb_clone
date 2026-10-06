import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, Globe, Menu, User, MapPin, Compass,
  Waves, Building2, Trees, Mountain, Landmark, Home
} from 'lucide-react';
import { LanguageModal } from '../Modals/LanguageModal';
import { LoginModal } from '../Modals/LoginModal';
import { LocationService, getNearestCity } from '../../services/locationService';
import { ApiClient } from '../../services/apiClient';
import './Header.css';

interface HeaderProps {
  isCompactOnly?: boolean;
  hideSearch?: boolean;
  showAllTab?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isCompactOnly = false,
  hideSearch = false,
  showAllTab = false
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(() => {
    try {
      const userStr = localStorage.getItem('airbnb_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const syncUser = () => {
      const userStr = localStorage.getItem('airbnb_user');
      try {
        setCurrentUser(userStr ? JSON.parse(userStr) : null);
      } catch {
        setCurrentUser(null);
      }
    };
    window.addEventListener('authChange', syncUser);
    return () => window.removeEventListener('authChange', syncUser);
  }, []);

  const [activeNavTab, setActiveNavTab] = useState<'all' | 'homes' | 'experiences' | 'services'>(showAllTab ? 'all' : 'homes');
  const [isScrolled, setIsScrolled] = useState(isCompactOnly);

  // Active Inline Search Dropdown State ('where' | 'when' | 'who' | null)
  const [activeSearchTab, setActiveSearchTab] = useState<'where' | 'when' | 'who' | null>(null);
  const [selectedWhere, setSelectedWhere] = useState<string>(searchParams.get('destination') || '');
  const [guestCounts, setGuestCounts] = useState({ adults: 0, children: 0, infants: 0, pets: 0 });
  const [selectedDates, setSelectedDates] = useState<{ start: number | null; end: number | null }>({ start: 11, end: 12 });

  // Session-based Recent Searches State (Clears when session ends or expires)
  const [recentSearches, setRecentSearches] = useState<Array<{ title: string; subtitle: string }>>(() => {
    try {
      const stored = sessionStorage.getItem('airbnb_recent_searches');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      /* ignore session storage errors */
    }
    return [];
  });

  const saveRecentSearch = (dest: string) => {
    if (!dest || !dest.trim()) return;
    const cleanDest = dest.trim();
    const newEntry = { title: cleanDest, subtitle: '11-12 Oct' };
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.title.toLowerCase() !== cleanDest.toLowerCase());
      const updated = [newEntry, ...filtered].slice(0, 4);
      try {
        sessionStorage.setItem('airbnb_recent_searches', JSON.stringify(updated));
      } catch {
        /* ignore session storage errors */
      }
      return updated;
    });
  };

  useEffect(() => {
    const dest = searchParams.get('destination');
    if (dest !== null) {
      setSelectedWhere(dest);
    }
  }, [searchParams]);

  const [destinations, setDestinations] = useState<Array<{ title: string; subtitle: string; type: string; iconType?: string; colorTheme?: string }>>([
    { title: 'Nearby', subtitle: "Find what's around you", type: 'suggested', iconType: 'compass', colorTheme: 'blue' },
    { title: 'Ahmedabad, Gujarat', subtitle: 'Listed by 3+ top hosts • 5 stays available', type: 'suggested', iconType: 'home', colorTheme: 'orange' },
    { title: 'North Goa, Goa', subtitle: 'Listed by 4+ top hosts • 4 stays available', type: 'suggested', iconType: 'beach', colorTheme: 'orange' },
    { title: 'Mumbai, Maharashtra', subtitle: 'Listed by 2+ top hosts • 2 stays available', type: 'suggested', iconType: 'city', colorTheme: 'green' },
    { title: 'Kasauli, Himachal Pradesh', subtitle: 'Listed by 2+ top hosts • 2 stays available', type: 'suggested', iconType: 'mountain', colorTheme: 'blue' },
    { title: 'Udaipur, Rajasthan', subtitle: 'Listed by 2+ top hosts • 2 stays available', type: 'suggested', iconType: 'landmark', colorTheme: 'blue' },
    { title: 'Manali, Himachal Pradesh', subtitle: 'Listed by 2+ top hosts • 2 stays available', type: 'suggested', iconType: 'mountain', colorTheme: 'green' },
    { title: 'Bengaluru, Karnataka', subtitle: 'Listed by 2+ top hosts • 2 stays available', type: 'suggested', iconType: 'city', colorTheme: 'pink' },
    { title: 'New Delhi, Delhi', subtitle: 'Listed by 1 host • Stay available', type: 'suggested', iconType: 'landmark', colorTheme: 'green' },
    { title: 'Jaipur, Rajasthan', subtitle: 'Listed by 1 host • Stay available', type: 'suggested', iconType: 'landmark', colorTheme: 'blue' },
    { title: 'Lonavala, Maharashtra', subtitle: 'Listed by 1 host • Stay available', type: 'suggested', iconType: 'nature', colorTheme: 'pink' },
    { title: 'South Goa, Goa', subtitle: 'Listed by 1 host • Stay available', type: 'suggested', iconType: 'tree', colorTheme: 'green' },
    { title: 'Dubai, United Arab Emirates', subtitle: 'Not listed by hosts yet • Explore destination', type: 'suggested', iconType: 'beach', colorTheme: 'green' },
    { title: 'Mussoorie, Uttarakhand', subtitle: 'Not listed by hosts yet • Explore destination', type: 'suggested', iconType: 'mountain', colorTheme: 'pink' },
    { title: 'Dehradun, Uttarakhand', subtitle: 'Not listed by hosts yet • Explore destination', type: 'suggested', iconType: 'nature', colorTheme: 'green' },
    { title: 'Pune City, Maharashtra', subtitle: 'Not listed by hosts yet • Explore destination', type: 'suggested', iconType: 'landmark', colorTheme: 'pink' },
    { title: 'Gurgaon District, Haryana', subtitle: 'Not listed by hosts yet • Explore destination', type: 'suggested', iconType: 'city', colorTheme: 'orange' },
    { title: 'Calangute, Goa', subtitle: 'Listed by 1 host • Stay available', type: 'suggested', iconType: 'beach', colorTheme: 'blue' },
    { title: 'Prayagraj, Uttar Pradesh', subtitle: 'Not listed by hosts yet • Explore destination', type: 'suggested', iconType: 'landmark', colorTheme: 'pink' },
    { title: 'Noida, Uttar Pradesh', subtitle: 'Not listed by hosts yet • Explore destination', type: 'suggested', iconType: 'city', colorTheme: 'pink' },
    { title: 'Rishikesh, Uttarakhand', subtitle: 'Not listed by hosts yet • Explore destination', type: 'suggested', iconType: 'mountain', colorTheme: 'pink' }
  ]);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    ApiClient.getDestinations().then(res => {
      if (isMounted && res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setDestinations(res.data);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const updateGuests = (type: 'adults' | 'children' | 'infants' | 'pets', delta: number) => {
    setGuestCounts(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta)
    }));
  };

  const totalGuests = guestCounts.adults + guestCounts.children + guestCounts.infants + guestCounts.pets;

  // Calendar Day Arrays
  const octDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const octOffset = 4; // Oct 1 is Thursday
  const novDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const novOffset = 0; // Nov 1 is Sunday

  const handleDateClick = (day: number) => {
    if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
      setSelectedDates({ start: day, end: null });
    } else if (selectedDates.start && !selectedDates.end) {
      if (day >= selectedDates.start) {
        setSelectedDates({ ...selectedDates, end: day });
        setActiveSearchTab('who');
      } else {
        setSelectedDates({ start: day, end: null });
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setActiveSearchTab(null);
        if (isCompactOnly) {
          setIsScrolled(true);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCompactOnly]);

  // Lock body scroll when search bar popover is active
  useEffect(() => {
    if (activeSearchTab !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeSearchTab]);

  useEffect(() => {
    if (isCompactOnly) {
      setIsScrolled(true);
      return;
    }

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 20;
          setIsScrolled(prev => prev !== scrolled ? scrolled : prev);
          if (scrolled) setActiveSearchTab(null);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isCompactOnly]);

  const handleCompactSearchClick = (tab: 'where' | 'when' | 'who' = 'where') => {
    setIsScrolled(false);
    setActiveSearchTab(tab);
  };

  const handleSearchSubmit = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    setActiveSearchTab(null);
    if (isCompactOnly) {
      setIsScrolled(true);
    }
    if (selectedWhere.trim()) {
      saveRecentSearch(selectedWhere);
      LocationService.trackActivity('SEARCH', { destination: selectedWhere.trim(), guests: totalGuests });
    }
    const params = new URLSearchParams();
    if (selectedWhere.trim()) params.append('destination', selectedWhere.trim());
    if (totalGuests > 0) params.append('guests', totalGuests.toString());
    navigate(`/?${params.toString()}`);
  };

  const selectDestination = async (dest: string) => {
    if (dest === 'Nearby') {
      setSelectedWhere('Detecting location...');
      LocationService.trackActivity('SEARCH', { query: 'Nearby', trigger: 'USER_CLICK_NEARBY' });
      const coords = await LocationService.getCurrentCoordinates();
      const detectedCity = getNearestCity(coords);
      setSelectedWhere(detectedCity);
      saveRecentSearch(detectedCity);
      LocationService.trackActivity('GEOLOCATION_DETECTED', { coords, matchedCity: detectedCity });
    } else {
      setSelectedWhere(dest);
      saveRecentSearch(dest);
      LocationService.trackActivity('SEARCH', { destination: dest });
    }
    setActiveSearchTab('when');
  };

  const isExpanded = !isScrolled || !!activeSearchTab;

  const renderDestinationIcon = (iconType?: string, colorTheme?: string) => {
    const boxClass = `item-icon-box ${colorTheme || 'blue'}-box`;
    switch (iconType) {
      case 'compass':
        return <div className={boxClass}><Compass size={22} color="#0066FF" /></div>;
      case 'beach':
        return <div className={boxClass}><Waves size={22} color="#E07A5F" /></div>;
      case 'city':
        return <div className={boxClass}><Building2 size={22} color="#2A9D8F" /></div>;
      case 'nature':
      case 'tree':
        return <div className={boxClass}><Trees size={22} color="#2A9D8F" /></div>;
      case 'mountain':
        return <div className={boxClass}><Mountain size={22} color="#264653" /></div>;
      case 'landmark':
        return <div className={boxClass}><Landmark size={22} color="#D70466" /></div>;
      case 'home':
      default:
        return <div className={boxClass}><Home size={22} color="#E00B41" /></div>;
    }
  };

  return (
    <>
      {/* Translucent Dim Overlay behind active search dropdown */}
      {activeSearchTab && (
        <div
          className="search-backdrop-dim animate-fade-in"
          onClick={() => {
            setActiveSearchTab(null);
            if (isCompactOnly) setIsScrolled(true);
          }}
        />
      )}

      <header className={`site-header ${isScrolled && !activeSearchTab ? 'scrolled' : 'expanded-header'} ${activeSearchTab ? 'is-active-search' : ''}`}>
        <div className="header-container" ref={searchContainerRef}>
          {/* Top horizontal row */}
          <div className="header-top-row">
            <Link to="/" className="header-logo" aria-label="Airbnb Homepage">
              <svg className="airbnb-logo-icon" viewBox="0 0 32 32" width="34" height="34" fill="#FF385C">
                <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.315c0 4.908-3.784 8.806-8.5 8.806-3.1 0-5.742-1.701-7.228-4.276L13.5 28.5l-.272.224C11.742 30.299 9.1 32 6 32 1.284 32-2.5 28.102-2.5 23.194c0-.924.243-1.805.91-3.396l.145-.353c.986-2.297 5.146-11.007 7.1-14.836l.533-1.025C7.472 1.963 8.927 1 10.935 1H16zm0 3h-5.065c-1.077 0-2.023.535-2.923 2.144L7.5 7.125c-1.9 3.725-5.973 12.28-6.9 14.444-.567 1.353-.75 2.025-.75 2.625 0 3.336 2.5 6 5.5 6 2.19 0 4.148-1.258 5.25-3.125l.394-.71.394.71C12.488 28.058 14.446 29.316 16.636 29.316c3 0 5.5-2.664 5.5-6 0-.6-.183-1.272-.75-2.625-.927-2.164-5-10.719-6.9-14.444l-.478-.981C13.111 4.535 12.165 4 11.088 4H16zm0 11a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
              </svg>
              <span className="logo-text">airbnb</span>
            </Link>

            {/* Center Nav */}
            {!hideSearch && (
              <div className="header-center-nav">
                <div className={`top-nav-tabs ${isExpanded ? 'visible' : 'hidden'}`}>
                  {showAllTab && (
                    <button
                      className={`top-tab-btn ${activeNavTab === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveNavTab('all')}
                    >
                      <img src="https://a0.muscache.com/im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-search-bar-icons/original/f50ce552-509c-4f54-af4c-605c5220d906.png?im_w=240" alt="" className="tab-icon-img" width="22" height="22" />
                      <span>All</span>
                    </button>
                  )}
                  <button
                    className={`top-tab-btn ${activeNavTab === 'homes' ? 'active' : ''}`}
                    onClick={() => setActiveNavTab('homes')}
                  >
                    <img src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/a32adab1-f9df-47e1-a411-bdff91b579c3.png?im_w=240" alt="" className="tab-icon-img" width="22" height="22" />
                    <span>Homes</span>
                  </button>
                  <button
                    className={`top-tab-btn ${activeNavTab === 'experiences' ? 'active' : ''}`}
                    onClick={() => setActiveNavTab('experiences')}
                  >
                    <img src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/e47ab655-027b-4679-b2e6-df1c99a5c33d.png?im_w=240" alt="" className="tab-icon-img" width="22" height="22" />
                    <span>Experiences</span>
                  </button>
                  <button
                    className={`top-tab-btn ${activeNavTab === 'services' ? 'active' : ''}`}
                    onClick={() => setActiveNavTab('services')}
                  >
                    <img src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/original/3d67e9a9-520a-49ee-b439-7b3a75ea814d.png?im_w=240" alt="" className="tab-icon-img" width="22" height="22" />
                    <span>Services</span>
                  </button>
                </div>

                <div
                  className={`search-pill-container compact-pill ${!isExpanded ? 'visible' : 'hidden'}`}
                  onClick={() => handleCompactSearchClick('where')}
                  tabIndex={0}
                  role="button"
                  aria-label="Search destination dates guests"
                  onKeyDown={(e) => e.key === 'Enter' && handleCompactSearchClick('where')}
                >
                  <div className="search-pill-fields">
                    <div className="pill-field compact-field" onClick={(e) => { e.stopPropagation(); handleCompactSearchClick('where'); }}>
                      <span className="compact-text bold-text">{selectedWhere || 'Anywhere'}</span>
                    </div>
                    <span className="search-pill-divider" />
                    <div className="pill-field compact-field" onClick={(e) => { e.stopPropagation(); handleCompactSearchClick('when'); }}>
                      <span className="compact-text bold-text">
                        {selectedDates.start && selectedDates.end ? `Oct ${selectedDates.start}–${selectedDates.end}` : 'Any week'}
                      </span>
                    </div>
                    <span className="search-pill-divider" />
                    <div className="pill-field compact-field" onClick={(e) => { e.stopPropagation(); handleCompactSearchClick('who'); }}>
                      <span className="compact-text bold-text">{totalGuests > 0 ? `${totalGuests} guests` : 'Add guests'}</span>
                    </div>
                  </div>
                  <div className="search-icon-circle" aria-label="Submit Search">
                    <Search size={12} color="#FFFFFF" strokeWidth={3} />
                  </div>
                </div>
              </div>
            )}

            {/* Right Nav Menu */}
            <div className="header-right-nav">
              <Link to="/host" className="host-link">Become a host</Link>
              <button className="icon-btn globe-btn" onClick={() => setIsLangModalOpen(true)} aria-label="Choose language and currency">
                <Globe size={18} />
              </button>

              {/* Profile Menu Pill */}
              <div className="profile-menu-wrapper">
                <button
                  className={`profile-menu-btn ${isMenuOpen ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-expanded={isMenuOpen}
                  aria-label="Main navigation menu"
                >
                  <Menu size={16} strokeWidth={2.5} />
                  <div className="avatar-placeholder" style={{ backgroundColor: currentUser ? '#222222' : '#EBEBEB', color: '#FFFFFF', fontWeight: 600 }}>
                    {currentUser ? currentUser.name.charAt(0).toUpperCase() : <User size={18} color="#717171" />}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="profile-dropdown-menu animate-fade-in">
                    {!currentUser ? (
                      <>
                        <button className="dropdown-item bold-item" onClick={() => { setIsLoginModalOpen(true); setIsMenuOpen(false); }}>
                          Log in / Sign up
                        </button>
                        <div className="dropdown-divider" />
                      </>
                    ) : (
                      <>
                        <div className="dropdown-item bold-item" style={{ color: '#E00B41' }}>
                          Hello, {currentUser.name}!
                        </div>
                        <div className="dropdown-divider" />
                      </>
                    )}
                    {currentUser ? (
                      <>
                        <Link to="/wishlists" className="dropdown-item bold-item" onClick={() => setIsMenuOpen(false)}>Wishlists</Link>
                        <Link to="/trips" className="dropdown-item bold-item" onClick={() => setIsMenuOpen(false)}>Trips</Link>
                      </>
                    ) : (
                      <>
                        <button className="dropdown-item bold-item" onClick={() => { setIsMenuOpen(false); setIsLoginModalOpen(true); }}>
                          Wishlists
                        </button>
                        <button className="dropdown-item bold-item" onClick={() => { setIsMenuOpen(false); setIsLoginModalOpen(true); }}>
                          Trips
                        </button>
                      </>
                    )}
                    <div className="dropdown-divider" />
                    <Link to="/host" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>Airbnb your home</Link>
                    <Link to="/" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>Explore all homes</Link>
                    {currentUser && (
                      <button className="dropdown-item" onClick={() => {
                        localStorage.removeItem('airbnb_user');
                        localStorage.removeItem('airbnb_auth_token');
                        setCurrentUser(null);
                        setIsMenuOpen(false);
                        window.dispatchEvent(new Event('authChange'));
                      }}>
                        Log out
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Second Row: Expanded Search Bar */}
          {!hideSearch && (
            <div className={`header-search-row ${isExpanded ? 'expanded' : 'collapsed'} ${activeSearchTab ? 'has-popover' : ''}`}>
              <div className={`search-pill-container expanded-pill ${activeSearchTab ? 'is-active-bar' : ''}`}>
                <div className="search-pill-fields">
                  {/* Where Field */}
                  <div
                    className={`pill-field ${activeSearchTab === 'where' ? 'active-pill-field' : ''}`}
                    onClick={() => setActiveSearchTab('where')}
                  >
                    <span className="field-label">Where</span>
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Search destinations"
                      value={selectedWhere}
                      onChange={(e) => setSelectedWhere(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                    />
                  </div>

                  <span className={`search-pill-divider ${activeSearchTab === 'where' || activeSearchTab === 'when' ? 'hide-divider' : ''}`} />

                  {/* When Field */}
                  <div
                    className={`pill-field ${activeSearchTab === 'when' ? 'active-pill-field' : ''}`}
                    onClick={() => setActiveSearchTab('when')}
                  >
                    <span className="field-label">When</span>
                    <span className={`field-sub ${selectedDates.start ? 'has-value' : ''}`}>
                      {selectedDates.start && selectedDates.end ? `Oct ${selectedDates.start} – ${selectedDates.end}` : (selectedDates.start ? `Oct ${selectedDates.start}` : 'Add dates')}
                    </span>
                  </div>

                  <span className={`search-pill-divider ${activeSearchTab === 'when' || activeSearchTab === 'who' ? 'hide-divider' : ''}`} />

                  {/* Who Field */}
                  <div
                    className={`pill-field ${activeSearchTab === 'who' ? 'active-pill-field' : ''}`}
                    onClick={() => setActiveSearchTab('who')}
                  >
                    <span className="field-label">Who</span>
                    <span className={`field-sub ${totalGuests > 0 ? 'has-value' : ''}`}>
                      {totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests'}
                    </span>
                  </div>
                </div>

                {/* Red Search Button */}
                <div
                  className="search-icon-circle expanded-btn"
                  onClick={handleSearchSubmit}
                  aria-label="Submit Search"
                >
                  <Search size={16} color="#FFFFFF" strokeWidth={3} />
                  <span className="search-btn-text">Search</span>
                </div>
              </div>

              {/* Interactive Inline Search Popover Dropdown */}
              {activeSearchTab && (
                <div className={`search-dropdown-popover popover-${activeSearchTab} animate-fade-in`}>
                  {activeSearchTab === 'where' && (
                    <div className="where-popover-panel">
                      {/* Session-Based Recent Searches Section */}
                      {recentSearches.length > 0 && (
                        <div className="popover-section">
                          <h4 className="popover-heading">Recent searches</h4>
                          <div className="popover-item-list">
                            {recentSearches.map((dest, idx) => (
                              <div key={`rec-${idx}`} className="popover-item" onClick={() => selectDestination(dest.title)}>
                                <div className="item-icon-box gray-box">
                                  <MapPin size={20} color="#222222" />
                                </div>
                                <div className="item-details">
                                  <span className="item-main-title">{dest.title}</span>
                                  <span className="item-sub-title">{dest.subtitle}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggested Destinations Section matching Airbnb Screenshots 2-5 */}
                      {destinations.length > 0 && (
                        <div className={`popover-section ${recentSearches.length > 0 ? 'margin-top-md' : ''}`}>
                          <h4 className="popover-heading">Suggested destinations</h4>
                          <div className="popover-item-list">
                            {destinations.map((dest, idx) => (
                              <div key={`sug-${idx}`} className="popover-item" onClick={() => selectDestination(dest.title)}>
                                {renderDestinationIcon(dest.iconType, dest.colorTheme)}
                                <div className="item-details">
                                  <span className="item-main-title">{dest.title}</span>
                                  <span className="item-sub-title">{dest.subtitle}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeSearchTab === 'when' && (
                    <div className="when-popover-panel">
                      <div className="when-tabs-header">
                        <button className="when-tab active">Dates</button>
                        <button className="when-tab">Flexible</button>
                      </div>

                      <div className="side-by-side-calendars">
                        {/* Month 1: October 2026 */}
                        <div className="month-calendar-block">
                          <div className="month-header-title">October 2026</div>
                          <div className="calendar-weekdays">
                            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                          </div>
                          <div className="calendar-days-grid">
                            {Array.from({ length: octOffset }).map((_, idx) => (
                              <span key={`empty-oct-${idx}`} className="calendar-day empty" />
                            ))}
                            {octDays.map(day => {
                              const isSelected = selectedDates.start === day || selectedDates.end === day;
                              const isInRange = selectedDates.start && selectedDates.end && day > selectedDates.start && day < selectedDates.end;
                              return (
                                <button
                                  key={`oct-${day}`}
                                  className={`calendar-day ${isSelected ? 'selected' : ''} ${isInRange ? 'in-range' : ''}`}
                                  onClick={() => handleDateClick(day)}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Month 2: November 2026 */}
                        <div className="month-calendar-block">
                          <div className="month-header-title">November 2026</div>
                          <div className="calendar-weekdays">
                            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                          </div>
                          <div className="calendar-days-grid">
                            {Array.from({ length: novOffset }).map((_, idx) => (
                              <span key={`empty-nov-${idx}`} className="calendar-day empty" />
                            ))}
                            {novDays.map(day => (
                              <button
                                key={`nov-${day}`}
                                className="calendar-day"
                                onClick={() => handleDateClick(day + 31)}
                              >
                                {day}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSearchTab === 'who' && (
                    <div className="who-popover-panel">
                      <div className="guest-counter-row">
                        <div className="guest-type-block">
                          <span className="guest-type-name">Adults</span>
                          <span className="guest-type-sub">Ages 13 or above</span>
                        </div>
                        <div className="counter-controls">
                          <button
                            className="counter-btn"
                            onClick={() => updateGuests('adults', -1)}
                            disabled={guestCounts.adults === 0}
                          >-</button>
                          <span className="counter-val">{guestCounts.adults}</span>
                          <button className="counter-btn" onClick={() => updateGuests('adults', 1)}>+</button>
                        </div>
                      </div>

                      <div className="guest-divider" />

                      <div className="guest-counter-row">
                        <div className="guest-type-block">
                          <span className="guest-type-name">Children</span>
                          <span className="guest-type-sub">Ages 2–12</span>
                        </div>
                        <div className="counter-controls">
                          <button
                            className="counter-btn"
                            onClick={() => updateGuests('children', -1)}
                            disabled={guestCounts.children === 0}
                          >-</button>
                          <span className="counter-val">{guestCounts.children}</span>
                          <button className="counter-btn" onClick={() => updateGuests('children', 1)}>+</button>
                        </div>
                      </div>

                      <div className="guest-divider" />

                      <div className="guest-counter-row">
                        <div className="guest-type-block">
                          <span className="guest-type-name">Infants</span>
                          <span className="guest-type-sub">Under 2</span>
                        </div>
                        <div className="counter-controls">
                          <button
                            className="counter-btn"
                            onClick={() => updateGuests('infants', -1)}
                            disabled={guestCounts.infants === 0}
                          >-</button>
                          <span className="counter-val">{guestCounts.infants}</span>
                          <button className="counter-btn" onClick={() => updateGuests('infants', 1)}>+</button>
                        </div>
                      </div>

                      <div className="guest-divider" />

                      <div className="guest-counter-row">
                        <div className="guest-type-block">
                          <span className="guest-type-name">Pets</span>
                          <span className="guest-type-sub underline-link">Bringing a service animal?</span>
                        </div>
                        <div className="counter-controls">
                          <button
                            className="counter-btn"
                            onClick={() => updateGuests('pets', -1)}
                            disabled={guestCounts.pets === 0}
                          >-</button>
                          <span className="counter-val">{guestCounts.pets}</span>
                          <button className="counter-btn" onClick={() => updateGuests('pets', 1)}>+</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <LanguageModal
          isOpen={isLangModalOpen}
          onClose={() => setIsLangModalOpen(false)}
        />

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={(user) => setCurrentUser(user)}
        />
      </header>
    </>
  );
};
