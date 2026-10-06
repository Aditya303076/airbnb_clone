# Data Engineering & Analytics Event Stream Architecture

## OLTP vs OLAP Decoupling

Heavy analytical aggregations (search telemetry, conversion rates, view tracking) are decoupled from primary OLTP transactional tables to prevent query lock contention during peak traffic.

## Kafka Topic Schemas

1. **`reservation-events`**: Triggered on new bookings. Consumed by notification engine and availability cache invalidators.
2. **`analytics-events`**: Ingests user search queries, filter combinations, and clickthrough rates.
3. **`property-views`**: Tracks listing popularity for recommendation ranking models.
