# CSM Helper Tools

This repository contains a small collection of HTML pages that help Customer Success Managers analyze data. Each visualizer page loads some libraries from public CDNs and talks to an external AI backend service. As such you need an active internet connection while using them.

## Available Pages

- **index.html** – Landing page listing the available tools.
- **license-visualizer.html** – Enter or import license adoption data, generate charts and request an AI summary.
- **prom-visualizer.html** – Paste ProM alert logs to visualize trends and ask the AI for insights.
- **release-update-visualizer.html** – Upload a CSV of release updates from Blacktab and review each update with optional AI analysis.

## Running the Pages

Open `index.html` (or any of the visualizer pages directly) in a web browser. The pages are purely client side so you do not need a server, though `index.php` is provided for convenience when using a PHP server. Because external fonts, Tailwind CSS, Chart.js and marked.js are loaded from CDN, and the AI requests are sent to the Heroku backend defined in `js/ai-endpoints.js`, the browser must be online.

