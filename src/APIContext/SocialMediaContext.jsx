import React, { createContext, useState, useContext } from "react";
import axios from "axios";

const SocialMediaContext = createContext();

export const SocialMediaProvider = ({ children }) => {
  const [postedPlatforms, setPostedPlatforms] = useState({});

  const postToSocialMedia = async (token, reviewId, platform) => {
    try {
      const response = await axios.post(
        `https://aireview.lawfirmgrowthmachine.com/api/post-review/`,
        { value: platform, reviewId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPostedPlatforms((prev) => ({
        ...prev,
        [reviewId]: [...(prev[reviewId] || []), platform],
      }));

      return response.data;
    } catch (error) {
      console.error("Social media post failed:", error);
      throw error;
    }
  };

  return (
    <SocialMediaContext.Provider value={{ postToSocialMedia, postedPlatforms }}>
      {children}
    </SocialMediaContext.Provider>
  );
};

export const useSocialMedia = () => useContext(SocialMediaContext);
