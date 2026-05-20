import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // 차분한 녹색
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#1976D2', // 부드러운 파랑
      light: '#42A5F5',
      dark: '#1565C0',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Noto Sans KR", "Roboto", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1.125rem', // 더 큰 기본 글자 크기
      lineHeight: 1.6,
    },
    button: {
      fontSize: '1.125rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 20px',
          textTransform: 'none',
        },
        contained: {
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontSize: '1.125rem',
            padding: '15px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
}); 