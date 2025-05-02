import React, { createContext, useState, useContext } from 'react';

const TemplateContext = createContext();

export const TemplateProvider = ({ children }) => {
  const [selectedTemplateUrl, setSelectedTemplateUrl] = useState("");

  return (
    <TemplateContext.Provider value={{ selectedTemplateUrl, setSelectedTemplateUrl }}>
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = () => useContext(TemplateContext);