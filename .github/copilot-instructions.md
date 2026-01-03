# GitHub Copilot Instructions for CSM Helper Tools

## Overview
This repository contains a collection of HTML pages designed to assist Customer Success Managers in analyzing data. The visualizer pages utilize libraries from public CDNs and communicate with an external AI backend service, requiring an active internet connection.

## Architecture
- **Main Components**: The project consists of various HTML visualizers, each serving a specific analytical purpose. Key components include:
  - **Adoption Analyzer**: Analyzes adoption metrics across Salesforce organizations.
  - **CSS Analyzer**: Evaluates CSS performance and compliance.
  - **Technical Health Tree Diagram**: A React component visualizing technical health metrics.

- **Data Flow**: Data is fetched from external AI services via defined endpoints in `js/ai-endpoints.js`. The results are processed and displayed in the respective HTML pages.

## Developer Workflows
- **Running the Pages**: To run the visualizer pages, simply open the HTML files in a web browser. Ensure that you have an active internet connection to access the external services.
- **Building and Testing**: For the React component, ensure you have the necessary dependencies installed:
  ```bash
  npm install react react-dom d3 framer-motion
  ```
- **Debugging**: Use browser developer tools to inspect network requests and console logs for debugging issues related to data fetching and rendering.

## Project Conventions
- **File Structure**: Follow the established directory structure for organizing components, styles, and scripts. For example, React components should reside in the `js/` directory.
- **Naming Conventions**: Use camelCase for JavaScript variables and functions, and kebab-case for HTML file names.

## Integration Points
- **External Dependencies**: The project relies on several external libraries, including:
  - **D3.js**: For data visualization.
  - **Chart.js**: For charting capabilities.
  - **Tailwind CSS**: For styling.

- **Cross-Component Communication**: Components communicate through shared data structures and props, particularly in the React component where data is passed down from parent to child components.

## Examples
- **Using the Technical Health Tree Diagram**: To integrate the `TechnicalHealthTreeDiagram` component, follow these steps:
  1. Install dependencies as mentioned above.
  2. Import the component in your React application:
     ```jsx
     import TechnicalHealthTreeDiagram from './components/TechnicalHealthTreeDiagram';
     ```
  3. Use the component in your JSX:
     ```jsx
     <TechnicalHealthTreeDiagram data={technicalHealthData} />
     ```

## Conclusion
These instructions aim to provide a comprehensive understanding of the CSM Helper Tools codebase, enabling AI coding agents to navigate and contribute effectively. For any unclear or incomplete sections, please provide feedback for further iterations.