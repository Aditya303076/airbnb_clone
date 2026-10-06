# Skill: Interaction Fidelity Standard

This skill defines observable interaction rules for Airbnb UI controls.

## Rules
1. **Header & Search**:
   - Clicking center search bar pill expands search modal overlay.
   - Globe button opens language & currency modal.
2. **Modals & Overlays**:
   - Esc key dismisses active overlay.
   - Focus traps inside active modal.
   - Body scroll lock enabled (`body.modal-open`).
3. **Gallery & Lightbox**:
   - Clicking hero photos opens single photo lightbox at that index.
   - "Show all photos" opens full-screen Photo Tour overlay.
   - Arrow keys (`←`, `→`) navigate photo lightbox.
