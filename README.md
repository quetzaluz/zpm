# Zero Point Mandalas - Demo Site

A demo site featuring four splash page prototypes with animated SVG mandalas.

## Setup for GitHub Pages

1. Push this repository to GitHub
2. Go to your repository settings
3. Navigate to "Pages" in the left sidebar
4. Under "Source", select your main branch (usually `main` or `master`)
5. Click "Save"
6. Your site will be available at `https://[your-username].github.io/[repository-name]/`

## Project Structure

- `index.html` - Version 1 splash page (based on 2.png and 3.png)
- `version2.html` - Version 2 (based on 4.png) - Coming soon
- `version3.html` - Version 3 (based on 5.png) - Coming soon
- `version4.html` - Version 4 (based on 11.png) - Coming soon
- `styles.css` - Shared styles and animations
- `script.js` - JavaScript for animations and interactions

## Version 1 Features

- Animated SVG mandala with central geometric pattern
- Radiating colorful diamond pattern
- Scroll-triggered animations:
  - Color to black & white transition
  - Growing white circle overlay
  - Product listing reveal
- Navigation menu linking to all versions

## Development

Simply open `index.html` in a browser to view locally, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server
```

Then visit `http://localhost:8000`

