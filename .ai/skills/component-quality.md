# Skill: Component Quality Guidelines

This skill enforces code architecture standards for React TypeScript components.

## Guidelines
1. **Type Safety**: Define explicit TypeScript interfaces for all component props, data models, and event handlers in `src/types/`. Avoid `any`.
2. **Separation of Concerns**: Separate data source (`src/data/propertyData.ts`), hooks logic (`src/hooks/`), styling (`src/styles/`), and presentational JSX components.
3. **Accessibility**: All interactive elements must support keyboard navigation (`Enter`, `Space`, `Esc`), provide visible focus rings, and include proper ARIA attributes.
4. **Resilience**: Gracefully handle missing image sources or edge boundary indices in gallery/lightbox.
