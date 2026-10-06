# Database Architecture & Optimization Guide

## Database Engine: PostgreSQL

The relational data model uses 17 normalized entities managed via **Prisma ORM**.

## Schema Normalization & Constraints

- **3rd Normal Form (3NF)**: Eliminates data redundancy between Users, Hosts, Locations, Listings, Photos, Amenities, and Reviews.
- **Database Constraints**:
  - `CHECK (rating >= 1 AND rating <= 5)` on Reviews.
  - `CHECK (check_out > check_in)` on Bookings.
  - `UNIQUE(email)` on Users.
  - `UNIQUE(idempotencyKey)` on Bookings.

## Query Performance & Index Matrix

```sql
-- Composite index for high-frequency search feed queries
CREATE INDEX idx_listings_search ON "Listing" ("category", "pricePerNight", "rating");

-- Composite index for fast collision checking during booking flow
CREATE INDEX idx_availability_booking ON "Availability" ("listingId", "date", "isBooked");

-- Location spatial coordinates lookup
CREATE INDEX idx_location_geo ON "Location" ("latitude", "longitude");
```

## Concurrency & Locking Strategy

To prevent race conditions and double bookings when concurrent users attempt to book the same property for overlapping dates:
1. **Explicit Transactional Isolation**: Wrap check-availability and booking insertion inside a PostgreSQL serializable transaction.
2. **Pessimistic Locking (`SELECT FOR UPDATE`)**: Lock availability rows for the specified date range during transaction execution.
3. **Idempotency Key Verification**: Reject duplicate client submissions using unique `idempotencyKey` keys.
