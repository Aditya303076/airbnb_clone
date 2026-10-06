# Entity Relationship Diagram (ERD) — Airbnb Clone Database Architecture

## Relational Schema Diagram (PostgreSQL)

```mermaid
erDiagram
    User ||--o| Host : "has profile"
    User ||--o{ Review : "writes"
    User ||--o{ Booking : "makes"
    User ||--o{ Favorite : "saves"
    User ||--o{ Wishlist : "owns"
    User ||--o{ Notification : "receives"

    Host ||--o{ Listing : "manages"

    Location ||--o{ Listing : "located at"

    Listing ||--o{ Photo : "contains"
    Listing ||--o{ ListingAmenity : "has"
    Listing ||--o{ Review : "receives"
    Listing ||--o{ Availability : "schedule"
    Listing ||--o{ Price : "pricing"
    Listing ||--o{ Booking : "reserved in"
    Listing ||--o{ Favorite : "favorited in"
    Listing ||--o{ WishlistItem : "added to"

    Amenity ||--o{ ListingAmenity : "associated with"

    Wishlist ||--o{ WishlistItem : "contains"

    Booking ||--o| Guest : "guest count"
    Booking ||--o| PaymentReference : "payment detail"

    User {
        uuid id PK
        string email UK
        string passwordHash
        string firstName
        string lastName
        enum role
        datetime createdAt
    }

    Host {
        uuid id PK
        uuid userId FK, UK
        boolean isSuperhost
        int responseRate
        string responseTime
    }

    Location {
        uuid id PK
        string city
        string state
        string country
        float latitude
        float longitude
    }

    Listing {
        uuid id PK
        uuid hostId FK
        uuid locationId FK
        string title
        string category
        float pricePerNight
        float rating
        int reviewCount
        int maxGuests
    }

    Photo {
        uuid id PK
        uuid listingId FK
        string url
        boolean isPrimary
        int sortOrder
    }

    Amenity {
        uuid id PK
        string name UK
        string iconName
        string category
    }

    ListingAmenity {
        uuid listingId PK, FK
        uuid amenityId PK, FK
    }

    Review {
        uuid id PK
        uuid listingId FK
        uuid userId FK
        int rating
        string comment
    }

    Availability {
        uuid id PK
        uuid listingId FK
        datetime date
        boolean isBooked
    }

    Booking {
        uuid id PK
        string idempotencyKey UK
        uuid listingId FK
        uuid userId FK
        datetime checkIn
        datetime checkOut
        float totalPrice
        enum status
    }

    PaymentReference {
        uuid id PK
        uuid bookingId FK, UK
        string transactionId UK
        float amount
    }

    Favorite {
        uuid id PK
        uuid userId FK
        uuid listingId FK
    }

    Wishlist {
        uuid id PK
        uuid userId FK
        string name
    }

    WishlistItem {
        uuid id PK
        uuid wishlistId FK
        uuid listingId FK
    }
```

---

## Indexing Strategy Summary

| Entity | Index Type | Columns | Purpose / Query Optimization |
| :--- | :--- | :--- | :--- |
| **Listing** | Composite | `(category, pricePerNight, rating)` | Fast multi-filter search feed queries |
| **Listing** | Single | `locationId` | $O(1)$ relational join to Location |
| **Listing** | Single | `hostId` | Host property portfolio lookups |
| **Location** | Composite | `(city, country)` | Location auto-complete & search bar filtering |
| **Location** | Composite | `(latitude, longitude)` | Spatial radius / bounding box search |
| **Availability**| Composite | `(listingId, date, isBooked)` | Fast booking collision checks & date calendar queries |
| **Booking** | Composite | `(listingId, checkIn, checkOut)` | Transactional availability locking |
| **Photo** | Composite | `(listingId, sortOrder)` | Fast ordered photo gallery retrieval |
| **Review** | Composite | `(listingId, createdAt)` | Paginated review feeds sorted by date |
| **User** | Single | `email` | Instant login verification |
