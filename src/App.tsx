import { useState } from "react";
import type { Feature } from "geojson";

import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";

import "./App.css";

function App() {
  const [features, setFeatures] = useState<Feature[]>([]);

  // 🔽 EXPORT GEOJSON FUNCTION
  const exportGeoJSON = () => {
    if (features.length === 0) {
      alert("No shapes to export");
      return;
    }

    const geoJsonData = {
      type: "FeatureCollection",
      features,
    };

    const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "map-data.geojson";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      {/* Header with centered title + export */}
      <header className="header">
  <div className="header-left"></div>

  <h1 className="header-title">Map Drawing Tool</h1>

  <div className="header-right">
    <button
      className="export-btn"
      onClick={exportGeoJSON}
      disabled={features.length === 0}
    >
      Export GeoJSON
    </button>
  </div>
</header>


      {/* Main Area */}
      <div className="main">
        {/* Vertical Tools */}
        <Sidebar />

        {/* Centered Map */}
        <div className="map-wrapper">
          <MapView features={features} setFeatures={setFeatures} />
        </div>
      </div>
    </div>
  );
}

export default App;
