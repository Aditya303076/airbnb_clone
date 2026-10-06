# Airbnb Property Listing Reference Analysis

## 1. Overview & Core Layout Architecture
This document records the visual, behavioral, and structural analysis of an Airbnb property listing page, derived from inspecting the reference standard desktop experience (`https://www.airbnb.co.in/`).

### Target Viewports
- **Desktop Primary**: `1440 × 900`
- **Desktop High-Res**: `1920 × 1080`
- **Compact Desktop / Laptop**: `1280 × 720`

---

## 2. Layout Structure & Grid Dimensions

### Page Container
- **Max Width**: `1120px` (standard listing content max-width)
- **Horizontal Padding**: `24px` on screen sides (`40px` or `80px` on wider monitors `>1440px`)
- **Vertical Spacing**: `24px` section gaps with clean horizontal divider rules (`1px solid #EBEBEB`)

### Header (Top Navigation)
- **Height**: `80px`
- **Positioning**: Sticky / Fixed at `top: 0`, `z-index: 100`, white background (`#FFFFFF`), bottom border `1px solid #EBEBEB`.
- **Left Section**: Airbnb logo (Brand color `#FF385C`, size ~`32px`).
- **Center Section**: Compact Search Bar / Filter Pill (`height: 48px`, rounded pill `border-radius: 40px`, border `1px solid #DDDDDD`, shadow `0 1px 2px rgba(0,0,0,0.08)`, hover shadow `0 2px 4px rgba(0,0,0,0.18)`).
- **Right Section**: "Airbnb your home" button, Globe/Language icon button, User Profile menu button (`border: 1px solid #DDDDDD`, rounded `21px`, contains hamburger icon + user avatar placeholder).

---

## 3. Property Header Section
- **Title**: `26px`, font weight `600`, line height `1.2`, color `#222222`.
- **Action Bar**:
  - **Left**: Rating (e.g. `★ 4.98`), Review count link (`124 reviews`), Superhost badge, Location link (`Kasauli, Himachal Pradesh, India`).
  - **Right**: Share button (Icon + "Share"), Save / Favorite button (Heart Icon + "Save").

---

## 4. Hero Photo Gallery Grid
- **Layout**: 5-photo asymmetrical grid.
  - **Main Photo (Left)**: 50% grid width, spans full height (~`400px` to `460px`), rounded left corners (`border-radius: 12px 0 0 12px`).
  - **Sub Photos (Right)**: 2x2 grid of 4 smaller photos, each 25% grid width, top-right photo has top-right radius (`12px`), bottom-right photo has bottom-right radius (`12px`).
- **Gap**: `8px` between grid items.
- **Hover Behavior**: Subtle brightness adjustment (`brightness(0.95)` or smooth scale `1.02`), cursor `pointer`.
- **Show All Photos Button**: Positioned bottom-right overlay (`bottom: 24px`, `right: 24px`), white background (`#FFFFFF`), border `1px solid #222222`, rounded `8px`, contains grid icon + "Show all photos" text.

---

## 5. Main Content Split Layout
- **Container**: `display: flex`, `gap: 80px`.
- **Left Column (Primary Content)**: Width ~`63%` (`680px`).
  - **Host & Highlights**: Host name, avatar (`56px × 56px`), guest capacity, bedroom/bed/bath summary. Highlight rows with SVG icons (e.g. Dedicated workspace, Self check-in, Free cancellation).
  - **Description**: Excerpt text with "Show more >" link opening full modal.
  - **Where You'll Sleep**: Card gallery showing bedroom details.
  - **Amenities**: 2-column grid showing top 10 amenities with icons. "Show all X amenities" button opening modal.
  - **Calendar / Date Selection**: Interactive calendar showing check-in & check-out selection, clear dates button.
  - **Reviews Section**: Overall rating summary (`4.98`), rating breakdown sub-scores (Cleanliness, Accuracy, Check-in, Communication, Location, Value with progress bars), guest review cards (Avatar, name, date, comment, "Show more").
  - **Host Profile Section**: Detailed host summary, co-hosts, response rate, contact host button.
  - **Location Map**: Map placeholder with neighborhood summary.

- **Right Column (Sticky Reservation Card)**: Width ~`37%` (`370px`).
  - **Positioning**: Sticky (`position: sticky`, `top: 120px`, `z-index: 10`).
  - **Card Container**: `border: 1px solid #DDDDDD`, `border-radius: 12px`, `padding: 24px`, shadow `0 6px 16px rgba(0,0,0,0.12)`.
  - **Header**: Price per night (e.g. `$185` or `₹14,500`), rating & review count summary.
  - **Inputs Box**: `border: 1px solid #B0B0B0`, `border-radius: 8px`.
    - **Check-in / Check-out**: Split row picker.
    - **Guests Dropdown**: Select number of adults, children, infants, pets.
  - **Reserve Button**: Full width, brand color gradient (`linear-gradient(90deg, #E61E4F 0%, #E31C5F 50%, #D70466 100%)`), text color `#FFFFFF`, font weight `600`, padding `14px`, hover effect.
  - **Subtext**: "You won't be charged yet".
  - **Price Breakdown**:
    - `₹14,500 × 5 nights` -> `₹72,500`
    - Cleaning fee -> `₹2,500`
    - Airbnb service fee -> `₹8,200`
    - **Total before taxes** -> `₹83,200` (Bold `16px`).

---

## 6. Photo Tour Overlay
- **Trigger**: Clicking "Show all photos" or gallery item.
- **Container**: Full-screen fixed overlay (`z-index: 1000`, background `#FFFFFF`).
- **Header**: Sticky top bar with back arrow button, share/save buttons.
- **Layout**: Center-aligned image grid column (~`750px` max-width), grouped by category (e.g. Living room, Master bedroom, Kitchen, Exterior).
- **Navigation & Close**: Floating close button (`Esc` key supported).

---

## 7. Lightbox / Single Photo Viewer
- **Trigger**: Clicking any specific image in Gallery or Photo Tour.
- **Container**: Fixed full-screen backdrop (`background: rgba(0,0,0,0.92)`, `z-index: 1100`).
- **Top Bar**: Counter (e.g. `3 / 18`), image title/section name, Close (`×` icon / `Esc`).
- **Main Viewport**: Single full-size image with `object-fit: contain`, smooth opacity/scale transition.
- **Nav Buttons**: Chevron Left (`←`) and Chevron Right (`→`) fixed on screen edges with keyboard support.

---

## 8. Typography Tokens & Color Palette
- **Font Stack**: `Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`.
- **Primary Text**: `#222222`
- **Secondary Text**: `#717171`
- **Brand Accent**: `#FF385C` (Secondary gradient `#E61E4F`)
- **Borders**: `#DDDDDD` / `#EBEBEB`
- **Background Soft**: `#F7F7F7`
- **Shadow Soft**: `0 6px 16px rgba(0,0,0,0.12)`
- **Shadow Header/Pill**: `0 2px 4px rgba(0,0,0,0.18)`
