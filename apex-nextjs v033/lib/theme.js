'use client';
import { createContext, useContext, useState, useEffect } from 'react';

var ThemeContext = createContext();

var themes = {
  apex: { key: 'apex', name: 'Dark', dot: '#00d4ff' },
  day: { key: 'day', name: 'Light', dot: '#0088cc' },
  cyberpunk: { key: 'cyberpunk', name: 'Cyber', dot: '#FCE300' },
  matrix: { key: 'matrix', name: 'Matrix', dot: '#00ff41' },
};

function ThemeProvider(props) {
  var _s = useState('apex');
  var theme = _s[0]; var setThemeState = _s[1];

  useEffect(function() {
    try {
      var saved = localStorage.getItem('apex_theme');
      if (saved && themes[saved]) setThemeState(saved);
    } catch(e) {}
  }, []);

  useEffect(function() {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('apex_theme', theme); } catch(e) {}
  }, [theme]);

  function setTheme(t) { if (themes[t]) setThemeState(t); }

  return (
    <ThemeContext.Provider value={{ theme: theme, setTheme: setTheme, themes: themes }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  var ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be within ThemeProvider');
  return ctx;
}

export { themes, ThemeProvider, useTheme };
