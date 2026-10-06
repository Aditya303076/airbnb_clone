# System Scalability & Evolution Roadmap

## Scale Horizon Strategy

```text
Phase 1: Modular Monolith + PostgreSQL Read Replica + Redis (0 - 100K Users)
Phase 2: Microservice Extraction (Search, Booking, Payment) (100K - 1M Users)
Phase 3: Sharded Database & Distributed Event Streaming (1M+ Users)
```

## Readiness Probes & Containerization

- **Stateless App Nodes**: Node.js API processes maintain no local session state.
- **Graceful Shutdown**: Intercepts `SIGINT` / `SIGTERM` signals, closes active HTTP connections, flushes Kafka events, and closes database pools.
- **Docker & Docker Compose**: Full local environment orchestration (`docker-compose.yml`).
