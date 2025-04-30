import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ReviewContext } from "../../APIContext/ReviewContext";
import "./Review.scss";
import { Calendar } from "primereact/calendar";
import FilterIcon from "../../assets/Icons/FilterIcon";
import ClipboardIcon from "../../assets/Icons/ClipboardIcon";
import ReplyIcon from "../../assets/Icons/ShareIcon";
import LocationModal from "../../components/LocationModal/LocationModal";
import ReplyModal from "../../components/ReplyModal/ReplyModal"; // ← make sure this path is correct

const getNumericRating = (rating) => {
  const ratingMap = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
  if (typeof rating === "string") {
    return ratingMap[rating.toUpperCase()] || 0;
  }
  const numeric = parseFloat(rating);
  return isNaN(numeric) ? 0 : Math.max(0, Math.min(5, Math.round(numeric)));
};

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

  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(10); // Set reviews per page to 10

  const handleResetFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    if (locationId && ghlLocationId && token) {
      fetchReviews();
    }
  }, [locationId, currentPage]);

  const filteredReviews = reviews?.filter((rev) => {
    const reviewDate = new Date(rev?.review_added_on);
    const start = startDate ? reviewDate >= new Date(startDate) : true;
    const end = endDate ? reviewDate <= new Date(endDate) : true;
    return start && end;
  }) || [];

  const handleReplyClick = (reviewId) => {
    setSelectedReviewId(reviewId);
    setShowReplyModal(true);
  };

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="review-page">
      <div className="review-section">
        <div className="top-section">
          <div className="sort-ftr">
            <div className="filters">
              <Calendar value={startDate} onChange={(e) => setStartDate(e.value)} placeholder="Start Date" dateFormat="yy-mm-dd" showIcon />
              <span>–</span>
              <Calendar value={endDate} onChange={(e) => setEndDate(e.value)} placeholder="End Date" dateFormat="yy-mm-dd" showIcon />
            </div>
            <span className="filter-icon"><FilterIcon /></span>
            <span className="reset-filters" onClick={handleResetFilters}>Reset Filters</span>
          </div>
          <button onClick={() => setShowSyncModal(true)} className="sync-btn">Sync Locations</button>
        </div>

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
              {currentReviews.length > 0 ? (
                currentReviews.map((rev, i) => (
                  <tr key={i}>
                    <td>{rev?.reviewer?.displayName || "Anonymous"}</td>
                    <td>{[...Array(getNumericRating(rev?.rating))].map((_, i) => <span key={i}>⭐</span>)}</td>
                    <td>{rev?.comments || "No comment"}</td>
                    <td>{formatReviewDate(rev?.review_added_on)}</td>
                    <td>{rev?.reply || "No reply"}</td>
                    <td>{formatReviewDate(rev?.review_added_on)}</td>
                    <td>
                      <div className="action-btn">
                        <ClipboardIcon />
                        <span onClick={() => handleReplyClick(rev?.id)} style={{ cursor: "pointer" }}>
                          <ReplyIcon />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>No reviews available</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="pagination">
        <button 
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} 
          disabled={currentPage === 1}
        >
          ◀
        </button>
        <span>{`Page ${currentPage} of ${Math.ceil(filteredReviews.length / reviewsPerPage)}`}</span>
        <button 
          onClick={() => handlePageChange(Math.min(currentPage + 1, Math.ceil(filteredReviews.length / reviewsPerPage)))} 
          disabled={currentPage === Math.ceil(filteredReviews.length / reviewsPerPage)}
        >
          ▶
        </button>
      </div>

      <LocationModal isOpen={showSyncModal} onClose={() => setShowSyncModal(false)} />
      {showReplyModal && selectedReviewId && (
        <ReplyModal
          reviewId={selectedReviewId}
          isOpen={showReplyModal}
          onClose={() => setShowReplyModal(false)}
        />
      )}
    </div>
  );
};

export default Review;
