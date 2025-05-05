import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ReviewContext } from "../../APIContext/ReviewContext";
import { useTemplate } from "../../APIContext/TemplateContext";
import { useSettings } from "../../APIContext/SettingsContext";
import { useSocialMedia } from "../../APIContext/SocialMediaContext";

import "./Review.scss";
import { Calendar } from "primereact/calendar";
import FilterIcon from "../../assets/Icons/FilterIcon";
import ClipboardIcon from "../../assets/Icons/ClipboardIcon";
import ReplyIcon from "../../assets/Icons/ShareIcon";
import LocationModal from "../../components/LocationModal/LocationModal";
import ReplyModal from "../../components/ReplyModal/ReplyModal";

import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram } from 'react-icons/fa';

const socialPlatforms = [
  { name: 'facebook', icon: <FaFacebookF /> },
  { name: 'twitter', icon: <FaTwitter /> },
  { name: 'google', icon: <FaGoogle /> },
  { name: 'instagram', icon: <FaInstagram /> },
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
  const { postToSocialMedia } = useSocialMedia();
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
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState(''); 
  const [postedPlatforms, setPostedPlatforms] = useState({});
  const reviewsPerPage = 10;

  const platforms = ['facebook', 'twitter', 'google', 'instagram'];

  const handlePost = async (platform, reviewId) => {
    console.log('Posting to platform:', platform);
    console.log('Review ID:', reviewId);
    console.log('Token:', token);
    setPosting(true);
    setMessage('');
  
    try {
      console.log('Sending payload to backend:', {
        value: platform,
        reviewId,
        token,
      });
  
      await postToSocialMedia(token, reviewId, platform);
  
      setPostedPlatforms((prev) => ({
        ...prev,
        [reviewId]: {
          ...prev[reviewId],
          [platform]: true,
        },
      }));
      setMessage(`Posted successfully on ${platform}`);
    } catch (error) {
      console.error('Error posting review:', error);
      setPostedPlatforms((prev) => ({
        ...prev,
        [reviewId]: {
          ...prev[reviewId],
          [platform]: false,
        },
      }));
      setMessage(`Failed to post on ${platform}`);
    } finally {
      setPosting(false);
      setShowImageModal(false);
    }
  };
  

  useEffect(() => {
    if (locationId && token) {
      fetchReviews(locationId, token, currentPage, reviewsPerPage);
      fetchSettings(locationId, token);
    }
  }, [locationId, token, currentPage]);

  const filtered = (reviews || []).filter((r) => {
    if (!r.review_added_on) return true;
    const d = new Date(r.review_added_on);
    if (startDate && d < new Date(startDate)) return false;
    if (endDate && d > new Date(endDate)) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / reviewsPerPage) || 1;
  const sliceStart = (currentPage - 1) * reviewsPerPage;
  const currentReviews = filtered.slice(sliceStart, sliceStart + reviewsPerPage);

  const openReply = (id) => {
    setSelectedReviewId(id);
    setShowReplyModal(true);
  };

  const openImageModal = (review) => {
    setSelectedReviewId(review.review_id); // Ensure the selectedReviewId is set
    if (settings?.default_template) {
      const encodedName = encodeURIComponent(review.reviewer?.displayName || "Anonymous");
      const encodedReview = encodeURIComponent(review.comments || "No comment");
      const dynamicUrl = `${settings.default_template}?name=${encodedName}&review=${encodedReview}`;
      setTemplateImageUrl(dynamicUrl);
      setShowImageModal(true); // Show the modal
    }
  };



  return (
    <div className="review-page">
      <div className="review-section">
        <div className="top-section">
          <div className="sort-ftr">
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
            <FilterIcon className="filter-icon" />
            <button
              className="reset-filters"
              onClick={() => { setStartDate(null); setEndDate(null); }}
            >
              Reset Filters
            </button>
          </div>
          <button className="sync-btn" onClick={() => setShowSyncModal(true)}>
            Sync Locations
          </button>
        </div>

        {loading ? (
          <p>Loading reviews…</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <table className="review-table">
            <thead>
              <tr>
                <th className="nameformat">Name</th>
                <th>Rating</th>
                <th>Comments</th>
                <th className="dateformte">Posted At</th>
                <th>AI Reply</th>
                <th className="dateformte">Posted On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReviews.length ? (
                currentReviews.map((rev) => (
                  <tr key={rev.review_id}>
                    <td  className="nameformat">{rev.reviewer?.displayName || "Anonymous"}</td>
                    <td>
                      {[...Array(getNumericRating(rev.rating))].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </td>
                    <td>{rev.comments || "No comment"}</td>
                    <td className="dateformte">{formatDate(rev.review_added_on)}</td>
                    <td>{rev.ai_generated_response || ""}</td>
                    <td className="dateformte">
                      {(postedPlatforms[rev.review_id] && Object.keys(postedPlatforms[rev.review_id]).length > 0) ? (
                        Object.keys(postedPlatforms[rev.review_id]).map((platform) => {
                          const platformIcon = socialPlatforms.find((p) => p.name === platform)?.icon;
                          return platformIcon ? (
                            <span key={platform} style={{ marginRight: "5px" }}>
                              {platformIcon}
                            </span>
                          ) : null;
                        })
                      ) : (
                        <span></span>
                      )}
                    </td>
                    <td>
                      <div className="action-btn">
                        <span
                          onClick={() => openImageModal(rev)}
                          style={{ cursor: "pointer" }}
                        >
                          <ClipboardIcon />
                        </span>
                        <span
                          onClick={() => openReply(rev.review_id)}
                          style={{ cursor: "pointer", marginLeft: 8 }}
                        >
                          <ReplyIcon />
                        </span>
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

      {showImageModal && (
        <div className="image-modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setShowImageModal(false)}>
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
            </span>
            <img src={templateImageUrl} alt="Review Image" />
          </div>
        </div>
      )}

      <div className="pagination">
        <div className="pagination-left">
          <span>Page {currentPage} of {totalPages}</span>
        </div>
        <div className="pagination-right">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >◀</button>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >▶</button>
          <select
            value={currentPage}
            onChange={e => setCurrentPage(Number(e.target.value))}
          >
            {[...Array(totalPages)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      <LocationModal isOpen={showSyncModal} onClose={() => setShowSyncModal(false)} />

      {showReplyModal && (
        <ReplyModal
          reviewId={selectedReviewId}
          token={token}
          onClose={() => setShowReplyModal(false)}
        />
      )}

      {showImageModal && (
        <div className="image-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="image-modal" onClick={(e) => e.stopPropagation()}>
            <img src={templateImageUrl} alt="Default Template" style={{ maxWidth: "100%", height: "auto" }} />
            <button className="close-btn" onClick={() => setShowImageModal(false)}>
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
            </button>
            <div className="social-share">
              <div className="platform-icons">
                {platforms.map((platform) => (
                  <button key={platform} onClick={() => handlePost(platform, selectedReviewId)}>
                    {platform === "facebook" && <FaFacebookF />}
                    {platform === "twitter" && <FaTwitter />}
                    {platform === "google" && <FaGoogle />}
                    {platform === "instagram" && <FaInstagram />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
