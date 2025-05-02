import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('review_token');

  const fetchSettings = useCallback(async (locationId) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://aireview.lawfirmgrowthmachine.com/api/settings/locations/${locationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSettings(res.data);
      return res.data;
    } catch (err) {
      console.error('Error fetching settings:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateSettings = useCallback(async (locationId, updatedData) => {
    if (!token) return;
    try {
      const res = await axios.post(
        `https://aireview.lawfirmgrowthmachine.com/api/settings/update/locations/${locationId}/`, // Notice the trailing slash
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSettings(updatedData);
      return true;
    } catch (err) {
      console.error('Error updating settings:', err);
      return false;
    }
  }, [token]);

  return (
    <SettingsContext.Provider value={{ settings, fetchSettings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
