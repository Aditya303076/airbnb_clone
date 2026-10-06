# Performance & Optimization Architecture

## Latency Budget Targets

- **Property Feed API (`GET /properties`)**: $p_{95} < 5\text{ ms}$ (Cache Hit), $p_{95} < 45\text{ ms}$ (DB Miss)
- **Listing Detail API (`GET /properties/:id`)**: $p_{95} < 3\text{ ms}$ (Cache Hit)
- **Booking Creation (`POST /reservations`)**: $p_{95} < 80\text{ ms}$ (Transactional DB Commit + Async Kafka Emit)

## N+1 Query Prevention

N+1 query problems are eliminated at the database access layer:
- **Eager Batch Ingestion**: Pre-joining related tables (`Location`, `Host`, `Photos`) in single optimized SQL statements.
- **DataLoader Pattern**: Batching amenity and review requests into $O(1)$ single query lookups grouped in memory.

## Response Compression & Field Selection

- **Gzip / Brotli Compression**: Enabled for text and JSON payloads above 1KB.
- **Selective DTO Projection**: Summary feeds omit heavy arrays (full review lists, high-res photos) to minimize bandwidth.
