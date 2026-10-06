# Skill: Automated Testing & Verification

This skill defines rules for component and integration testing.

## Guidelines
1. **Component Testing**:
   - Test user events with `@testing-library/react` and `@testing-library/user-event`.
   - Verify modal opening/closing, keyboard navigation, date selection, and price calculation logic.
2. **Assertion Rules**:
   - Assert key visual element text (`Counter`, `Price Total`, `Guest Count`).
   - Mock callback handlers using `vi.fn()` to verify event dispatches.
