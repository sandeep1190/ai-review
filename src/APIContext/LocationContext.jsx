import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const locationId = "0OKk2AUg2zJwKTYNwnmf";

  const fetchLocations = async () => {
    try {
      setLoading(true);

      const tokenRes = await axios.post("https://aireview.lawfirmgrowthmachine.com/api/token/", {
        locationId,
      });

      const accessToken = tokenRes.data.access;

      if (!accessToken) {
        throw new Error("Access token not found in response.");
      }

      const locationRes = await axios.get("https://aireview.lawfirmgrowthmachine.com/api/locations/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setLocations(locationRes.data);

    } catch (err) {
      console.error("Error fetching locations:", err);
      setError("Failed to fetch locations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <LocationContext.Provider value={{ locations, loading, error }}>
      {children}
    </LocationContext.Provider>
  );
};
