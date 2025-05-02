import React from "react";
import './styles/global.scss';
import Routing from "./Routes/Route";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./App.css";
import Header from './components/Header';
import { ReviewProvider } from "../src/APIContext/ReviewContext";
import { AuthProvider } from '../src/APIContext/AuthContext';
import { LocationProvider } from './APIContext/LocationContext';
import { TemplateProvider } from './APIContext/TemplateContext'; 
import { useParams } from 'react-router-dom';

const App = () => {

  const { locationId } = useParams();  

  return (
    <AuthProvider>
      <TemplateProvider> {/* Wrap the app with TemplateProvider */}
        <ReviewProvider locationId={locationId}>
          <LocationProvider>
            <Header />
            <Routing />
          </LocationProvider>
        </ReviewProvider>
      </TemplateProvider>
    </AuthProvider>
  );
};

export default App;
