# Add Super Resolution and Validation

## Scope

Complete the previously requested Super Resolution workflow, then add the new Validation page. Existing Analysis, Compare, and Imagery page content will remain unchanged.

## Implementation

1. Extend the shared GeoSR shell so Super Resolution and Validation are valid active items and real sidebar links. Keep one navbar and one sidebar implementation.
2. Add `/super-resolution` with:
   - selected Kanpur scene, preprocessing checklist and details dialog
   - interactive ESRGAN/model selection and simulated multi-stage processing
   - reusable before/after comparison behavior matching Compare
   - RGB, false-color, and NIR output previews
   - quality, confidence, warning, workflow, navigation, and export controls
3. Add `/validation` with:
   - synchronized three-map comparison, zoom, opacity, swipe, and fullscreen controls
   - validation summary, spectral chart, and per-band metrics
   - spatial-fidelity cards and uncertainty/error visualization
   - traceability workflow, scientific notices, report dialog, and export toast
4. Reuse the existing imagery assets, semantic colors, shared panels, buttons, toast system, and responsive shell.

## Responsive behavior

- Desktop follows the dense reference layouts.
- Tablet moves right-side panels below the primary comparison area.
- Mobile stacks maps, controls, metrics, workflows, and actions while retaining the shared hamburger navigation.

## Verification

- Check the preview build and runtime logs.
- Exercise processing, model/tabs, comparison, zoom, opacity, fullscreen fallback, dialogs, exports, and navigation.
- Verify `/`, `/analysis`, `/imagery`, `/compare`, `/super-resolution`, and `/validation` at desktop and mobile sizes.
