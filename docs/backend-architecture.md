# Backend Architecture & System Blueprint

## Overview

The Airbnb Clone backend is engineered as a **High-Performance Modular Monolith** designed to scale seamlessly from thousands to millions of concurrent requests while providing sub-5ms query response times.

```text
                                  +-----------------------+
                                  |   Frontend Client     |
                                  +-----------+-----------+
                                              | (HTTP/REST)
                                              v
                                  +-----------------------+
                                  |  Express API Gateway  |
                                  | (RateLimit, Auth, ID) |
                                  +-----------+-----------+
                                              |
                     +------------------------+------------------------+
                     |                                                 |
                     v                                                 v
        +-------------------------+                       +-------------------------+
        |  L1 In-Memory LRU Cache |                       |   Kafka Event Stream    |
        |     (Latency < 1ms)     |                       | (Async Background Bus)  |
        +------------+------------+                       +------------+------------+
                     | (Cache Miss)                                    |
                     v                                                 |
        +-------------------------+                                    |
        |   L2 Redis Engine Store |                                    |
        |     (TTL & Eviction)    |                                    |
        +------------+------------+                                    |
                     | (Cache Miss)                                    |
                     v                                                 v
        +-------------------------+                       +-------------------------+
        | PostgreSQL Database     | <-------------------  | Background Consumers    |
        | (Prisma ORM & Indexes)  |                       | (Cache Invalidation)    |
        +-------------------------+                       +-------------------------+
```

## Core Architectural Modules

- **`auth/`**: Token validation, password hashing (Argon2id), and RBAC middleware.
- **`listings/`**: High-frequency search feeds, selective DTO projection, and cursor-based pagination.
- **`availability/`**: Double-booking prevention with transactional locking.
- **`bookings/`**: Idempotent booking processing (`Idempotency-Key` header).
- **`cache/`**: Multi-tier L1/L2 Redis caching with automatic invalidation.
- **`messaging/`**: Asynchronous Kafka topic event bus for background workflows.

## Modular Monolith Guiding Principles

1. **Domain Isolation**: Modules operate independently without cross-domain internal database mutations.
2. **Selective Field Retrieval**: APIs return only the fields requested by the current screen.
3. **No Unbounded Operations**: All list endpoints enforce max limit caps (100 items).
