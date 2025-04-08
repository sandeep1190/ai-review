import React, { useState } from "react";
import "./Location.scss";
import { FaSearch, FaFilter, FaSyncAlt, FaCog, FaRegEnvelope } from "react-icons/fa";
import LocationModal from "../../components/LocationModal/LocationModal";

// Dummy data
const dummyData = Array.from({ length: 97 }, (_, i) => ({
  id: i + 1,
  name: `Person ${i + 1}`,
  phone: "5684236526",
  address: "303 West Broad Street #202"
}));

const Location = () => {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filtered data
  const filteredData = dummyData.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalReviews = filteredData.length;
  const indexOfLastReview = currentPage * rowsPerPage;
  const indexOfFirstReview = indexOfLastReview - rowsPerPage;
  const paginatedData = filteredData.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(totalReviews / rowsPerPage);

  return (
    <div className="location-page">
      <div className="header">
        <h2>Locations</h2>
        <div className="breadcrumb">Dashboard / Locations</div>
      </div>

      <div className="review-section">
        <div className="location-controls">

            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <button className="filter-btn"><FaFilter /></button>
            </div>
            <button onClick={() => setShowModal(true)} className="sync-btn">
              <FaSyncAlt /> Sync Locations
            </button>
         
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" /></th>
                <th>#</th>
                <th>Location Name</th>
                <th>Location Primary Phone</th>
                <th>Front Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.id}>
                  <td><input type="checkbox" /></td>
                  <td>{indexOfFirstReview + index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.phone}</td>
                  <td>{item.address}</td>
                  <td className="actions">
                    <FaRegEnvelope />
                    <FaCog />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pagination">
        <div className="page-info">
          {totalReviews === 0
            ? "0 results"
            : `${indexOfFirstReview + 1}–${Math.min(indexOfLastReview, totalReviews)} of ${totalReviews}`}
        </div>
        <div className="page-controls">
          <label>Rows per page:</label>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>

          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ◀
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            ▶
          </button>
        </div>
      </div>

      <LocationModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Location;
