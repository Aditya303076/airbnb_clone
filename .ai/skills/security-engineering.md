# Skill: Security Engineering Guidelines

```yaml
name: security-engineering
description: Rules for OWASP protection, rate limiting, authentication, and authorization.
```

## Guidelines

1. **Input Validation**: Validate params, headers, query strings, and JSON bodies with Zod or TypeScript schemas.
2. **Rate Limiting**: Apply endpoint-specific token bucket rate limiters to prevent brute-force attacks.
3. **IDOR Defense**: Verify user authorization at the object level before mutating or retrieving resource records.
4. **Security Headers**: Enforce CSP, HSTS, X-Frame-Options, and X-Content-Type-Options on all responses.
