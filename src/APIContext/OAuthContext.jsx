// OAuthContext.js

import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const OAuthContext = createContext();

export const OAuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    code: null,
    locationId: null,
    isAuthenticated: false,
    error: null,
  });

  const handleOAuthCallback = async (code, locationId) => {
    try {
      const response = await axios.post('https://aireview.lawfirmgrowthmachine.com/api/callback/', { code, locationId });
      if (response.data && response.data.success) {
        setAuthState({
          code,
          locationId,
          isAuthenticated: true,
          error: null,
        });
      }
    } catch (error) {
      setAuthState({
        error: 'Error processing OAuth callback',
        isAuthenticated: false,
      });
      console.error('Error during OAuth callback:', error);
    }
  };

  const value = {
    authState,
    handleOAuthCallback,
  };

  return <OAuthContext.Provider value={value}>{children}</OAuthContext.Provider>;
};

export const useOAuth = () => {
  const context = useContext(OAuthContext);
  if (!context) {
    throw new Error('useOAuth must be used within an OAuthProvider');
  }
  return context;
};
