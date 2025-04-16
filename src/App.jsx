import React from "react";
import './styles/global.scss';
import Routing from "./Routes/Route";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./App.css";
import Header from './components/Header';

const App = () => {
  return (
    <>
      <Header />
      <Routing />
    </>
  );
};

export default App;
