import { createTheme } from '@mui/material/styles';

const baseTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#F29F05',
        },
        grey: {
            main: '#C2C2C2',
        },
        text: {
            primary: '#323232',
        },
    },
    shape: {
        borderRadius: 6,
    },
});

// 추가 속성 (styled-components용) 합치기
const theme = {
    ...baseTheme,
    headerHeight: '86px',

    display: {
        sm: '1000px',
        base: '1200px',
    },

    fontSizes: {
        xxs: '0.875rem', // 14px
        xs: '1rem',      // 16px
        sm: '1.125rem',  // 18px
        base: '1.25rem', // 20px
        md: '1.5rem',  // 24px
        lg: '1.875rem',    // 30px
        xl: '2.625rem',  // 42px
    },

    colors: {
        white: '#FFFFFF',
        black: '#323232',
        orange: '#F29F05',
        // orange: '#d2be91',
        // orange: '#f0ece2',
        // orange: '#c2ac7d',
        lightOrange: '#FEF5E6',
        green: '#267365',
        red: '#FF0000',
        dark: '#4C4851',
        lightGrey: '#EEEEEE',
        grey: '#C2C2C2',
        darkGrey: '#999999'
    },

    spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '18px',
        xl: '26px',
        xxl: '38px',
    },

    borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '16px',
        lg: '30px',
        full: '999px',
    },
};

export default theme;
