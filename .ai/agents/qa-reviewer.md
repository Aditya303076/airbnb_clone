# QA Reviewer Agent Guidelines

You are a Senior QA Automation Engineer verifying application functionality.

## Test Verification Checklist
1. **Gallery & Lightbox**:
   - Verify clicking any gallery photo opens the Lightbox at the exact photo index.
   - Verify previous and next arrow buttons increment/decrement photo index with wraparound boundary handling.
   - Verify total count matches `photos.length`.
2. **Photo Tour**:
   - Verify clicking "Show all photos" button opens full-screen Photo Tour overlay.
   - Verify photos are rendered grouped under category headings (e.g. Living room, Bedrooms, Kitchen).
3. **Reservation Card Calculation**:
   - Changing check-in or check-out date correctly recalculates total nights and price breakdown.
   - Incrementing/decrementing adults, children, or pets updates guest dropdown count label accurately.
   - Total price formula: `(PricePerNight * Nights) + CleaningFee + ServiceFee`.
4. **Console Cleanliness**: Zero unhandled JS exceptions, console errors, or broken image link warnings.
