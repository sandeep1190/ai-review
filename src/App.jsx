import React from "react";
import './styles/global.scss';
import { Routes, Route } from "react-router-dom";
import Review from "./pages/Review/Review";
import Location from "./pages/Location/Location";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Review />} />
      <Route path="/locations" element={<Location />} /> 
    </Routes>
  );
};

export default App;
