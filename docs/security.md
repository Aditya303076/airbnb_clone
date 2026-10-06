# Security & Threat Mitigation Architecture

## Core Security Directives

1. **Authentication**: JWT access tokens paired with HTTP-only Refresh Cookies. Passwords stored using **Argon2id**.
2. **Role-Based Access Control (RBAC)**: Strict permission boundaries (`GUEST`, `HOST`, `ADMIN`).
3. **Object-Level Authorization (IDOR Prevention)**: Verifies that authenticated `hostId` matches the property owner before allowing mutations.
4. **Input Sanitization & Schema Validation**: All request params, query strings, and JSON bodies are validated using Zod schemas.

## OWASP Top 10 Protections

- **SQL Injection**: Prevented via Prisma ORM parameterized SQL queries.
- **XSS**: Security headers (`X-XSS-Protection`, `Content-Security-Policy`).
- **CSRF**: SameSite cookie flags (`SameSite=Strict`).
- **Rate Abuse & Brute Force**: Redis token-bucket rate limiters (`apiLimiter`, `authLimiter`, `bookingLimiter`).
- **Data Leakage**: Stack traces concealed in production error envelopes.
