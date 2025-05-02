import React, { useEffect, useState } from "react";
import "./ReplyModal.scss";

const ReplyModal = ({ reviewId, token, onClose }) => {
  const [aiReply, setAiReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!reviewId || !token) return;

    setLoading(true);
    setError("");

    fetch(`https://aireview.lawfirmgrowthmachine.com/api/ai-reply/${reviewId}/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const json = await res.json();
        console.log("API response:", json);
        if (!res.ok) throw new Error(`Server ${res.status}`);
        return json;
      })
      .then((data) => {
        if (typeof data.message === "string") {
          setAiReply(data.message);
        } else {
          setAiReply("");
        }
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setError("Failed to load AI reply.");
      })
      .finally(() => setLoading(false));
  }, [reviewId, token]);

  const handleSubmit = () => {
    if (!reviewId || !token) {
      setError("Missing review ID or token.");
      return;
    }

    setLoading(true);
    setError("");

    // Send the updated reply (aiReply) to the backend
    fetch("https://aireview.lawfirmgrowthmachine.com/api/reply/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reviewId, aiResponse: aiReply }), // Sending updated reply
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server ${res.status}`);
        return res.json();
      })
      .then(() => onClose())
      .catch((err) => {
        console.error("Post Error:", err);
        setError("Failed to submit reply.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="reply-modal-overlay">
      <div className="reply-modal">
        <h3>AI Generated Reply</h3>
        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}

        <textarea
          value={aiReply}
          onChange={(e) => setAiReply(e.target.value)}
          placeholder="AI generated reply will appear here…"
          rows={6}
          className="reply-textarea"
        />

        <div className="modal-footer">
          <button onClick={onClose} disabled={loading} className="close-btn">
            Close
          </button>
          <button onClick={handleSubmit} disabled={loading} className="submit-btn">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;
