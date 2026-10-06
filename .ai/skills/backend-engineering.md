# Skill: Backend Engineering Guidelines

```yaml
name: backend-engineering
description: Rules and architectural standards for Node.js/TypeScript backend engineering.
```

## Guidelines

1. **Strict Type Safety**: All request params, query payloads, and responses must use explicit TypeScript types or Zod schemas.
2. **DTO Separation**: Never leak database internal models directly; transform to Response DTOs.
3. **Idempotency**: All mutation endpoints (`POST /reservations`) must support `Idempotency-Key` headers.
4. **Error Envelope**: Return error payloads using `{ error: { code, message, requestId } }`.
