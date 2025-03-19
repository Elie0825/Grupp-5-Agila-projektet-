import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";  // Kontrollera att detta pekar på rätt fil

// Hämta root-elementet och hantera TypeScript-typen
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Check that index.html has a <div id='root'></div>.");
}

// Skapa React root och rendera appen
const root = ReactDOM.createRoot(rootElement as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);