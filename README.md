# NASA Space Explorer

NASA Space Explorer is a beginner-friendly web app that uses NASA's Astronomy Picture of the Day (APOD) API.
Users can select a date range, load APOD results, and explore image or video entries in an interactive gallery.

## Features

- Date range picker with valid APOD limits (handled by dateRange.js)
- Moon Only filter (find entries with moon or lunar in title/explanation)
- Video Only filter (show only APOD video entries)
- Animated loading and empty-state messages
- Card gallery with image and video previews
- Click-to-open modal with full details for each APOD item
- Modal image entries include a large image and explanation
- Modal video entries include a preview and Watch on YouTube link
- Random space fact banner
- Responsive layout for mobile and desktop
- Footer with project context

## NASA Brand Colors

The UI uses exact NASA brand hex values:

- NASA Blue: #0B3D91
- NASA Red: #FC3D21
- White: #FFFFFF
- Black: #000000

Additional translucent effects are built from these same colors using hex-alpha values in style.css.

## Project Structure

- index.html: page structure, filters, gallery container, modal, footer
- style.css: NASA-themed styling and responsive rules
- js/dateRange.js: date input defaults and valid APOD date boundaries
- js/script.js: API fetch logic, filtering, rendering, modal behavior, messages
- img/: static image assets

## How To Run

1. Open index.html in your browser.
2. Select start and end dates.
3. Optional: enable Moon Only and/or Video Only.
4. Click Get Space Images.
5. Click a card to open details in the modal.

## API Notes

- Endpoint used: https://api.nasa.gov/planetary/apod
- The app is configured with a NASA API key in js/script.js.
- To use your own key, replace the API_KEY value in js/script.js.

## Learning Focus

This project is designed for students learning:

- JavaScript fundamentals
- DOM selection and updates
- Async API calls with fetch
- Conditional rendering and filtering
- Event listeners and UI interaction patterns
