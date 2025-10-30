# CSM Helper Tools

This repository contains a small collection of HTML pages that help Customer Success Managers analyze data. Each visualizer page loads some libraries from public CDNs and talks to an external AI backend service. As such you need an active internet connection while using them.

## Available Pages

- **index.html** – Landing page listing the available tools.
- **license-visualizer.html** – Enter or import license adoption data, generate charts and request an AI summary.
- **prom-visualizer.html** – Paste ProM alert logs to visualize trends and ask the AI for insights.
- **release-update-visualizer.html** – Upload a CSV of release updates from Blacktab and review each update with optional AI analysis.
- **css-analyzer.html** – Hosts the Salesforce analytics prototype that leverages the `TechnicalHealthTreeDiagram` React component.

## Running the Pages

Open `index.html` (or any of the visualizer pages directly) in a web browser. The pages are purely client side so you do not need a server, though `index.php` is provided for convenience when using a PHP server. Because external fonts, Tailwind CSS, Chart.js and marked.js are loaded from CDN, and the AI requests are sent to the Heroku backend defined in `js/ai-endpoints.js`, the browser must be online.

## Using the `TechnicalHealthTreeDiagram` React Component

The reusable tree diagram described in `css-analyzer.html` lives in [`js/TechnicalHealthTreeDiagram.jsx`](js/TechnicalHealthTreeDiagram.jsx). You can drop the component into any modern React build (Vite, Create React App, Next.js, etc.) by following these steps:

1. **Install dependencies** – Make sure your project includes React, ReactDOM, D3, Framer Motion, and Tailwind CSS. The component expects Tailwind utility classes to be available globally.
   ```bash
   npm install react react-dom d3 framer-motion
   # Tailwind setup varies by project – follow https://tailwindcss.com/docs/installation for your bundler
   ```
2. **Copy the component file** – Add `TechnicalHealthTreeDiagram.jsx` to your React application's component directory (for example, `src/components`).
3. **Import and use the component** – Provide the hierarchical dataset that matches the schema documented in the file and render the component anywhere in your React tree:
   ```jsx
   import TechnicalHealthTreeDiagram from './components/TechnicalHealthTreeDiagram';

   const App = () => (
     <TechnicalHealthTreeDiagram data={technicalHealthData} />
   );
   ```
4. **Embed in standalone HTML (optional)** – If you need the visualization inside `css-analyzer.html`, load the component through a bundler or embed the compiled bundle via a `<script>` tag. The page already contains the necessary placeholder and Tailwind styles; you only need to ensure your compiled React bundle mounts the component onto the provided DOM node.

Refer to the top-level comments inside `TechnicalHealthTreeDiagram.jsx` for the sample dataset and customization tips. Each time the JSON data changes (for example, when Salesforce metrics refresh), pass the updated structure via the `data` prop and the visualization will recalculate scores automatically.

