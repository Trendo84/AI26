import { ColorSchemeName } from 'react-native';

export type ThemeColors = {
  background: string;
  card: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
  tabBar: string;
  headerBackground: string;
};

export type ThemeName = 'midnight' | 'warm' | 'ocean' | 'forest' | 'sunset' | 'lavender';

const themes: Record<ThemeName, { light: ThemeColors; dark: ThemeColors }> = {
  midnight: {
    light: {
      background: '#FAFAFA',
      card: '#FFFFFF',
      primary: '#1C1C1E',
      secondary: '#2C2C2E',
      accent: '#FFB84D',
      text: '#1C1C1E',
      textSecondary: '#8E8E93',
      border: '#E5E5EA',
      tabBar: 'rgba(255,255,255,0.95)',
      headerBackground: '#FAFAFA',
    },
    dark: {
      background: '#000000',
      card: '#1C1C1E',
      primary: '#FFB84D',
      secondary: '#2C2C2E',
      accent: '#FF9500',
      text: '#FFFFFF',
      textSecondary: '#8E8E93',
      border: '#38383A',
      tabBar: 'rgba(28,28,30,0.95)',
      headerBackground: '#000000',
    },
  },
  warm: {
    light: {
      background: '#FFF8F0',
      card: '#FFFFFF',
      primary: '#D2691E',
      secondary: '#8B4513',
      accent: '#FF8C42',
      text: '#3C2415',
      textSecondary: '#A67B5B',
      border: '#F4E4D4',
      tabBar: 'rgba(255,255,255,0.95)',
      headerBackground: '#FFF8F0',
    },
    dark: {
      background: '#1A0F0A',
      card: '#2C1810',
      primary: '#FF8C42',
      secondary: '#D2691E',
      accent: '#FFB366',
      text: '#FFEBD8',
      textSecondary: '#A67B5B',
      border: '#3C2415',
      tabBar: 'rgba(44,24,16,0.95)',
      headerBackground: '#1A0F0A',
    },
  },
  ocean: {
    light: {
      background: '#F0F8FF',
      card: '#FFFFFF',
      primary: '#0077BE',
      secondary: '#005A8D',
      accent: '#00BFFF',
      text: '#001F3F',
      textSecondary: '#5B8FA3',
      border: '#D4E9F7',
      tabBar: 'rgba(255,255,255,0.95)',
      headerBackground: '#F0F8FF',
    },
    dark: {
      background: '#001529',
      card: '#002B4D',
      primary: '#00BFFF',
      secondary: '#0077BE',
      accent: '#40E0D0',
      text: '#E6F4FF',
      textSecondary: '#7BB8D9',
      border: '#003D5C',
      tabBar: 'rgba(0,43,77,0.95)',
      headerBackground: '#001529',
    },
  },
  forest: {
    light: {
      background: '#F4FBF4',
      card: '#FFFFFF',
      primary: '#2D5016',
      secondary: '#1A3D0A',
      accent: '#7CB342',
      text: '#1B3409',
      textSecondary: '#6B8F5B',
      border: '#D9EDD4',
      tabBar: 'rgba(255,255,255,0.95)',
      headerBackground: '#F4FBF4',
    },
    dark: {
      background: '#0A1F0A',
      card: '#1A3D1A',
      primary: '#7CB342',
      secondary: '#558B2F',
      accent: '#9CCC65',
      text: '#E8F5E8',
      textSecondary: '#81A67B',
      border: '#2D5016',
      tabBar: 'rgba(26,61,26,0.95)',
      headerBackground: '#0A1F0A',
    },
  },
  sunset: {
    light: {
      background: '#FFF5F5',
      card: '#FFFFFF',
      primary: '#E63946',
      secondary: '#A8201A',
      accent: '#FF6B6B',
      text: '#2B0D0D',
      textSecondary: '#B85B5B',
      border: '#FFD4D4',
      tabBar: 'rgba(255,255,255,0.95)',
      headerBackground: '#FFF5F5',
    },
    dark: {
      background: '#1A0505',
      card: '#2B0D0D',
      primary: '#FF6B6B',
      secondary: '#E63946',
      accent: '#FF8787',
      text: '#FFE5E5',
      textSecondary: '#C77B7B',
      border: '#3D1515',
      tabBar: 'rgba(43,13,13,0.95)',
      headerBackground: '#1A0505',
    },
  },
  lavender: {
    light: {
      background: '#F9F7FF',
      card: '#FFFFFF',
      primary: '#7C5295',
      secondary: '#5A3A6F',
      accent: '#B388EB',
      text: '#2D1B3D',
      textSecondary: '#9B7FB5',
      border: '#E8DFFF',
      tabBar: 'rgba(255,255,255,0.95)',
      headerBackground: '#F9F7FF',
    },
    dark: {
      background: '#12051F',
      card: '#1F0A33',
      primary: '#B388EB',
      secondary: '#9370DB',
      accent: '#D5B8FF',
      text: '#F0E5FF',
      textSecondary: '#A98FBF',
      border: '#2D1B3D',
      tabBar: 'rgba(31,10,51,0.95)',
      headerBackground: '#12051F',
    },
  },
};

export const getTheme = (themeName: ThemeName, colorScheme: ColorSchemeName): ThemeColors => {
  return themes[themeName][colorScheme === 'dark' ? 'dark' : 'light'];
};

export const themeNames: ThemeName[] = ['midnight', 'warm', 'ocean', 'forest', 'sunset', 'lavender'];

export const themeDisplayNames: Record<ThemeName, string> = {
  midnight: 'Midnight',
  warm: 'Warm Hearth',
  ocean: 'Ocean Blue',
  forest: 'Forest Green',
  sunset: 'Sunset Rose',
  lavender: 'Lavender Dream',
};
