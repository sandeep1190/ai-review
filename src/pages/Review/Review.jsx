// Review.jsx
import React, { useState, useContext } from "react";
import { ReviewContext } from "../../APIContext/ReviewContext";
import "./Review.scss";
import { Calendar } from "primereact/calendar";
import FilterIcon from "../../assets/Icons/FilterIcon";
import ClipboardIcon from "../../assets/Icons/ClipboardIcon";
import ReplyIcon from "../../assets/Icons/ShareIcon";
import LocationModal from "../../components/LocationModal/LocationModal";

const getNumericRating = (rating) => {
    const ratingMap = {
        ONE: 1,
        TWO: 2,
        THREE: 3,
        FOUR: 4,
        FIVE: 5,
    };

    if (typeof rating === "string") {
        return ratingMap[rating.toUpperCase()] || 0;
    }

    // fallback if rating is already numeric
    const numeric = parseFloat(rating);
    return isNaN(numeric) ? 0 : Math.max(0, Math.min(5, Math.round(numeric)));
};

const Review = () => {
    const { reviews, loading } = useContext(ReviewContext);

    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const totalReviews = Array.isArray(reviews) ? reviews.length : 0;
    const indexOfLastReview = currentPage * rowsPerPage;
    const indexOfFirstReview = indexOfLastReview - rowsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    const totalPages = Math.ceil(totalReviews / rowsPerPage);

    const handleResetFilters = () => {
        setStartDate(null);
        setEndDate(null);
        setCurrentPage(1);
    };

    const formatReviewDate = (dateString) => {
        if (!dateString) return "N/A";
      
        const date = new Date(dateString);
      
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString("en-US", { month: "long" });
        const year = date.getFullYear();
      
        return `${day}, ${month} ${year}`;
      };

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
                    <button onClick={() => setShowModal(true)} className="sync-btn">
                        Sync Locations
                    </button>
                </div>

                {loading ? (
                    <p>Loading reviews...</p>
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
                                        <td style={{ width: 190, fontWeight: 500 }}>
                                            {rev?.reviewer?.displayName || "Anonymous"}
                                        </td>
                                        <td>
                                            {[...Array(getNumericRating(rev?.rating))].map((_, i) => (
                                                <span key={i}>⭐</span>
                                            ))}
                                        </td>
                                        <td style={{ width: 350 }}>{rev?.comments || "No comment"}</td>
                                        <td>{formatReviewDate(rev?.created_at || rev?.review_added_on)}</td>

                                        <td></td>
                                        <td></td>
                                        <td>
                                            <div className="action-btn">
                                                <span>
                                                    <ClipboardIcon />
                                                </span>
                                                <span>
                                                    <ReplyIcon />
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: "center" }}>
                                        No reviews available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            <div className="pagination">
                <div className="page-info">
                    {totalReviews > 0 ? (
                        <>
                            {indexOfFirstReview + 1}–{Math.min(indexOfLastReview, totalReviews)} of {totalReviews}
                        </>
                    ) : (
                        "0 reviews"
                    )}
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
                    <span>
                        {currentPage}/{totalPages || 1}
                    </span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        ▶
                    </button>
                </div>
            </div>

            <LocationModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
};

export default Review;
