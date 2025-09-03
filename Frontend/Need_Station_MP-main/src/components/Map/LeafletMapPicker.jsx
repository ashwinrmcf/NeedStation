import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const containerStyle = {
  width: "100%",
  height: "300px",
  borderRadius: "12px",
  zIndex: 1
};

const defaultCenter = [22.7196, 75.8577]; // Indore coordinates

// Component to handle map clicks
const LocationMarker = ({ position, setPosition, onLocationSelect }) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const newPosition = [lat, lng];
      setPosition(newPosition);
      
      // Don't change zoom or center when clicking
      // Just update the marker position
      
      // Reverse geocoding using Nominatim (OpenStreetMap's geocoding service)
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
        .then(response => response.json())
        .then(data => {
          const location = {
            lat: lat,
            lng: lng,
            address: data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          };
          onLocationSelect(location);
        })
        .catch(error => {
          console.error("Geocoding error:", error);
          const location = {
            lat: lat,
            lng: lng,
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          };
          onLocationSelect(location);
        });
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
};

const LeafletMapPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef(null);

  // Search function using Nominatim
  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchLocation(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchResultClick = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const newPosition = [lat, lng];
    
    setPosition(newPosition);
    setSearchQuery(result.display_name);
    setSearchResults([]);
    
    const location = {
      lat: lat,
      lng: lng,
      address: result.display_name
    };
    onLocationSelect(location);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Search Input */}
      <div style={{ marginBottom: "10px", position: "relative" }}>
        <input
          type="text"
          placeholder="Search your location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            boxSizing: "border-box",
            border: "2px solid rgba(92, 225, 230, 0.2)",
            width: "100%",
            height: "40px",
            padding: "0 12px",
            borderRadius: "8px",
            backgroundColor: "rgba(26, 26, 26, 0.8)",
            color: "white",
            outline: "none",
            fontSize: "14px"
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#5CE1E6";
            e.target.style.boxShadow = "0 0 10px rgba(92, 225, 230, 0.3)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(92, 225, 230, 0.2)";
            e.target.style.boxShadow = "none";
          }}
        />
        
        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "rgba(26, 26, 26, 0.95)",
            border: "1px solid rgba(92, 225, 230, 0.2)",
            borderRadius: "8px",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 1000,
            backdropFilter: "blur(10px)"
          }}>
            {searchResults.map((result, index) => (
              <div
                key={index}
                onClick={() => handleSearchResultClick(result)}
                style={{
                  padding: "10px 12px",
                  cursor: "pointer",
                  borderBottom: index < searchResults.length - 1 ? "1px solid rgba(92, 225, 230, 0.1)" : "none",
                  color: "white",
                  fontSize: "14px",
                  transition: "background-color 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(92, 225, 230, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                {result.display_name}
              </div>
            ))}
          </div>
        )}
        
        {isSearching && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            padding: "10px 12px",
            backgroundColor: "rgba(26, 26, 26, 0.95)",
            border: "1px solid rgba(92, 225, 230, 0.2)",
            borderRadius: "8px",
            color: "#5CE1E6",
            fontSize: "14px",
            zIndex: 1000
          }}>
            Searching...
          </div>
        )}
      </div>

      {/* Map Container */}
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={containerStyle}
        ref={mapRef}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Terrain">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Dark Mode">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        
        <LocationMarker 
          position={position} 
          setPosition={setPosition} 
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>
      
      <div style={{
        marginTop: "10px",
        fontSize: "12px",
        color: "#888",
        textAlign: "center"
      }}>
        Click on the map to select a location or search above
      </div>
    </div>
  );
};

export default LeafletMapPicker;
