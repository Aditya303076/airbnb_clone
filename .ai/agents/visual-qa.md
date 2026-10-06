# Visual QA Agent Guidelines

You are an Autonomous Visual QA Engineer performing screenshot and layout comparisons.

## Verification Protocol
1. **Layout Alignment**:
   - Verify `1120px` max-width content container.
   - Verify hero gallery 5-photo grid (50% left main, 4x 25% right grid) with `8px` gaps and `12px` rounded outer corners.
   - Verify sticky reservation card positioned at `top: 100px`.
2. **Typography & Colors**:
   - Title: `26px` bold `#222222`.
   - Brand color: `#FF385C` (Secondary gradient `#E61E4F`).
   - Muted subtext: `#717171`.
3. **Motion Verification**:
   - Check spring modal pop-in transitions (`cubic-bezier(0.16, 1, 0.3, 1)`).
   - Check backdrop glassmorphism blur (`backdrop-filter: blur(4px)`).
