import React, { useEffect, useState } from "react";
import "./ReplyModal.scss";

const ReplyModal = ({ reviewId, isOpen, onClose }) => {
  const [aiReply, setAiReply] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch AI suggestion when modal opens
  useEffect(() => {
    if (!isOpen || !reviewId) return;
    const token = localStorage.getItem("review_token");
    if (!token) {
      setError("No auth token found");
      return;
    }

    setLoading(true);
    fetch(`https://aireview.lawfirmgrowthmachine.com/api/ai-reply/${reviewId}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setAiReply(data.aiResponse || "");
        setError("");
      })
      .catch((err) => {
        console.error("AI Reply Fetch Error:", err);
        setError("Failed to fetch AI reply. " + err.message);
      })
      .finally(() => setLoading(false));
  }, [isOpen, reviewId]);

  const handleSubmit = () => {
    const token = localStorage.getItem("review_token");
    if (!token) {
      setError("No auth token found");
      return;
    }
    setLoading(true);
    fetch("https://aireview.lawfirmgrowthmachine.com/api/reply/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        reviewId,
        aiResponse: aiReply,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        return res.json();
      })
      .then(() => {
        onClose();
      })
      .catch((err) => {
        console.error("Post Reply Error:", err);
        setError("Failed to submit reply. " + err.message);
      })
      .finally(() => setLoading(false));
  };

  if (!isOpen) return null;

  return (
    <div className="reply-modal-overlay">
      <div className="reply-modal">
        <h3>AI Generated Reply</h3>
        {loading && <p>Loading…</p>}
        {error && <p className="error">{error}</p>}
        <textarea
          value={aiReply}
          onChange={(e) => setAiReply(e.target.value)}
          placeholder="AI generated reply will appear here..."
          rows={6}
        />
        <div className="modal-actions">
          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            Submit
          </button>
          <button className="cancel-btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;
