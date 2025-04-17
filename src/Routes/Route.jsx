import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Review from "../pages/Review/Review";
import Location from "../pages/Location/Location";
import SignIn from "../pages/Authentication/SignIn";
import Dashboard from "../pages/Dashboard/Dashboard"; 
import CallbackHandler from '../pages/Authentication/CallbackHandler';

const Routing = () => {
    return (
        
        <Routes>
            <Route path="/" element={<SignIn />} />
            <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reviews" element={<Review />} />
                <Route path="/callback" element={<CallbackHandler />} />
                <Route path="/locations" element={<Location />} />
            </Route>
        </Routes>
    );
};

export default Routing;