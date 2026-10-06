# Airbnb Listing Clone — Desktop Experience

An original, high-fidelity React + TypeScript recreation of the standard desktop Airbnb Property Listing experience, built with pixel precision, authentic design tokens, accessible keyboard navigation, a full-screen Photo Tour overlay, and an interactive Lightbox viewer.

---

## 🌟 Key Features

1. **Desktop Property Listing Page**:
   - **Header**: Airbnb logo, search bar pill ("Anywhere · Any week · Add guests"), host link, globe language/currency selector, and profile dropdown menu.
   - **Property Title & Metadata**: Location link, rating (`★ 4.98`), review count (`124 reviews`), Superhost badge, Share modal with link copying/social sharing, and wishlist Save toggle.
   - **Hero 5-Photo Gallery**: Asymmetrical 5-photo grid (1 primary left photo, 4 secondary grid photos) with 8px gaps, 12px rounded outer corners, hover zoom effects, and a floating "Show all photos" overlay button.
   - **Sticky Reservation Card**: Sticky booking widget with nightly price (`₹18,500`), date range selector, guest counter dropdown (Adults, Children, Infants, Pets), "Reserve" CTA button with brand gradient, subtext, and dynamic formula price calculation (`base + cleaning + service fee = total`).
   - **Property Info & Highlights**: Host bio, capacity chips, highlights with icons, space description with "Show more" modal, and "Where you'll sleep" bedroom arrangement cards.
   - **Amenities Section**: 2-column top 10 amenities list with icons, plus an accessible modal displaying all 16 categorized amenities.
   - **Interactive Calendar**: 2-month interactive date range picker with check-in/checkout selection and clear dates button.
   - **Reviews Breakdown**: Overall guest favorite banner, category rating sub-scores with visual progress bars (Cleanliness, Accuracy, Check-in, Communication, Location, Value), review cards, and full reviews stream modal.
   - **Host & Location**: Detailed host profile with response metrics, co-host badges, contact button, and interactive location map placeholder.
   - **Footer**: Airbnb desktop directory links, currency/language settings, copyright, and social links.

2. **Screen 2 — Photo Tour Overlay**:
   - Full-screen modal overlay displaying all 15 property photos grouped into room categories (*Living Room*, *Bedrooms*, *Kitchen & Dining*, *Bathrooms*, *Exterior & Views*).
   - Category filter navigation bar with smooth scroll jumping.
   - Clicking any photo opens the Lightbox at that photo.

3. **Screen 3 — Lightbox Single Photo Viewer**:
   - Dark backdrop (`rgba(0,0,0,0.94)`), header counter (`X / 15`), category tag, and photo caption.
   - Previous (`←`) and Next (`→`) chevron navigation buttons.
   - Full Keyboard Accessibility: `←` (Prev), `→` (Next), `Esc` (Close).
   - Modal focus lock and scroll lock.

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Language**: TypeScript 5.8
- **Build Tool / Bundler**: Vite 6
- **Styling**: Custom CSS Variables & Design Tokens (`src/styles/tokens.css` & modular component CSS)
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library + JSDOM

---

## 📦 Installation & Quickstart

```bash
# 1. Clone or navigate to the repository
cd airbnb_clone

# 2. Install dependencies
npm install

# 3. Start local dev server
npm run dev
```

Open your browser at `http://localhost:4173`.

---

## 🧪 Testing & Build Commands

```bash
# Run unit & component test suite
npm run test

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🏛️ System Architecture

Detailed architectural documentation and cloud system design diagrams are located in:
- [docs/architecture.md](file:///d:/PROJECTS/airbnb_clone/docs/architecture.md)
- [docs/reference-analysis.md](file:///d:/PROJECTS/airbnb_clone/docs/reference-analysis.md)
- [docs/decisions.md](file:///d:/PROJECTS/airbnb_clone/docs/decisions.md)
- [docs/implementation.md](file:///d:/PROJECTS/airbnb_clone/docs/implementation.md)
- [docs/ai-prompt-sequence.md](file:///d:/PROJECTS/airbnb_clone/docs/ai-prompt-sequence.md)

---

## 🤖 AI-Native Development & Agents

Configuration files for AI agent workflows and review checklists are stored in `.ai/`:
- `.ai/agents/ui-reviewer.md`
- `.ai/agents/accessibility-reviewer.md`
- `.ai/agents/qa-reviewer.md`
- `.ai/agents/performance-reviewer.md`
- `.ai/skills/visual-fidelity.md`
- `.ai/skills/component-quality.md`

---

## ⚠️ Known Limitations
- Desktop-first optimization: The layout is built and verified specifically for desktop viewports (`1280px` to `1920px`).
- Mock dataset: Property details, pricing, reviews, and photos use high-definition curated Unsplash photography and mock TypeScript state rather than real Airbnb private API endpoints.
