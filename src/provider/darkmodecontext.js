//src provider darkmodecontext.js
'use client'
import React, { createContext, useContext } from 'react';
import { useDarkMode } from '@/hooks/usedarkMode';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkModeContext = () => useContext(DarkModeContext);
