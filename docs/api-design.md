# API Design & Contract Specification

## RESTful Architecture Principles

All APIs follow strict RESTful conventions under the `/api/v1` version prefix.

### Consistent JSON Response Envelope

```json
{
  "success": true,
  "data": [],
  "meta": {
    "total": 24,
    "page": 1,
    "limit": 20,
    "executionTimeMs": 2.4,
    "cacheHit": true,
    "cacheLayer": "L1_MEMORY"
  }
}
```

### Standardized Error Envelope

```json
{
  "error": {
    "code": "BOOKING_CONFLICT",
    "message": "Selected dates are no longer available",
    "requestId": "req_89f3a1c2",
    "timestamp": "2026-10-05T09:40:00.000Z"
  }
}
```

## API Endpoint Reference

| Method | Endpoint | Description | Cache Strategy |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/properties` | Search & filter property feed | L1/L2 Redis (TTL 60s) |
| `GET` | `/api/v1/properties/:id` | Detailed listing view | L1/L2 Redis (TTL 120s) |
| `GET` | `/api/v1/properties/:id/reviews` | Paginated reviews | L1/L2 Redis (TTL 180s) |
| `GET` | `/api/v1/destinations` | Popular search destinations | L1/L2 Redis (TTL 300s) |
| `POST`| `/api/v1/reservations` | Create booking (Idempotent) | No Cache / Invalidate |
| `GET` | `/api/v1/health` | Telemetry & cache stats | Realtime |
| `GET` | `/api/v1/health/live` | Liveness probe | Realtime |
| `GET` | `/api/v1/health/ready` | Readiness probe | Realtime |

## Pagination Contract

- **Default Page Size**: 20 items
- **Max Page Size Cap**: 100 items
- **Cursor Pagination**: Supported via `cursor` and `limit` query params for continuous feeds.
