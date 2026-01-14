import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeName, ThemeColors, getTheme } from '../constants/themes';

type ThemeContextType = {
  theme: ThemeColors;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
  colorScheme: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [themeName, setThemeNameState] = useState<ThemeName>('midnight');
  
  const colorScheme = systemColorScheme ?? 'light';
  const theme = getTheme(themeName, colorScheme);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem('theme');
      if (saved) {
        setThemeNameState(saved as ThemeName);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const setThemeName = async (name: ThemeName) => {
    try {
      await AsyncStorage.setItem('theme', name);
      setThemeNameState(name);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, setThemeName, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
