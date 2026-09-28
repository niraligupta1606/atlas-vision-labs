# Add the Imagery Library

## Scope
- Add a new `/imagery` page within the existing GeoSR Intelligence application.
- Preserve the current Analysis and Compare pages and reuse their shared navigation, styling, controls, imagery, and notifications.

## Implementation
- Extend the shared sidebar so Imagery links to `/imagery` and receives the existing active-page treatment.
- Build the Imagery page from focused sections: header and filters, interactive AOI map, searchable/sortable imagery grid, selected-scene details, metadata, spectral previews, image-quality chart, and upload dialog.
- Populate twelve realistic local mock scenes and render eight initially visible cards in the dense four-column desktop layout.
- Wire scene selection, card menus, filtering, sorting, map controls, upload simulation, processing actions, super-resolution progress, and notifications using local state only.
- Match the uploaded screenshot’s wide map-and-grid workspace with a right details rail, then stack gracefully on tablet and mobile.
- Add route-specific title, description, Open Graph, and Twitter metadata.

## Validation
- Check the automated build result after edits.
- Exercise `/imagery` interactions and responsive layout in the browser.
- Navigate among Imagery, Compare, and Analysis and confirm each page remains functional.
