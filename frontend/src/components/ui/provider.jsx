import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { useState, useEffect, createContext, useContext } from 'react';

// Create a context for color mode
const ColorModeContext = createContext({
  colorMode: 'light',
  setColorMode: () => {},
});

// ColorModeProvider component
export function ColorModeProvider({ children }) {
  const [colorMode, setColorMode] = useState('light');

  // Initialize color mode from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem('chakra-ui-color-mode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedMode) {
      setColorMode(savedMode);
      document.documentElement.classList.toggle('dark', savedMode === 'dark');
    } else if (prefersDark) {
      setColorMode('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Update color mode and save to localStorage
  const updateColorMode = (newMode) => {
    setColorMode(newMode);
    localStorage.setItem('chakra-ui-color-mode', newMode);
    document.documentElement.classList.toggle('dark', newMode === 'dark');
  };

  return (
    <ColorModeContext.Provider value={{ colorMode, setColorMode: updateColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
}

// Hook to use color mode
export function useColorMode() {
  const context = useContext(ColorModeContext);
  if (context === undefined) {
    throw new Error('useColorMode must be used within a ColorModeProvider');
  }
  return context;
}

// Provider component that combines ChakraProvider and ColorModeProvider
export function Provider({ children }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>
        {children}
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default Provider;
