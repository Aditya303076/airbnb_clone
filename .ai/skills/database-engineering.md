# Skill: Database Engineering Guidelines

```yaml
name: database-engineering
description: Guidelines for PostgreSQL schema design, Prisma ORM, indexing, and concurrency.
```

## Guidelines

1. **Explicit Indexing**: Every search, filter, and join condition must be optimized with explicit single or composite indexes.
2. **Double Booking Prevention**: Availability checks and reservation writes must execute inside serializable transactions with pessimistic locking (`SELECT FOR UPDATE`).
3. **Selective Projection**: Avoid `SELECT *`. Retrieve only required column sets for DTOs.
4. **Referential Integrity**: Enforce foreign keys and cascade rules at the database engine level.
