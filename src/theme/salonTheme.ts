import { createTheme } from '@mui/material/styles';

export const salonTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6A3F4D', // Mulberry
      light: '#EBD9DF', // Soft Mulberry Light
      dark: '#4A2B35',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#A8828F', // Muted Rose Gold Accent
      light: '#F8F4EE', // Ivory
      dark: '#73515D',
      contrastText: '#2D1F24',
    },
    background: {
      default: '#F8F4EE', // Ivory
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D1F24', // Deep Mulberry Charcoal
      secondary: '#6E5C63', // Soft Mulberry Taupe
    },
    divider: '#E8DFD5',
    info: {
      main: '#2B6CB0',
      light: '#EBF8FF',
    },
    success: {
      main: '#2F855A',
      light: '#F0FFF4',
    },
    warning: {
      main: '#D69E2E',
      light: '#FEFCBF',
    },
    error: {
      main: '#C53030',
      light: '#FFF5F5',
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h4: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 700,
      color: '#2D1F24',
      letterSpacing: '-0.02em',
    },
    h5: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 700,
      color: '#2D1F24',
      letterSpacing: '-0.01em',
    },
    h6: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      color: '#2D1F24',
    },
    subtitle1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      color: '#6A3F4D',
    },
    subtitle2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      color: '#6E5C63',
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 20px rgba(106, 63, 77, 0.05)',
          border: '1px solid #E8DFD5',
          borderRadius: 16,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(106, 63, 77, 0.05)',
          border: '1px solid #E8DFD5',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 28px rgba(106, 63, 77, 0.10)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(106, 63, 77, 0.15)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});
