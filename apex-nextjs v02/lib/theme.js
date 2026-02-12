'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  apex: { key: 'apex', name: 'Apex', dot: '#00d4ff' },
  cyberpunk: { key: 'cyberpunk', name: 'Cyberpunk', dot: '#FCE300' },
  matrix: { key: 'matrix', name: 'Matrix', dot: '#00ff41' },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('apex');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be within ThemeProvider');
  return ctx;
}
