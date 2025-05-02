import React, { createContext, useState, useEffect } from "react";

export const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const locationId = "17431257306289895747"; 

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
  
      let access = localStorage.getItem("review_token");
  
      // Function to make the API call
      const makeRequest = async (token) => {
        return await fetch(`https://aireview.lawfirmgrowthmachine.com/api/reviews/locations/${locationId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      };
  
      let reviewRes = await makeRequest(access);
  
      // If token is expired or invalid (401), fetch a new token and retry once
      if (reviewRes.status === 401) {
        console.warn("Token expired or invalid. Refreshing...");
  
        access = await fetchNewToken(); // Refresh token
        reviewRes = await makeRequest(access); // Retry request with new token
  
        if (!reviewRes.ok) {
          const retryErrorText = await reviewRes.text();
          throw new Error(`Retry failed: ${reviewRes.status} - ${retryErrorText}`);
        }
      }
  
      // Handle non-OK response
      if (!reviewRes.ok) {
        const errorText = await reviewRes.text();
        throw new Error(`Request failed: ${reviewRes.status} - ${errorText}`);
      }
  
      // Parse and set data
      const data = await reviewRes.json();
      const reviewsArray = Array.isArray(data) ? data : data?.data || [];
      const pageInfo = data?.pagination || data?.meta || {};
  
      setReviews(reviewsArray);
      setPagination(pageInfo);
    } catch (err) {
      console.error("Fetch error:", err.message);
      setError("Failed to fetch reviews.");
    } finally {
      setLoading(false);
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
