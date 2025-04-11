import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const Dashboard = () => {
  const [message, setMessage] = useState("Completing login...");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const locationId = searchParams.get("locationId");

    if (code && locationId) {
      axios.post("http://54.147.18.26/api/callback/", {
        code,
        locationId,
      })
      .then((response) => {
        setMessage("Login Successful");
      })
      .catch((error) => {
        console.error("Callback API error:", error);
        setMessage("Login failed. Please try again.");
      });
    } else {
      setMessage("Missing code or locationId in URL.");
    }
  }, [searchParams]);

  return (
    <div className="dashboard">
      <h2>{message}</h2>
    </div>
  );
};

export default Dashboard;
