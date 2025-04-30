import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ReviewContext } from "../../APIContext/ReviewContext";
import "./Review.scss";
import { Calendar } from "primereact/calendar";
import FilterIcon from "../../assets/Icons/FilterIcon";
import ClipboardIcon from "../../assets/Icons/ClipboardIcon";
import ReplyIcon from "../../assets/Icons/ShareIcon";
import LocationModal from "../../components/LocationModal/LocationModal";

// Helper function to get numeric rating value
const getNumericRating = (rating) => {
  const ratingMap = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
  if (typeof rating === "string") {
    return ratingMap[rating.toUpperCase()] || 0;
  }
  const numeric = parseFloat(rating);
  return isNaN(numeric) ? 0 : Math.max(0, Math.min(5, Math.round(numeric)));
};

// Helper function to format the review date
const formatReviewDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return `${date.getDate()}, ${date.toLocaleString("en-US", { month: "long" })} ${date.getFullYear()}`;
};

const Review = () => {
  const { locationId } = useParams();
  const ghlLocationId = "0OKk2AUg2zJwKTYNwnmf"; 
  const token = localStorage.getItem("review_token");
  
  const { reviews, loading, error, fetchReviews, pagination } = useContext(ReviewContext);

  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    if (locationId && ghlLocationId) {
      if (process.env.NODE_ENV === "development") {
        console.log("Location ID from URL:", locationId);
        console.log("GHL Location ID:", ghlLocationId);
        console.log("Fetched Token:", token);
      }

      if (token) {
        console.log("Fetching reviews...");
        fetchReviews();
      }
    }
  }, [locationId, currentPage, rowsPerPage]);

  // Reset filters function
  const handleResetFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const filteredReviews = reviews?.filter((rev) => {
    const reviewDate = new Date(rev?.review_added_on);
    const start = startDate ? reviewDate >= new Date(startDate) : true;
    const end = endDate ? reviewDate <= new Date(endDate) : true;
    return start && end;
  }) || [];

  const totalPages = Math.ceil(filteredReviews.length / rowsPerPage) || 1;
  const startIdx = (currentPage - 1) * rowsPerPage;
  const pageSlice = filteredReviews.slice(startIdx, startIdx + rowsPerPage);

  return (
    <div className="review-page">
      <div className="review-section">
        <div className="top-section">
          <div className="sort-ftr">
            <div className="filters">
              <Calendar
                value={startDate}
                onChange={(e) => setStartDate(e.value)}
                placeholder="Start Date"
                dateFormat="yy-mm-dd"
                showIcon
              />
              <span>–</span>
              <Calendar
                value={endDate}
                onChange={(e) => setEndDate(e.value)}
                placeholder="End Date"
                dateFormat="yy-mm-dd"
                showIcon
              />
            </div>
            <span className="filter-icon">
              <FilterIcon />
            </span>
            <span className="reset-filters" onClick={handleResetFilters}>
              Reset Filters
            </span>
          </div>

          <button
            onClick={() => {
              console.log("Sync Locations button clicked!");
              setShowModal(true);
            }}
            className="sync-btn"
          >
            Sync Locations
          </button>
        </div>

        {/* Show loading, error, or reviews table */}
        {loading ? (
          <p>Loading reviews...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <table className="review-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Rating</th>
                <th>Comments</th>
                <th>Posted At</th>
                <th>Reply</th>
                <th>Posted On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pageSlice.length > 0 ? (
                pageSlice.map((rev, i) => (
                  <tr key={i}>
                    <td>{rev?.reviewer?.displayName || "Anonymous"}</td>
                    <td>
                      {[...Array(getNumericRating(rev?.rating))].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </td>
                    <td>{rev?.comments || "No comment"}</td>
                    <td>{formatReviewDate(rev?.review_added_on)}</td>
                    <td>{rev?.reply || "No reply"}</td>
                    <td>{formatReviewDate(rev?.review_added_on)}</td>
                    <td>
                      <div className="action-btn">
                        <ClipboardIcon />
                        <ReplyIcon />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No reviews available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination section */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ◀
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          ▶
        </button>
      </div>

      {/* Modal for syncing locations */}
      <LocationModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Review;
