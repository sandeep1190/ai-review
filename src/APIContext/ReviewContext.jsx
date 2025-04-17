import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ReviewContext = createContext();

const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });

  const locationId = "0OKk2AUg2zJwKTYNwnmf";

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const tokenRes = await axios.post("http://54.147.18.26/api/token/", {
        locationId,
      });

      const accessToken = tokenRes.data.access;

      if (!accessToken) {
        throw new Error("Access token not found in response.");
      }

      const reviewRes = await axios.get("http://54.147.18.26/api/reviews/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { results, count, next, previous } = reviewRes.data;
      setReviews(results); // ✅ Only set the array
      setPagination({ count, next, previous }); // Optional: handle pagination later

    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to fetch reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <ReviewContext.Provider value={{ reviews, loading, error, pagination }}>
      {children}
    </ReviewContext.Provider>
  );
};

export default ReviewProvider;
