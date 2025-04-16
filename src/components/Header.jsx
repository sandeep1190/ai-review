import React from 'react';
import logo from '../assets/images/logo.png';

const Header = () => {
  return (
    <header className="header">
      <div className="container mx-auto flex justify-center items-center">
      <img src={logo} alt="Logo" className="h-10" />
      </div>
    </header>
  );
};

export default Header;
