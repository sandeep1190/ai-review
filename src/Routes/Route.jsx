import { Routes, Route, useParams } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Review from "../pages/Review/Review";
import Location from "../pages/Location/Location";
import SignIn from "../pages/Authentication/SignIn";
import Dashboard from "../pages/Dashboard/Dashboard"; 
import CallbackHandler from '../pages/Authentication/CallbackHandler';
import Settings from '../pages/Setting/Settings';
import { ReviewProvider } from "../APIContext/ReviewContext";

// Wrap Review with locationId context
const ReviewProviderWrapper = ({ children }) => {
  const { locationId } = useParams();
  return (
    <ReviewProvider locationId={locationId}>
      {children}
    </ReviewProvider>
  );
};

const Routing = () => {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />

      <Route path="/settings/locations/:locationId" element={<Settings />} />

      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route
          path="/reviews/locations/:locationId"
          element={
            <ReviewProviderWrapper>
              <Review />
            </ReviewProviderWrapper>
          }
        />

        <Route path="/location/:locationId" element={<Location />} />

        <Route path="/callback" element={<CallbackHandler />} />

        {/* Fallback to default location view */}
        <Route path="/" element={<Location />} />
      </Route>
    </Routes>
  );
};

export default Routing;
