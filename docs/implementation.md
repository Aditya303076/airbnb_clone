# Component Implementation Details & Usage Guide

## 1. Directory Structure

```text
src/
  components/
    Header/               # Airbnb top header navigation & search pill bar
    PropertyHeader/       # Title, sub-header details, share/save buttons
    HeroGallery/          # 5-photo grid layout with "Show all photos" overlay
    PropertyInfo/         # Left column: Host details, highlights, description
    Amenities/            # Amenities grid & all amenities modal
    Calendar/             # Interactive check-in & check-out date picker
    Reviews/              # Rating breakdown bars, review cards & review modal
    HostSection/          # Host bio, response rate, contact host
    LocationMap/          # Map view placeholder & neighborhood info
    ReservationCard/      # Sticky booking card, price calculator, guest selector
    PhotoTour/            # Full-screen photo gallery overlay grouped by category
    Lightbox/             # Single-photo full-screen viewer with Arrow/Esc navigation
    Modals/               # Description & share modal dialogs
    Footer/               # Airbnb footer navigation & copyright

  data/
    propertyData.ts       # Structured mock property details & image collections

  hooks/
    useLightbox.ts        # Lightbox state & image navigation logic
    useKeyboardNavigation.ts # Global key listener (Escape, ArrowLeft, ArrowRight)
    useModalFocus.ts      # Accessibility focus management & scroll locking

  styles/
    tokens.css            # CSS variables for colors, typography, shadows, radii
    globals.css           # Global resets, font stacks, layout utilities

  types/
    property.ts           # TypeScript interfaces for Property, Photo, Review, Host
```

---

## 2. Core Interactive Features

### Feature 1: Hero Photo Gallery & Photo Tour
- **Grid Layout**: 5-photo asymmetrical grid built with CSS Grid/Flexbox.
- **Overlay Action**: Clicking any of the 5 main photos directly opens the **Lightbox** at that photo's index.
- **Photo Tour Overlay**: Clicking the "Show all photos" button triggers `isPhotoTourOpen = true`, displaying a full-screen view grouped into room categories (Living room, Bedroom, Kitchen, Outdoor, Bathroom).

### Feature 2: Lightbox Navigation
- **Keyboard Shortcuts**:
  - `←` (`ArrowLeft`): Navigate to previous photo.
  - `→` (`ArrowRight`): Navigate to next photo.
  - `Esc`: Close Lightbox.
- **Mouse Controls**: Next/Prev chevron buttons, background backdrop click to exit, close button in header.
- **Counter**: Displays `Image X of Y` dynamically.

### Feature 3: Dynamic Reservation Calculator
- **Interactive Dates**: User can select check-in and check-out dates using the inline interactive calendar or card pickers.
- **Guest Selector**: Modal dropdown allows incrementing/decrementing Adults, Children, Infants, and Pets (enforces max guest limit).
- **Price Calculation**: Automatically recalculates total nights, base rate, cleaning fee, service fee, and total price before taxes.

---

## 3. Accessibility & Performance Verification
- **ARIA Roles**: Modals include `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
- **Keyboard Trapping**: Prevents tab key focus from cycling behind active overlays.
- **Scroll Lock**: `body { overflow: hidden }` is set whenever Photo Tour, Lightbox, or dialog modals are open.
- **Image Priority**: Priority fetching for top hero images, lazy loading (`loading="lazy"`) for lower page content images.
