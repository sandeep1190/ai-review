import React, { createContext, useState, useEffect } from "react";
import { useToken } from "./TokenContext"; // ✅ import token context

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const { getAccessToken, fetchNewToken, refreshAccessToken } = useToken();

  const locationId = "17431257306289895747"; // ✅ for reviews

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      let access = await getAccessToken();

      let response = await fetchReviewsWithToken(access);

      if (response.status === 401) {
        access = await refreshAccessToken();
        if (!access) {
          access = await fetchNewToken();
        }
        response = await fetchReviewsWithToken(access);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Fetch failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const reviewsArray = Array.isArray(data) ? data : data?.data || [];
      const pageInfo =
        data?.pagination ||
        (typeof data === "object" && !Array.isArray(data) && data.meta) ||
        {};

      setReviews(reviewsArray);
      setPagination(pageInfo);
    } catch (err) {
      console.error("Fetch error:", err.message);
      setError("Failed to fetch reviews.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewsWithToken = (token) => {
    return fetch(`https://aireview.lawfirmgrowthmachine.com/api/reviews/locations/${locationId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <ReviewContext.Provider value={{ reviews, loading, error, pagination, fetchReviews }}>
      {children}
    </ReviewContext.Provider>
  );
};
