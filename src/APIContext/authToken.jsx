// src/api/authToken.js

export const fetchTokenAndStore = async (locationId) => {
    try {
      const response = await fetch("https://aireview.lawfirmgrowthmachine.com/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locationId }),
      });
  
      const data = await response.json();
  
      if (data?.token) {
        return data.token;
      } else {
        console.error("Token not found in response:", data);
        return null;
      }
    } catch (error) {
      console.error("Token fetch failed:", error);
      return null;
    }
  };
  