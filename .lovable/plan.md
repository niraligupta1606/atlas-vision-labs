# Add the Compare imagery workspace

## What will be built
- Add a responsive `/compare` page matching the supplied reference: compact header and filters, draggable before/after imagery, preview tiles, comparison metrics, spectral bars, confidence chart, warning, selection controls, view modes, and export actions.
- Keep the current Analysis page’s visual layout and behavior unchanged.
- Make Compare and Analysis real sidebar links, with the current page highlighted and the same mobile/collapsed navigation behavior.

## Shared application experience
- Extract the existing navbar, sidebar, filter control, and panel frame into shared presentation components without changing their styling.
- Reuse the current theme, imagery assets, buttons, typography, menus, project information card, and toast treatment on both pages.

## Interactions
- Support draggable comparison position, zoom, fullscreen imagery, Quantitative/Spectral tabs, image selection, Split/Swipe/Overlay modes with opacity adjustment, responsive controls, and simulated report/GeoTIFF notifications.
- Preserve all current Analysis controls, charts, dialogs, and notifications.

## Technical details
- Add a TanStack route for `/compare` with unique page metadata.
- Keep all data and actions frontend-only with local mock state.
- Verify the Analysis and Compare pages at desktop and mobile sizes, including navigation, comparison modes, fullscreen, exports, and preview errors.
