import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [locationName, setLocationName] = useState("");

  const getQueryParam = (key) => {
    return new URLSearchParams(location.search).get(key);
  };

  const locationId = getQueryParam("location");

  useEffect(() => {
    if (locationId) {
      axios
        .post("https://aireview.lawfirmgrowthmachine.com/api/token/", {
          locationId,
        })
        .then((res) => {
          const token = res.data.access;
          return axios.get("https://aireview.lawfirmgrowthmachine.com/api/locations/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        })
        .then((res) => {
          const matchedLocation = res.data.find(
            (loc) => loc.location_id.split("/")[1] === locationId
          );
          if (matchedLocation?.name) {
            setLocationName(matchedLocation.name);
          }
        })
        .catch((err) => {
          console.error("Error fetching location name:", err);
        });
    }
  }, [locationId]);

  const pathname = location.pathname;

  let pageTitle = "Reviews";
  if (pathname.startsWith("/settings/locations/")) {
    pageTitle = "Settings";
  }

  const showBreadcrumb =
    pathname.startsWith("/reviews/locations/") ||
    pathname.startsWith("/settings/locations/");

  const constructLocationUrl = () => {
    const currentParams = new URLSearchParams(location.search);
    if (!locationId) {
      currentParams.set("location", "0OKk2AUg2zJwKTYNwnmf");
    }
    return `/?${currentParams.toString()}`;
  };

  return (
    <header className="page-header">
      <h1>{pageTitle}</h1>

      {showBreadcrumb && (
        <div className="breadcrumb">
          <Link to={constructLocationUrl()}>
            {locationName || "Location"}
          </Link>
          <span> / </span>
          <span>{pageTitle}</span>
        </div>
      )}
    </header>
  );
};

export default Header;
