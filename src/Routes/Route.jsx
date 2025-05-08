import { Routes, Route, useParams } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Review from "../pages/Review/Review";
import Location from "../pages/Location/Location";
import SignIn from "../pages/Authentication/SignIn";
import Dashboard from "../pages/Dashboard/Dashboard"; 
import CallbackHandler from '../pages/Authentication/CallbackHandler';
import Settings from '../pages/Setting/Settings';
import { ReviewProvider } from "../APIContext/ReviewContext";

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
      <Route path="/" element={<SignIn />} />

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

        <Route path="/callback" element={<CallbackHandler />} />
        <Route path="/locations" element={<Location />} />
      </Route>
    </Routes>
  );
};

export default Routing;
