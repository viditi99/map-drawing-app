import type { Feature } from "geojson";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

import { isFullyEnclosing, trimOverlap } from "../utils/geoUtils";
import { SHAPE_LIMITS } from "../config/shapeLimits";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapViewProps {
  features: Feature[];
  setFeatures: React.Dispatch<React.SetStateAction<Feature[]>>;
}

const MapView = ({ features, setFeatures }: MapViewProps) => {
  return (
    <div className="map-area">
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <FeatureGroup>
          <EditControl
            position="topright"
            draw={{
              polygon: true,
              rectangle: true,
              circle: true,
              polyline: true,
              marker: false,
              circlemarker: false,
            }}
            onCreated={(e) => {
              const geojson = e.layer.toGeoJSON();
              geojson.properties = {
                ...(geojson.properties ?? {}),
                shapeType: e.layerType,
              };

              const shapeType = e.layerType;

              const count = features.filter(
                (f) => f.properties?.shapeType === shapeType
              ).length;

              if (
                SHAPE_LIMITS[shapeType] !== undefined &&
                count >= SHAPE_LIMITS[shapeType]
              ) {
                alert(`Maximum ${SHAPE_LIMITS[shapeType]} ${shapeType}s allowed`);
                e.layer.remove();
                return;
              }

              const isAreaShape = ["polygon", "rectangle", "circle"].includes(shapeType);

              if (isAreaShape) {
                const existing = features.filter((f) =>
                  ["polygon", "rectangle", "circle"].includes(f.properties?.shapeType)
                );

                if (isFullyEnclosing(geojson, existing)) {
                  alert("New shape cannot fully enclose an existing shape");
                  e.layer.remove();
                  return;
                }

                const trimmed = trimOverlap(geojson, existing);

                if (!trimmed) {
                  alert("Shape fully overlapped and removed");
                  e.layer.remove();
                  return;
                }

                setFeatures((prev) => [...prev, trimmed]);
              } else {
                setFeatures((prev) => [...prev, geojson]);
              }
            }}
          />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};

export default MapView;
