import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: 'Outfit, sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '2.125rem',
        },
        h2: {
            fontWeight: 700,
            fontSize: '1.5rem',
        },
        body1: {
            fontWeight: 400,
            fontSize: '1rem',
        },
        button: {
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'none',
        },
    },
    palette: {
        primary: {
            main: '#5b504b',
        },
        secondary: {
            main: '#83776B',
        },
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#7c7164',
                    },
                },
            },
        },
    },
});

export default theme;