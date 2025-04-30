import React, { createContext, useState, useEffect } from "react";

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const locationId = "17431257306289895747"; // Location ID should be dynamic if needed

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error before fetching

      let access = localStorage.getItem("review_token");

      if (!access) {
        console.log("No token found, fetching a new one...");
        access = await fetchNewToken(); // Fetch a new token if none exists
      }

      console.log("Using token:", access); // Log the token being used

      // Try fetching the reviews with the current token
      const reviewRes = await fetch(`https://aireview.lawfirmgrowthmachine.com/api/reviews/locations/${locationId}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
          Accept: "application/json",
        },
      });

      if (!reviewRes.ok) {
        const errorText = await reviewRes.text();
        console.error("Error fetching reviews:", errorText); // Log the error response

        if (reviewRes.status === 401) {
          console.log("Token expired or invalid, fetching a new token...");
          access = await fetchNewToken(); // Fetch a new token if expired/invalid

          // Retry fetching the reviews with the new token
          const retryRes = await fetch(`https://aireview.lawfirmgrowthmachine.com/api/reviews/locations/${locationId}/`, {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          });

          const retryErrorText = await retryRes.text();
          if (!retryRes.ok) {
            console.error("Error after retry:", retryErrorText);
            throw new Error(`Error ${retryRes.status}: ${retryErrorText}`);
          }

          const retryData = await retryRes.json();
          setReviews(retryData?.data || []);
          setPagination(retryData?.pagination || {});
          return;
        }

        throw new Error(`Error ${reviewRes.status}: ${errorText}`);
      }

      const data = await reviewRes.json();
      console.log("Reviews fetched successfully:", data); // Log data received

      // **FIX** ← if data is an array, use it directly
      const reviewsArray = Array.isArray(data) ? data : data?.data || [];
      setReviews(reviewsArray); // Set reviews correctly

      // pagination: if the API gave you a meta/pagination chunk
      const pageInfo =
        data?.pagination ||
        (typeof data === "object" && !Array.isArray(data) && data.meta) ||
        {};
      setPagination(pageInfo); // Set pagination correctly

    } catch (err) {
      console.error("Fetch error:", err.message);
      setError("Failed to fetch reviews."); // Set error state
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Helper function to fetch a new token
  const fetchNewToken = async () => {
    try {
      const tokenRes = await fetch("https://aireview.lawfirmgrowthmachine.com/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId }),
      });

      if (!tokenRes.ok) {
        const errorText = await tokenRes.text();
        console.error("Error fetching new token:", errorText);
        throw new Error(`Failed to fetch token: ${tokenRes.status} - ${errorText}`);
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access;
      console.log("Fetched new token:", accessToken); // Log the new token
      localStorage.setItem("review_token", accessToken); // Save token to localStorage
      return accessToken;
    } catch (error) {
      console.error("Error fetching new token:", error.message);
      throw new Error(`Error fetching new token: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchReviews(); // Call fetchReviews when component mounts
  }, []);

  return (
    <ReviewContext.Provider value={{ reviews, loading, error, pagination, fetchReviews }}>
      {children}
    </ReviewContext.Provider>
  );
};
