import { createTheme } from '@mui/material/styles';

export const getDashboardTheme = (mode) => createTheme({
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
        mode,
        primary: {
            main: mode === 'dark' ? '#b7b7b7' : '#5b504b',
        },
        secondary: {
            main: mode === 'dark' ? '#B5A79A' : '#83776B',
        },
        background: {
            default: mode === 'dark' ? '#292929' : '#FFFFFF',
            paper: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
        },
        text: {
            primary: mode === 'dark' ? '#FFFFFF' : '#000000',
            secondary: mode === 'dark' ? '#B0B0B0' : '#5F5F5F',
        },
        icon: {
            main: mode === 'dark' ? '#FFFFFF' : '#5b504b'
        }
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: mode === 'dark' ? '#FFFFFF' : '#7c7164',
                    },
                },
            },
        },
    },
});