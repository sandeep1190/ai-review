import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ReviewContext } from "../../APIContext/ReviewContext";
import { useTemplate } from "../../APIContext/TemplateContext";
import { useSettings } from "../../APIContext/SettingsContext";

import "./Review.scss";
import { Calendar } from "primereact/calendar";
import FilterIcon from "../../assets/Icons/FilterIcon";
import ClipboardIcon from "../../assets/Icons/ClipboardIcon";
import ReplyIcon from "../../assets/Icons/ShareIcon";
import LocationModal from "../../components/LocationModal/LocationModal";
import ReplyModal from "../../components/ReplyModal/ReplyModal";

import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram } from "react-icons/fa";
import axios from "axios";

const socialPlatforms = [
  { name: "facebook", icon: <FaFacebookF /> },
  { name: "twitter", icon: <FaTwitter /> },
  { name: "google", icon: <FaGoogle /> },
  { name: "instagram", icon: <FaInstagram /> },
];

const getNumericRating = (rating) => {
  const map = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
  if (typeof rating === "string") return map[rating.toUpperCase()] || 0;
  const n = parseFloat(rating);
  return isNaN(n) ? 0 : Math.max(0, Math.min(5, Math.round(n)));
};

const formatDate = (s) => {
  if (!s) return "N/A";
  const d = new Date(s);
  return `${d.getDate()}, ${d.toLocaleString("en-US", { month: "long" })} ${d.getFullYear()}`;
};

const Review = () => {
  const { locationId } = useParams();
  const token = localStorage.getItem("review_token");
  const { reviews, loading, error, fetchReviews } = useContext(ReviewContext);
  const { selectedTemplateUrl } = useTemplate();
  const { settings, fetchSettings } = useSettings();

  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [templateImageUrl, setTemplateImageUrl] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postedPlatforms, setPostedPlatforms] = useState({}); // NEW STATE
  const reviewsPerPage = 10;

  useEffect(() => {
    if (locationId && token) {
      fetchReviews(locationId, token, 1, 1000);
      fetchSettings(locationId, token);
    }
  }, [locationId, token]);

  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate]);

  const filteredReviews = (reviews || []).filter((r) => {
    if (!r.review_added_on) return true;
    const reviewDate = new Date(r.review_added_on);
    if (startDate && reviewDate < new Date(startDate)) return false;
    if (endDate && reviewDate > new Date(endDate)) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage) || 1;
  const currentReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const openReply = (id) => {
    setSelectedReviewId(id);
    setShowReplyModal(true);
  };

  const openImageModal = (review) => {
    if (settings?.default_template) {
      const encodedName = encodeURIComponent(review.reviewer?.displayName || "Anonymous");
      const encodedReview = encodeURIComponent(review.comments || "No comment");
      const dynamicUrl = `${settings.default_template}?name=${encodedName}&review=${encodedReview}`;

      setSelectedReviewId(review.review_id);
      setTemplateImageUrl(dynamicUrl);
      setShowImageModal(true);
    }
  };

  const handlePostToSocial = async (platform) => {
    if (!selectedReviewId || !token) {
      alert("No review selected or token missing.");
      return;
    }

    try {
      await axios.post(
        "https://aireview.lawfirmgrowthmachine.com/api/post-review/",
        {
          value: platform.charAt(0).toUpperCase() + platform.slice(1),
          reviewId: selectedReviewId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPostedPlatforms((prev) => {
        const existing = prev[selectedReviewId] || [];
        if (!existing.includes(platform)) {
          return {
            ...prev,
            [selectedReviewId]: [...existing, platform],
          };
        }
        return prev;
      });

      alert(`${platform} posted successfully!`);
    } catch (error) {
      console.error("Error posting to", platform, error);
      alert(`Failed to post to ${platform}`);
    }
  };

  return (
    <div className="review-page">
      <div className="review-section">
        <div className="top-section">
          <div className="sort-ftr">
            <Calendar value={startDate} onChange={(e) => setStartDate(e.value)} placeholder="Start Date" dateFormat="yy-mm-dd" showIcon />
            <span>–</span>
            <Calendar value={endDate} onChange={(e) => setEndDate(e.value)} placeholder="End Date" dateFormat="yy-mm-dd" showIcon />
            <FilterIcon className="filter-icon" />
            <button className="reset-filters" onClick={() => { setStartDate(null); setEndDate(null); }}>
              Reset Filters
            </button>
          </div>
          <button className="sync-btn" onClick={() => setShowSyncModal(true)}>Sync Locations</button>
        </div>

        {loading ? (
          <p>Loading reviews…</p>
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
                <th>AI Reply</th>
                <th>Posted On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReviews.length ? (
                currentReviews.map((rev) => (
                  <tr key={rev.review_id}>
                    <td>{rev.reviewer?.displayName || "Anonymous"}</td>
                    <td>{[...Array(getNumericRating(rev.rating))].map((_, i) => <span key={i}>⭐</span>)}</td>
                    <td>{rev.comments || "No comment"}</td>
                    <td>{formatDate(rev.review_added_on)}</td>
                    <td>{rev.ai_generated_response || ""}</td>
                    <td>
                      {(postedPlatforms[rev.review_id] || []).map((platform) => {
                        const icon = socialPlatforms.find((p) => p.name === platform)?.icon;
                        return <span key={platform} style={{ marginRight: "5px" }}>{icon}</span>;
                      })}
                    </td>
                    <td>
                      <div className="action-btn">
                        <span onClick={() => openImageModal(rev)} style={{ cursor: "pointer" }}>
                          <ClipboardIcon />
                        </span>
                        <span onClick={() => openReply(rev.review_id)} style={{ cursor: "pointer", marginLeft: 8 }}>
                          <ReplyIcon />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" style={{ textAlign: "center" }}>No reviews available</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="pagination">
        <div className="pagination-left"><span>Page {currentPage} of {totalPages}</span></div>
        <div className="pagination-right">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>◀</button>
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>▶</button>
          <select value={currentPage} onChange={(e) => setCurrentPage(Number(e.target.value))}>
            {[...Array(totalPages)].map((_, i) => (
              <option key={i + 1} value={i + 1}>Page {i + 1}</option>
            ))}
          </select>
        </div>
      </div>

      <LocationModal isOpen={showSyncModal} onClose={() => setShowSyncModal(false)} />

      {showReplyModal && (
        <ReplyModal reviewId={selectedReviewId} token={token} onClose={() => setShowReplyModal(false)} />
      )}

      {showImageModal && (
        <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <img src={templateImageUrl} alt="Default Template" style={{ maxWidth: "100%", height: "auto" }} />
            <button className="close-btn" onClick={() => setShowImageModal(false)}>×</button>
            <div className="social-icons">
              {socialPlatforms.map(({ name, icon }) => (
                <button key={name} className="social-btn" onClick={() => handlePostToSocial(name)}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
