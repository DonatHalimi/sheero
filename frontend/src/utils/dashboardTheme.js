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
            paper: mode === 'dark' ? '#292929' : '#FFFFFF',
        },
        text: {
            primary: mode === 'dark' ? '#FFFFFF' : '#5c504b',
            secondary: mode === 'dark' ? '#B0B0B0' : '#5F5F5F',
        },
        icon: {
            main: mode === 'dark' ? '#FFFFFF' : '#5b504b'
        },
        border: {
            default: mode === 'dark' ? '#393939' : '#e0e0e0',
        },
        button: {
            main: mode === 'dark' ? '#545454' : '#5b504b',
            disabled: mode === 'dark' ? '#393939' : '#e0e0e0',
            hover: mode === 'dark' ? '#5e5d5d' : '#5B504B',
            text: mode === 'dark' ? '#e0dede' : '#FFFFFF',
        },
        scrollbar: {
            thumb: mode === 'dark' ? '#4A4A4A' : '#CACFCD',
            thumbHover: mode === 'dark' ? '#6A6A6A' : '#acb2b0',
            track: mode === 'dark' ? '#2D2D2D' : '#F8F9FA',
            corner: mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
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