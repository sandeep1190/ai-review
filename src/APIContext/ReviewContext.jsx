import React, { createContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // 👈 import useParams

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const { locationId } = useParams(); // 👈 get locationId from URL

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      let access = localStorage.getItem("review_token");

      if (!access) {
        access = await fetchNewToken();
      }

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

  const fetchNewToken = async () => {
    try {
      const res = await fetch("https://aireview.lawfirmgrowthmachine.com/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error("Failed to fetch new token");
      }

      const data = await res.json();
      localStorage.setItem("review_token", data.access);
      localStorage.setItem("review_refresh_token", data.refresh);
      return data.access;
    } catch (err) {
      console.error("Error fetching new token:", err.message);
      throw err;
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("review_refresh_token");

    if (!refreshToken) return null;

    try {
      const res = await fetch("https://aireview.lawfirmgrowthmachine.com/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!res.ok) return null;

      const data = await res.json();
      localStorage.setItem("review_token", data.access);
      return data.access;
    } catch (err) {
      console.error("Refresh token error:", err.message);
      return null;
    }
  };

  useEffect(() => {
    if (locationId) {
      fetchReviews();
    }
  }, [locationId]);

  return (
    <ReviewContext.Provider value={{ reviews, loading, error, pagination, fetchReviews }}>
      {children}
    </ReviewContext.Provider>
  );
};
