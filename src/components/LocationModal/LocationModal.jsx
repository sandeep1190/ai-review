import React from "react";
import "./LocationModal.scss";

const LocationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Select Locations</h3>
        <select>
          <option value="">Select a location</option>
          <option value="loc1">Location 1</option>
          <option value="loc2">Location 2</option>
        </select>
        <button className="sync-btn">Sync Locations</button>
      </div>
    </div>
  );
};

export default LocationModal;
