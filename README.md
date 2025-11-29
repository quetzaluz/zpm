# Zero Point Mandalas - Demo Site

A demo site featuring four splash page prototypes with animated SVG mandalas. It's fun to work with artists!

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

## Local Development

**Important:** You need to run a local server to view this site properly. Opening the HTML file directly (file://) may cause issues with JavaScript execution.

### Option 1: Python (Recommended - No installation needed)

If you have Python installed (comes with macOS and most Linux systems):

```bash
# Navigate to the project directory
cd /Users/c/Documents/zpm-prototype

# Python 3
python3 -m http.server 8000

# Or Python 2 (if Python 3 not available)
python -m SimpleHTTPServer 8000
```

Then open your browser and visit: `http://localhost:8000`

### Option 2: Node.js

If you have Node.js installed:

```bash
# Navigate to the project directory
cd /Users/c/Documents/zpm-prototype

# Using npx (no installation needed)
npx http-server -p 8000

# Or install http-server globally first
npm install -g http-server
http-server -p 8000
```

Then open your browser and visit: `http://localhost:8000`

### Option 3: VS Code Live Server

If you're using VS Code:
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 4: PHP (if installed)

```bash
cd /Users/c/Documents/zpm-prototype
php -S localhost:8000
```

### Stopping the Server

Press `Ctrl + C` in the terminal to stop the server.

