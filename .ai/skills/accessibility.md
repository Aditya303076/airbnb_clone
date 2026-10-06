# Skill: Accessibility Guidelines (WCAG 2.1 AA)

This skill provides testing and implementation criteria for accessible web components.

## Guidelines
1. **Focus Management & Focus Locking**:
   - Modals must wrap interactive focus inside the active dialog.
   - When closing an overlay, restore document focus to the trigger button.
2. **Keyboard Operability**:
   - Support `Escape` key to dismiss dialogs/lightbox.
   - Support `ArrowLeft` (`←`) and `ArrowRight` (`→`) for photo carousel/lightbox.
   - All interactive controls must be reachable via `Tab` and `Shift+Tab`.
3. **Semantics**:
   - Use `<button>` for action elements.
   - Provide non-empty `alt` attributes for property photos.
   - Add `role="dialog"` and `aria-modal="true"` to overlays.
