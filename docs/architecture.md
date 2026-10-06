# System Architecture & Technical Specifications

## 1. Overview
This document outlines the architecture for both:
1. **The Airbnb Listing Clone** (Single Page Application built with React, TypeScript, Vite, CSS Modules, and lightweight client state).
2. **The Production-Scale Vacation Rental Marketplace Architecture** (High-scale, microservices-based distributed platform serving millions of active listings).

![Production Architecture Diagram](file:///d:/PROJECTS/airbnb_clone/docs/architecture.png)

---

## 2. Frontend Component Architecture (Airbnb Listing Clone)

```mermaid
graph TD
    App[App Component] --> Header[Header Component]
    App --> ListingPage[ListingPage Layout]
    App --> PhotoTour[PhotoTour Modal]
    App --> Lightbox[Lightbox Modal]
    App --> DescriptionModal[Description Modal]
    App --> AmenitiesModal[Amenities Modal]

    ListingPage --> PropertyHeader[Property Header Section]
    ListingPage --> HeroGallery[Hero Photo Gallery]
    ListingPage --> MainSplit[Main Content Split Layout]

    MainSplit --> LeftCol[Left Column Details]
    MainSplit --> RightCol[Right Column Sticky Reservation]

    LeftCol --> HostHighlight[Host & Highlights]
    LeftCol --> PropertyDescription[Property Description]
    LeftCol --> SleepingArrangements[Where You'll Sleep]
    LeftCol --> AmenitiesGrid[Amenities Grid]
    LeftCol --> DatePickerSection[Interactive Calendar]
    LeftCol --> ReviewsSection[Reviews & Category Breakdown]
    LeftCol --> HostProfile[Host Profile]
    LeftCol --> LocationMap[Location Map Placeholder]
    LeftCol --> Footer[Footer]

    RightCol --> ReservationCard[Sticky Reservation Card]
    ReservationCard --> DateRangePicker[Date Range Picker]
    ReservationCard --> GuestSelector[Guest Selector Dropdown]
    ReservationCard --> PriceBreakdown[Dynamic Price Calculator]

    HeroGallery --> Lightbox
    HeroGallery --> PhotoTour
    PhotoTour --> Lightbox
```

### Component Hierarchy & Responsibilities

| Component | Responsibility | State Managed |
| :--- | :--- | :--- |
| `App` | Root container, global modal coordinator | `isPhotoTourOpen`, `isLightboxOpen`, `lightboxIndex`, `isDescModalOpen`, `isAmenitiesModalOpen` |
| `Header` | Top navigation, brand logo, search pill bar, user menu | Sticky state, user dropdown menu toggle |
| `PropertyHeader` | Title, rating summary, location, share modal, save toggle | `isSaved` status |
| `HeroGallery` | 5-photo grid layout, hover effects, overlay button | Hover preview index, click handlers to open Lightbox/Photo Tour |
| `ReservationCard` | Sticky booking widget, price calculations, dates/guests | `checkInDate`, `checkOutDate`, `guestCounts` (adults, kids, infants, pets), `totalNights`, `totalPrice` |
| `DatePickerSection` | Interactive calendar for check-in/check-out selection | Active date selection, hover date preview |
| `ReviewsSection` | Rating sub-score breakdown bars, review cards | `reviewFilter`, expanded review toggles |
| `PhotoTour` | Full-screen scrollable image tour grouped by rooms | Scroll position, category filter tabs |
| `Lightbox` | High-res image modal viewer, left/right navigation | Active photo index, keyboard focus lock |

---

## 3. Production-Scale Architecture (Vacation Rental Marketplace)

The architecture diagram below details a multi-region, high-availability cloud infrastructure designed to support hundreds of millions of search queries and booking transactions per day.

```mermaid
graph TD
    Client[Users / Desktop & Mobile Clients] --> Edge[Cloudflare / CloudFront CDN & WAF]
    Edge --> APIGateway[API Gateway / Kong / AWS Envoy]

    APIGateway --> ListingSvc[Listing Service]
    APIGateway --> SearchSvc[Elasticsearch Search Service]
    APIGateway --> BookingSvc[Booking & Reservation Service]
    APIGateway --> UserSvc[User & Auth Service]
    APIGateway --> PaymentSvc[Stripe/Adyen Payment Gateway Service]
    APIGateway --> ReviewSvc[Review & Ratings Service]
    APIGateway --> NotificationSvc[Notification & Messaging Service]

    ListingSvc --> PostgresListing[(PostgreSQL Primary DB)]
    ListingSvc --> RedisCache[(Redis Cache Layer)]
    ListingSvc --> S3Images[(AWS S3 / Cloudinary Media Storage)]

    SearchSvc --> ElasticCluster[(Elasticsearch / OpenSearch Cluster)]
    BookingSvc --> PostgresBooking[(PostgreSQL Transactional DB)]
    BookingSvc --> KafkaQueue[Apache Kafka Event Bus]

    KafkaQueue --> EventProcessor[Async Event Consumers]
    EventProcessor --> NotificationSvc
    EventProcessor --> AnalyticsDB[(ClickHouse Data Warehouse)]

    subgraph Observability
        O1[OpenTelemetry Collector]
        O2[Datadog / Prometheus & Grafana]
        O3[ELK Centralized Logging]
    end

    subgraph Infrastructure
        CI[GitHub Actions CI/CD Pipeline]
        K8s[Kubernetes Cluster / EKS Auto-Scaling]
        LB[AWS ALB / NGINX Load Balancers]
    end
```

### Key Subsystems & Design Choices
1. **Edge & CDN**: Delivers optimized media assets (WebP/AVIF), static single-page apps, and performs geo-routing at low latency.
2. **Search Indexing**: Elasticsearch cluster powered by Kafka CDC (Change Data Capture) from the PostgreSQL primary database ensures listing updates are searchable within milliseconds.
3. **Transactional Isolation**: The Booking Service utilizes distributed locks (Redlock/Redis) and PostgreSQL `SELECT FOR UPDATE` transactions to prevent double-bookings.
4. **Asynchronous Architecture**: Apache Kafka streams booking events to trigger email/SMS notifications, host calendar updates, and data pipeline analytics.
5. **Media Pipeline**: Automated image processing pipeline compresses uploaded photos into multiple WebP resolutions for dynamic responsive loading.
