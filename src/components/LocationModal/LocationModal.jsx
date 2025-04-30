import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LocationModal.scss";

const LocationModal = ({ isOpen, onClose, onSyncLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);  // Add loading state
  const [error, setError] = useState("");  // Add error state

  // Fetch locations when modal opens
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);  // Set loading to true when fetching
        const tokenResponse = await axios.post("https://aireview.lawfirmgrowthmachine.com/api/token/", {
          locationId: "0OKk2AUg2zJwKTYNwnmf"
        });

        const token = tokenResponse.data.access;

        const res = await axios.get("https://aireview.lawfirmgrowthmachine.com/api/locations-list/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setLocations(res.data.locations);  // Make sure to use `locations` from response
        setLoading(false);  // Set loading to false after data is fetched
      } catch (error) {
        setLoading(false);
        setError("Error fetching locations.");
        console.error("Error fetching locations:", error);
      }
    };

    if (isOpen) {
      fetchLocations();
    }
  }, [isOpen]);

  const handleSync = () => {
    if (selectedLocation) {
      onSyncLocation(selectedLocation);
      onClose();
    } else {
      alert("Please select a location first.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Select Location</h3>

        {loading ? (
          <p>Loading locations...</p>  // Show loading message
        ) : error ? (
          <p>{error}</p>  // Show error message if fetching failed
        ) : (
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">Select a location</option>
            {locations.map((location) => (
              <option key={location.name} value={location.name}>
                {location.title}  {/* Show title instead of name */}
              </option>
            ))}
          </select>
        )}

        <button className="sync-btn" onClick={handleSync}>Sync Locations</button>
      </div>
    </div>
  );
};

export default LocationModal;
