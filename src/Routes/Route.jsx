import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Review from "../pages/Review/Review";
import Location from "../pages/Location/Location";
import SignIn from "../pages/Authentication/SignIn";
import Dashboard from "../pages/Dashboard/Dashboard"; 

const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<SignIn />} />
            <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reviews" element={<Review />} />
                <Route path="/locations" element={<Location />} />
            </Route>
        </Routes>
    );
};

export default Routing;