import { extendTheme } from '@chakra-ui/react';

// Custom color palette
const colors = {
  brand: {
    50: '#e6f7f7',
    100: '#c3eae9',
    200: '#9fdedd',
    300: '#7bd1d0',
    400: '#57c4c3',
    500: '#34b7b6',
    600: '#2a9291',
    700: '#1f6e6d',
    800: '#154948',
    900: '#0a2424',
  },
  accent: {
    50: '#fff8e6',
    100: '#ffecc0',
    200: '#ffe099',
    300: '#ffd473',
    400: '#ffc84d',
    500: '#ffbc26',
    600: '#cc961e',
    700: '#997117',
    800: '#664b0f',
    900: '#332608',
  },
};

// Custom fonts
const fonts = {
  heading: "'Playfair Display', serif",
  body: "'Poppins', sans-serif",
};

// Component style overrides
const components = {
  Button: {
    baseStyle: {
      fontWeight: '500',
      borderRadius: 'md',
    },
    variants: {
      solid: (props) => ({
        bg: props.colorScheme === 'brand' ? 'brand.500' : undefined,
        _hover: {
          bg: props.colorScheme === 'brand' ? 'brand.600' : undefined,
          transform: 'translateY(-2px)',
          boxShadow: 'md',
        },
        transition: 'all 0.2s ease-in-out',
      }),
      outline: (props) => ({
        borderColor: props.colorScheme === 'brand' ? 'brand.500' : undefined,
        color: props.colorScheme === 'brand' ? 'brand.500' : undefined,
        _hover: {
          bg: props.colorScheme === 'brand' ? 'brand.50' : undefined,
          transform: 'translateY(-2px)',
          boxShadow: 'md',
        },
        transition: 'all 0.2s ease-in-out',
      }),
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'lg',
        boxShadow: 'lg',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        _hover: {
          transform: 'translateY(-8px)',
          boxShadow: 'xl',
        },
      },
    },
  },
  Link: {
    baseStyle: {
      _hover: {
        textDecoration: 'none',
      },
    },
  },
  Heading: {
    baseStyle: {
      fontFamily: 'heading',
      fontWeight: '600',
    },
  },
};

// Global styles
const styles = {
  global: (props) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'gray.900' : 'white',
      color: props.colorMode === 'dark' ? 'white' : 'gray.800',
    },
    // Custom scrollbar
    '::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '::-webkit-scrollbar-track': {
      background: props.colorMode === 'dark' ? 'gray.700' : 'gray.100',
    },
    '::-webkit-scrollbar-thumb': {
      background: props.colorMode === 'dark' ? 'brand.600' : 'brand.400',
      borderRadius: '4px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: props.colorMode === 'dark' ? 'brand.500' : 'brand.500',
    },
  }),
};

// Create the theme configuration
const theme = extendTheme({
  colors,
  fonts,
  components,
  styles,
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
});

export default theme;
