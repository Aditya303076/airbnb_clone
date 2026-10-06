# Architectural & Technical Decision Records (ADR)

## ADR 01: Core Framework Selection
- **Status**: Accepted
- **Context**: The goal is to build an Airbnb listing clone with desktop layout parity, interactive modals, full-screen gallery tour, and accessibility.
- **Decision**: Use **React 18** with **TypeScript** and **Vite**.
- **Rationale**: React provides clean declarative component composition for complex interactive UIs (Photo Tour, Lightbox, Sticky Booking Widget). TypeScript ensures type safety across property data models and hook interactions. Vite provides sub-second HMR and optimized production builds.

---

## ADR 02: Styling System & Design Tokens
- **Status**: Accepted
- **Context**: Airbnb uses a distinct visual design system with proprietary spacing tokens, typography weights, color palette (`#FF385C`), rounded corners (12px, 8px, 40px), and soft layered box-shadows.
- **Decision**: Implement a custom token system in CSS variables (`src/styles/tokens.css`) combined with standard modular CSS files (`src/styles/globals.css` and component-level CSS files).
- **Rationale**: Direct CSS variables eliminate runtime overhead and allow instant tweaking of global parameters (colors, z-indexes, font sizes, shadows) while remaining faithful to Airbnb's design tokens.

---

## ADR 03: State Management Strategy
- **Status**: Accepted
- **Context**: The page requires managing states such as active photo index in lightbox, photo tour visibility, date selections, guest selector toggles, amenity modal state, and share/save toggles.
- **Decision**: Keep state localized using custom React hooks (`useLightbox`, `useModal`, `useKeyboardNavigation`) and standard React `useState`.
- **Rationale**: A global state library (like Redux or Zustand) is unnecessary overhead for a single-page listing experience. Localized state combined with explicit props passing keeps component flow predictable and fast.

---

## ADR 04: Accessibility & Keyboard Navigation Pattern
- **Status**: Accepted
- **Context**: Modals (Lightbox, Photo Tour, Description, Amenities) must satisfy WCAG 2.1 AA accessibility guidelines.
- **Decision**:
  1. Trap keyboard focus inside open modals.
  2. Map `Escape` key to close active modal.
  3. Map `ArrowLeft` (`←`) and `ArrowRight` (`→`) keys to photo navigation in Lightbox.
  4. Restore focus to triggering element upon modal close.
  5. Provide `aria-modal="true"`, `role="dialog"`, and descriptive `aria-label`s on interactive elements.

---

## ADR 05: Data Schema & Asset Optimization
- **Status**: Accepted
- **Context**: High-resolution property images are crucial for visual fidelity.
- **Decision**: Create structured, strongly typed TypeScript mock data in `src/data/propertyData.ts` with local optimized high-definition Unsplash photography representing real luxury villa listing photos with tags, captions, dimensions, and categories.
