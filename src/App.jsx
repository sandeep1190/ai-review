import React from "react";
import './styles/global.scss';
import Routing from "./Routes/Route";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./App.css";
import Header from './components/Header';
import ReviewProvider from "../src/APIContext/ReviewContext";
import { AuthProvider } from '../src/APIContext/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <ReviewProvider>
        <Header />
        <Routing />
      </ReviewProvider>
    </AuthProvider>
  );
};

export default App;
