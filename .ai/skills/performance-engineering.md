# Skill: Performance Engineering Guidelines

```yaml
name: performance-engineering
description: Rules for sub-5ms caching, N+1 query elimination, and async event streaming.
```

## Guidelines

1. **Two-Tier Caching**: Use L1 Memory LRU + L2 Redis key-value store for $p_{95} < 5\text{ ms}$ query retrieval.
2. **N+1 Prevention**: Use batching or eager relation joins to ensure zero N+1 query bottlenecks.
3. **Async Event Streaming**: Decouple non-critical side effects (analytics, logs) using Kafka topic streams.
4. **Pagination Limits**: Enforce default page size (20) and max limit cap (100).
