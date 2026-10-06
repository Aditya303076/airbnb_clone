# Multi-Tier Caching & Invalidation Architecture

## Two-Tier Cache Model

```text
[HTTP Request] ---> (L1 In-Memory LRU Cache) [Hits < 1ms]
                          | Miss
                          v
                    (L2 Redis Engine Store)   [Hits < 4ms]
                          | Miss
                          v
                    (PostgreSQL DB Engine)    [Executes Query]
```

## Cache Key Taxonomy

- `properties:{filtersHash}`: Listing search feed results (TTL 60s).
- `property:{id}`: Detailed listing object (TTL 120s).
- `reviews:{listingId}`: Listing review feed (TTL 180s).
- `idempotency:{key}`: Cached transaction responses (TTL 86400s).

## Invalidation Architecture

When write mutations occur (e.g. `POST /reservations`), the backend emits a `cache-invalidation-events` topic payload over Kafka.
Workers execute atomic pattern deletion (`property:${id}`, `properties:*`), guaranteeing zero stale availability reads.
