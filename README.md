# GeoSR Insight Hub

Build a high-fidelity, responsive frontend for a satellite-imagery analysis platform called “GeoSR Intelligence”.

IMPORTANT:
Use the uploaded reference image as the primary visual reference. Recreate its overall layout, spacing, proportions, dark theme, card structure, typography, colors, icons, map sections, charts, and dashboard hierarchy as closely as possible.

TECH STACK:
- React + TypeScript
- Tailwind CSS
- shadcn/ui components where useful
- Lucide React icons
- Recharts for graphs/charts
- Use clean reusable components
- No backend required
- Use realistic mock data
- Make every major UI control interactive

==================================================
1. OVERALL VISUAL STYLE
==================================================

Create a premium futuristic geospatial intelligence dashboard.

Theme:
- Very dark navy/blue background
- Glassmorphism-style panels
- Cyan/teal glowing accents
- Thin blue/cyan borders
- Subtle shadows and glow effects
- Professional satellite/AI/defense-tech aesthetic
- High information density but clean hierarchy

Primary colors:
- Background: #020D1A / #031525
- Secondary panels: #061B2D
- Card background: #071F33
- Cyan: #12D9F5
- Bright teal: #00E5C3
- Text: #E6F7FF
- Secondary text: #8CA8BC
- Borders: rgba(20, 170, 220, 0.25)

Use rounded corners around 8–12px.
Avoid excessive gradients.
Use subtle cyan glow around active buttons and important metrics.

==================================================
2. TOP NAVBAR
==================================================

Create a fixed horizontal top navigation bar.

Left:
- Globe/satellite icon
- “GeoSR Intelligence”
- Vertical divider
- Tagline:
  “AI-Powered Super Resolution Mapping for a Sharper Tomorrow”

Center/right:
- Large search field:
  “Search location / AOI / Scene ID...”
- Search icon

Right:
- Notification bell icon
- Status pill:
  green dot + “Processing Complete”
- Circular avatar with initials “SD”
- “Student”
- Dropdown chevron

Navbar height approximately 60px.

==================================================
3. LEFT SIDEBAR
==================================================

Create a fixed vertical sidebar approximately 215px wide.

Navigation items with icons:

Dashboard
Imagery
Super Resolution
Compare
Analysis
Validation
Exports
Settings

The active item must be:
Analysis

Active Analysis item:
- cyan/teal background
- cyan icon
- brighter text
- subtle glow

Bottom sidebar section:
Help | Documentation

Also create a project/info card near the bottom:

“SIH 2026”
“PS No. 26142”

“Deep Learning Based
Super Resolution Mapping
from Medium Resolution
Satellite Imagery”

Description:
“Enhancing satellite imagery
from ~10m to ~2m using AI
for better geospatial insights.”

Add a small satellite icon at the bottom of the card.

==================================================
4. MAIN CONTENT AREA
==================================================

Main content should start after sidebar and navbar.

Header:

Large title:
“Analysis”

Subtitle:
“Explore insights, perform analytical operations and extract valuable information from enhanced satellite imagery.”

Below it create a horizontal filter/control row.

Controls:

1. Scene ID dropdown
Label:
Scene ID
Value:
S2A_MSIL2A_20250415T053621

2. Location dropdown
Label:
Location
Value:
Kanpur, Uttar Pradesh, India

3. Resolution dropdown
Label:
Resolution
Value:
10 m → 2.5 m (4x)

4. Analysis Type dropdown
Label:
Analysis Type
Value:
Land Cover Classification

5. Large cyan button:
▶ Run Analysis

All controls should be functional dropdowns.

Clicking Run Analysis should briefly show a loading state and then return to:
“Analysis Complete”

==================================================
5. MAIN ANALYSIS MAP SECTION
==================================================

Create a large card containing an interactive-looking satellite map.

Use a realistic satellite imagery/map background if possible. If an external map is not available, create a convincing satellite-style placeholder using gradients, textures, or an available map component.

Map dimensions approximately:
750px × 290px.

Top-left overlay tabs:
- Enhanced Imagery (active)
- Classification Map

Map controls on left:
+
−
location/reset icon

Display a blue polygon AOI boundary on the map.

Inside polygon:
“AOI-1”

Add cyan corner/vertex points.

Add scale bar:
0 | 2.5 | 5 | 10 km

Top-right overlay legend card:
“Land Cover Classes”

Rows:
Built-up — 38.7%
Vegetation — 42.3%
Water — 8.9%
Agriculture — 7.4%
Others — 2.7%

Use colored indicators:
Built-up = red
Vegetation = green
Water = blue
Agriculture = yellow
Others = gray

==================================================
6. KEY INSIGHTS PANEL
==================================================

To the right of the map create a “Key Insights” card.

Header:
Key Insights

Create four insight rows:

Dominant Land Cover
Vegetation
42.3%

Urban Area
38.7%

Water Bodies
8.9%

Agricultural Land
7.4%

Each row should have a circular icon container and cyan numerical value.

Next to/beside it create a “Trends & Patterns” panel.

Items:

Urban expansion observed
in eastern region

Vegetation increase in northern
area (+6.2%)

Water body stable
(<1% change)

No significant change in
agricultural zones

Use appropriate icons.

==================================================
7. LAND COVER CLASSIFICATION CARD
==================================================

Below the map create a card titled:

“Land Cover Classification”

Top-right:
View: Classified Map
dropdown

Inside:
Create a colorful classified satellite/map visualization.

Beside/below the map show the classification legend:

Built-up — 38.7%
Vegetation — 42.3%
Water — 8.9%
Agriculture — 7.4%
Others — 2.7%

Also show a small horizontal legend at the bottom.

==================================================
8. CHANGE DETECTION CARD
==================================================

Create a card titled:

“Change Detection”

Show two side-by-side satellite image panels.

Left:
2024-04-15

Right:
2025-04-15

Add a circular comparison slider/button in the center.

Below:
large highlighted metric:
“+6.2%”
“Vegetation Increase”
“in Northern Region”

Add a button:
“View Change Map”

Clicking this button should open/change the visualization to a larger change-map state/modal.

==================================================
9. SPECTRAL ANALYSIS
==================================================

Create a card titled:

“Spectral Analysis”

Top-right:
AOI-1 dropdown

Use Recharts to create a clean line chart.

X-axis:
B2
B3
B4
B8

Y-axis:
0.0
0.2
0.4
0.6
0.8
1.0

Three lines:

Original (10m)
Super Resolved (2.5m)
Reference (HR)

Use cyan/teal/blue shades.

Add legend on the right/top.

Chart should have a dark transparent background and subtle grid lines.

==================================================
10. STATISTICAL SUMMARY
==================================================

Create a card titled:

“Statistical Summary”

Four metric cards:

NDVI
0.687
↑ 6.4%

NDBI
0.231
↑ 2.1%

MNDWI
0.142
↑ 3.7%

Land Surface Temp.
32.6 °C
↓ 1.8%

Each metric should have an appropriate icon.

==================================================
11. FEATURE EXTRACTION
==================================================

Create a card titled:

“Feature Extraction”

Four clickable feature cards:

Road Network
Extraction

Building
Detection

Water Body
Mapping

Vegetation Health
(NDVI)

Each card:
- icon
- title
- subtle hover animation
- cyan border on hover

Clicking one should show a small toast/modal saying that the corresponding analysis is being prepared.

==================================================
12. UNCERTAINTY ANALYSIS
==================================================

Create a card titled:

“Uncertainty Analysis”

Left:
small classified/satellite map preview.

Right:
Donut chart showing:

Mean
Uncertainty

8.2%

Legend:

Low (0–5%) — 62%
Medium (5–15%) — 28%
High (15–30%) — 8%
Very High (>30%) — 2%

Use Recharts PieChart/Donut chart.

==================================================
13. BOTTOM ACTION BUTTONS
==================================================

At the bottom-right create three buttons:

Download Analysis Report
Export GeoTIFF
View on Map

Buttons should have icons.

Interactions:
- Download Analysis Report → simulate report generation with toast
- Export GeoTIFF → show export progress toast
- View on Map → open map-focused modal/page

==================================================
14. RESPONSIVENESS
==================================================

Desktop should closely match the reference image.

For tablet:
- sidebar can collapse
- cards should resize
- grid should become 2 columns

For mobile:
- sidebar becomes a hamburger menu
- cards stack vertically
- map becomes full width
- charts become responsive
- controls stack vertically

==================================================
15. INTERACTIONS
==================================================

Implement realistic interactions:

- Sidebar navigation active states
- Dropdown menus
- Run Analysis loading state
- Search field
- Map zoom buttons
- Map layer tabs
- AOI selector
- Classification dropdown
- Change Detection comparison slider
- Feature Extraction cards
- Download/export buttons with toast notifications
- View on Map modal
- Notification dropdown
- Student profile dropdown

Use smooth transitions and hover states.

==================================================
16. IMPORTANT DESIGN DETAILS
==================================================

Do NOT make it look like a generic admin dashboard.

It should specifically look like an:
AI-powered satellite imagery / geospatial intelligence / remote sensing platform.

Maintain:
- dense professional dashboard layout
- dark navy background
- cyan highlights
- glowing borders
- satellite imagery
- analytical charts
- GIS terminology
- futuristic but realistic visual language

Use realistic mock satellite imagery and analytical data.

Make typography compact and professional.

The final result should visually resemble the uploaded reference screenshot as closely as possible while remaining a functional React frontend.

Create reusable components such as:

Navbar
Sidebar
FilterBar
MapPanel
InsightCard
TrendPanel
ClassificationCard
ChangeDetection
SpectralAnalysis
StatisticalSummary
FeatureExtraction
UncertaintyAnalysis
ActionButtons
ToastNotifications

Ensure the entire page fits naturally on a 1440×900 desktop viewport without unnecessary scrolling, while still supporting responsive layouts.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4fc546c6-b558-4f63-b843-5b4faab7c6d7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
