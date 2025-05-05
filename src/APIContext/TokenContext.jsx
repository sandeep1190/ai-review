import React, { createContext, useContext } from "react";

const TokenContext = createContext();
const FIXED_LOCATION_ID = "0OKk2AUg2zJwKTYNwnmf";

export const TokenProvider = ({ children }) => {
  const fetchNewToken = async () => {
    try {
      const res = await fetch("https://aireview.lawfirmgrowthmachine.com/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId: FIXED_LOCATION_ID }),
      });

      if (!res.ok) throw new Error("Failed to fetch new token");

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

  const getAccessToken = async () => {
    let access = localStorage.getItem("review_token");
    if (!access) {
      access = await fetchNewToken();
    }
    return access;
  };

  return (
    <TokenContext.Provider value={{ fetchNewToken, refreshAccessToken, getAccessToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => useContext(TokenContext);
