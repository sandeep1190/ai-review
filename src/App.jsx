import React from "react";
import './styles/global.scss';
import Routing from "./Routes/Route";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./App.css";

import Header from './components/Header';
import { OAuthProvider } from './APIContext/OAuthContext';
import { ReviewProvider } from "./APIContext/ReviewContext";
import { AuthProvider } from './APIContext/AuthContext';
import { LocationProvider } from './APIContext/LocationContext';
import { TemplateProvider } from './APIContext/TemplateContext';
import { SettingsProvider } from './APIContext/SettingsContext';
import { SocialMediaProvider } from './APIContext/SocialMediaContext';
import { TokenProvider } from './APIContext/TokenContext';

const App = () => {
  return (
    <OAuthProvider>
    <AuthProvider>
      <SocialMediaProvider>
        <SettingsProvider>
          <TemplateProvider>
            <TokenProvider>
              <ReviewProvider>
                <LocationProvider>
                  <Header />
                  <Routing />
                </LocationProvider>
              </ReviewProvider>
            </TokenProvider>
          </TemplateProvider>
        </SettingsProvider>
      </SocialMediaProvider>
    </AuthProvider>
    </OAuthProvider>
  );
};

export default App;
